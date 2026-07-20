(function () {
  "use strict";

  var classifier = {
    ready: false,
    status: "not-trained",
    labels: [],
    model: null,
    oneClassModel: null,
    lastPrediction: null,

    buildOneClassModel: function (label, samples, featureCount) {
      var centroid = Array(featureCount).fill(0);
      var validSamples = samples.filter(function (sample) {
        return sample && sample.label === label && sample.features && sample.features.length === featureCount;
      });

      validSamples.forEach(function (sample) {
        for (var i = 0; i < featureCount; i++) centroid[i] += sample.features[i];
      });
      for (var c = 0; c < featureCount; c++) centroid[c] /= Math.max(validSamples.length, 1);

      var distances = validSamples.map(function (sample) {
        var sumSq = 0;
        for (var i = 0; i < featureCount; i++) {
          var diff = sample.features[i] - centroid[i];
          sumSq += diff * diff;
        }
        return Math.sqrt(sumSq / featureCount);
      });

      var mean = distances.reduce(function (sum, value) { return sum + value; }, 0) / Math.max(distances.length, 1);
      var variance = distances.reduce(function (sum, value) {
        var diff = value - mean;
        return sum + diff * diff;
      }, 0) / Math.max(distances.length, 1);
      var stdDev = Math.sqrt(variance);

      return {
        label: label,
        centroid: centroid,
        featureCount: featureCount,
        threshold: Math.max(mean + stdDev * 2.75, mean * 1.65, 0.32)
      };
    },

    train: function () {
      var samplesData = window.TETRIS_GESTURE_SAMPLES || {};
      var samples = samplesData.samples || [];
      var featureCount = samplesData.featureCount || 63;
      this.ready = false;
      this.model = null;
      this.oneClassModel = null;
      if (samples.length < 20) {
        this.status = samples.length ? "not-enough-samples" : "no-samples";
        return Promise.resolve(false);
      }

      var labelMap = {};
      samples.forEach(function (sample) {
        if (sample && sample.label && !labelMap[sample.label]) labelMap[sample.label] = true;
      });
      this.labels = Object.keys(labelMap).sort();
      if (this.labels.length < 1) {
        this.status = "no-labels";
        return Promise.resolve(false);
      }

      if (this.labels.length < 2) {
        this.oneClassModel = this.buildOneClassModel(this.labels[0], samples, featureCount);
        this.ready = true;
        this.status = "ready-single-class";
        return Promise.resolve(true);
      }

      if (!window.tf) {
        this.status = "tfjs-missing";
        return Promise.resolve(false);
      }

      var labelIndex = {};
      this.labels.forEach(function (label, index) { labelIndex[label] = index; });

      var xsData = samples.map(function (sample) { return sample.features; });
      var ysData = samples.map(function (sample) {
        var row = Array(classifier.labels.length).fill(0);
        row[labelIndex[sample.label]] = 1;
        return row;
      });

      var xs = tf.tensor2d(xsData);
      var ys = tf.tensor2d(ysData);

      var model = tf.sequential();
      model.add(tf.layers.dense({ units: 32, activation: "relu", inputShape: [featureCount] }));
      model.add(tf.layers.dropout({ rate: 0.15 }));
      model.add(tf.layers.dense({ units: this.labels.length, activation: "softmax" }));
      model.compile({
        optimizer: tf.train.adam(0.01),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
      });

      this.status = "training";
      return model.fit(xs, ys, {
        epochs: 28,
        batchSize: 32,
        shuffle: true,
        verbose: 0
      }).then(function () {
        xs.dispose();
        ys.dispose();
        classifier.model = model;
        classifier.ready = true;
        classifier.status = "ready";
        return true;
      }).catch(function (err) {
        xs.dispose();
        ys.dispose();
        classifier.status = "error";
        console.warn("[GestureClassifier] training failed", err);
        return false;
      });
    },

    predict: function (features) {
      if (!this.ready || !features) return null;

      if (this.oneClassModel) {
        if (features.length !== this.oneClassModel.featureCount) return null;
        var sumSq = 0;
        for (var c = 0; c < this.oneClassModel.featureCount; c++) {
          var diff = features[c] - this.oneClassModel.centroid[c];
          sumSq += diff * diff;
        }
        var distance = Math.sqrt(sumSq / this.oneClassModel.featureCount);
        var threshold = this.oneClassModel.threshold;
        var confidence = distance <= threshold
          ? 0.8 + (1 - (distance / threshold)) * 0.2
          : Math.max(0, 0.8 * (threshold / Math.max(distance, 0.001)));

        this.lastPrediction = {
          label: distance <= threshold ? this.oneClassModel.label : "unknown",
          confidence: confidence
        };
        return this.lastPrediction;
      }

      if (!this.model) return null;
      var output = tf.tidy(function () {
        var input = tf.tensor2d([features]);
        return classifier.model.predict(input).dataSync();
      });

      var bestIndex = 0;
      var bestScore = output[0] || 0;
      for (var i = 1; i < output.length; i++) {
        if (output[i] > bestScore) {
          bestScore = output[i];
          bestIndex = i;
        }
      }

      this.lastPrediction = {
        label: this.labels[bestIndex] || "unknown",
        confidence: bestScore
      };
      return this.lastPrediction;
    }
  };

  window.TetrisGestureClassifier = classifier;
  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () { classifier.train(); }, 300);
  });
})();

/* ----------------------------------------------------------------------------------------------------
 * KNN Classifier, 2022
 * Created: 03/14/22 by Gille de Bast
 * 
 * Class to classify canvas pixels with ML5.js KNNcmassifier
 * Reference : https://github.com/yeswanth/ml5-website-2/blob/master/docs/reference/api-KNNClassifier.md
 * 
 * Update: 03/14/22 Current V.1
 * ----------------------------------------------------------------------------------------------------
 */

class Classifier{

  constructor(canvasEl){
    this.canvas = canvasEl;
    this.knnClassifier = ml5.KNNClassifier();
    const self = this;
    this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
      self.onModelReadyStateChange();
    });
  }

  onModelReadyStateChange(){}
  ready(listener){
    this.onModelReadyStateChange = listener;
  }

  add(label){
    const features = this.featureExtractor.infer(this.canvas);
    this.knnClassifier.addExample(features, label);
  }

  start(){
    const numLabels = this.knnClassifier.getNumLabels();
    if (numLabels <= 0) {
      console.error('There is no examples in any label');
      return;
    }
    const features = this.featureExtractor.infer(this.canvas);
    const self = this;
    this.knnClassifier.classify(features, (err, result) => {
      if (err) console.error(err);
      if (result.confidencesByLabel) {
        if (result.label) this.onResultStateChange(result.label, result.confidencesByLabel[result.label] * 100);
      }
      self.start();
    });
  }

  onResultStateChange(){}
  onResult(listener){
    this.onResultStateChange = listener;
  }
}
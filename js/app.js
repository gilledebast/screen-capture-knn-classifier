const source = document.getElementById('video');
const canvas = document.getElementById('result');
const logs   = document.getElementById('logs');
const btn    = {
  start:      document.getElementById("start-capture"),
  stop:       document.getElementById("stop-capture"),
  class1:     document.getElementById("add-class1"),
  class2:     document.getElementById("add-class2"),
  background: document.getElementById("add-background"),
  classify:   document.getElementById("start-classify") 
}

btn.stop.disabled       = true;
btn.class1.disabled     = true;
btn.class2.disabled     = true;
btn.background.disabled = true;
btn.classify.disabled   = true;

//–––––––––– SCREEN CAPTURE INTERFACE ––––––––––

const capture = new Capture(source, canvas);

btn.start.addEventListener("click", (e) => {
  capture.start();
  btn.start.disabled = true;
  btn.stop.disabled  = false;
});

btn.stop.addEventListener("click", (e) => {
  capture.stop();
  btn.start.disabled = false;
  btn.stop.disabled  = true;
});

//–––––––––– ML5.JS INTERFACE ––––––––––

const classifier = new Classifier(canvas);

classifier.ready(() => {
  console.log("model ready !");
  logs.innerText = "model ready !";
  btn.class1.disabled     = false;
  btn.class2.disabled     = false;
  btn.background.disabled = false;
  btn.classify.disabled   = false;

});

classifier.onResult((label, confidence) => {
  console.log(`last result : ${label} | confience ${confidence} %`);
  logs.innerText = `last result : ${label} | confience ${confidence} %`;
});

btn.class1.addEventListener("click", (e) => {
  classifier.add("class1");
});

btn.class2.addEventListener("click", (e) => {
  classifier.add("class2");
});

btn.background.addEventListener("click", (e) => {
  classifier.add("background");
});

btn.classify.addEventListener("click", (e) => {
  classifier.start();
});
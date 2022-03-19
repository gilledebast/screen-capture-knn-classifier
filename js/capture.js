/* ----------------------------------------------------------------------------------------------------
 * Screen capture, 2022
 * Created: 03/14/22 by Gille de Bast
 * 
 * Class to stream screen capture on a canvas
 *
 * Update: 03/15/22 Current V.1
 * ----------------------------------------------------------------------------------------------------
 */

class Capture{

  constructor(sourceEl, canvasEl){
    this.source = {
      el: sourceEl,
      x: 0,
      y: 0,
      w: null,
      h: null
    };
    this.canvas = canvasEl;
    this.ctx = this.canvas.getContext('2d');
    this.isStarted = false;

    this.crop = new Crop(this.canvas);
    this.crop.onFinish((x, y, w, h) => {
      this.source.x = x;
      this.source.y = y;
      this.source.w = w;
      this.source.h = h;
    });
  }

  async start(){
    if(this.isStarted){ console.warn("screen capture already started !"); return; }
    try {
      this.source.el.srcObject = await navigator.mediaDevices.getDisplayMedia({video:{cursor: "always"},audio: false});
      const videoTrack = this.source.el.srcObject.getVideoTracks()[0];
  
      let settings = videoTrack.getSettings();
      console.log("starting canvas…", settings);
      
      this.canvas.width = settings.width;
      this.canvas.height = settings.height;

      this.source.w = settings.width;
      this.source.h = settings.height;
      this.isStarted = true;

      window.requestAnimationFrame(() => {
        this.draw();
      });

    } catch(err) {
      console.error("Error: " + err);
    }
  }

  stop() {
    if(!this.isStarted){ console.warn("screen capture isn't started :("); return; }
    let tracks = this.source.el.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    this.source.el.srcObject = null;
    this.isStarted = false;
  }

  draw(){
    window.requestAnimationFrame(() => {
      this.draw();
    });
    this.ctx.drawImage(this.source.el, this.source.x, this.source.y, this.source.w, this.source.h, 0, 0, this.canvas.width, this.canvas.height);
  }
}

/**
 * Basic video cropping tool
 * Created: 03/15/22 by Gille de Bast
 *
 * Update: 03/15/22 Current V.1
 */
class Crop{

  constructor(canvasEl){

    this.canvas = canvasEl;
    this.ctx = this.canvas.getContext('2d');

    this.isDrawing = false;
    this.origin = {
      x: 0,
      y: 0
    };
    
    this.init();
  }

  init(){
    this.canvas.addEventListener('mousedown', (e) => {
      this.origin.x = e.offsetX;
      this.origin.y = e.offsetY;
      this.isDrawing = true;
      this.clear();
      this.canvas.style.cursor = "crosshair";
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDrawing) {
        this.clear();
        this.ctx.beginPath();
        this.ctx.rect(this.origin.x, this.origin.y, e.offsetX - this.origin.x, e.offsetY - this.origin.y);  
        this.ctx.stroke();
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.canvas.style.cursor = "default";
        this.onFinishStateChange(this.origin.x, this.origin.y, e.offsetX - this.origin.x, e.offsetY - this.origin.y);
      }
    });
  }

  onFinishStateChange(x,y,w,h){}
  onFinish(listener){
    this.onFinishStateChange = listener;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
  }
}
// P5.jsの自分のスケッチ My3rdP5_Animation4.js

//canvasを格納する変数の定義
let canvas;
let array = [];

function setup(){
  canvas = createCanvas(640, 480);
  canvas.class=("myCanvas");

  colorMode(RGB, 255);
  background(255);
  frameRate(30);
  }

function draw(){
  background(255);
  noStroke();
  
  for(let i=0; i<1; i++) {
    array.push(new DrawEllipse());
  }

  for(let i=0; i<array.length; i++){
    if (array[i].getAlpha < 0 || array[i].getDelete) {
      array = array.filter(n => n !== array[i]);
    }
    array[i].drawEllipse();
  }
}

class DrawEllipse {
  constructor() {
    this.frame = 0;
    this.a = 255;
    //パステル調にするために，RGBの値を100~255にする。
    this.r = random(155) + 100;
    this.g = random(155) + 100;
    this.b = random(155) + 100;
    this.x = random(width); //xの位置は0~width(キャンバスの横幅)
    // this.y = random(height); //yの位置は0~height(キャンバスの縦長)
    this.y = height;
    this.w = random(5, 10); //大きさは20~40
    this.ym = height/2 + random(height/2)
  }

  get getAlpha() {
    return this.a;
  }

  get getFrame() {
    return this.frame;
  }

  get getDelete() {
    let flg;
    if (255 < this.frame) {
      flg = true;
    } else {
      flg = false;
    }
    return flg;
  }

  drawEllipse() {
    this.frame = this.frame + 1
    if (this.frame < 50) {
      for (let i=0; i < 30; i++) {
        this.draw(this.x, this.y + i*4, this.w, this.a - (i*round((255/30))));
      }
      this.y = this.y - round(this.ym/60);
    } else {
      for (let i=0; i < 30; i++) {
        this.draw(this.x, this.y + i*4, this.w, this.a - (i*round((255/30))));
      }
      this.frame = 256
    }
  }

  draw(x, y, w, a) {
    let c = color(this.r, this.g, this.b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

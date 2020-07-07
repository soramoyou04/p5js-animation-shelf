// P5.jsの自分のスケッチ My3rdP5_Animation4.js

//canvasを格納する変数の定義
let canvas;
let array = [];

function setup(){
  canvas = createCanvas(640, 480);
  canvas.class=("myCanvas");

  colorMode(RGB, 255);
  background(255);
  frameRate(10);
  }

function draw(){
  background(255);
  noStroke();
  
  for(let i=0; i<3; i++) {
    array.push(new DrawEllipse());
  }

  for(let i=0; i<array.length; i++){
    array[i].drawEllipse();
    // 完全に消えた図形を配列から削除する
    if (array[i].getAlpha < 0) {
      array = array.filter(n => n !== array[i]);
    }
  }
}

class DrawEllipse {
  constructor() {
    //パステル調にするために，RGBの値を100~255にする．
    this.r = random(155) + 100;
    this.g = random(155) + 100;
    this.b = random(155) + 100;
    this.x = random(width); //xの位置は0~width(キャンバスの横幅)
    this.y = random(height); //yの位置は0~height(キャンバスの縦長)
    this.w = random(20) + 20; //大きさは20~40
    this.a = 255;
  }

  get getAlpha() {
    return this.a;
  }

  drawEllipse() {
    this.draw(this.a);
    this.a = this.a - 4;
  }

  draw(al) {
    let c = color(this.r, this.g, this.b);
    c.setAlpha(al);
    fill(c);
    ellipse(this.x, this.y, this.w, this.w);
  }
}



// function setup(){
  
// }

// function draw(){
//   var n = 20;
//   for(var i = 0; i < n; i++){
//     if(i % 2 == 0){
//       fill(0);
//     }
//     else{
//       fill(255);
//     }
//     rect(0, i * height / n, width, height / n);
//   }
// }

// var fireworks = [];
// var gravity;
// var canvas;

// function windowResized() {
//   resizeCanvas(document.documentElement.offsetWidth, document.documentElement.offsetHeight);//3Dの場合は引数にWEBGLを忘れずに！
//   background(255);//再描画後に背景を再描画する
// }

// function setup(){
//   canvas=createCanvas(document.documentElement.offsetWidth, document.documentElement.offsetHeight); // canvasを作成
//   canvas.position(0,0);//canvasをページの原点に固定
//   canvas.style('z-index','-1');//canvasを後ろに移動する
//   colorMode(HSB); //花火を出す色の指定の仕方
//   gravity = createVector(0,0.4);
//   stroke(60,255);// 線の色を設定
//   strokeWeight(4);// 線の太さ
//   background(255);// 背景を黒く指定
// }

// function draw(){
//   colorMode(RGB); // 花火を出す色の指定の仕方
//   background('rgba(255,255,255,0.1)');// 背景に少し透明なのを重ねてだんだん消えて行くように
//   if (random(1) < 0.15){
//     fireworks.push(new Firework());// fireworksという配列にfirewokという関数の中身を追加する。
//   }
//   //花火の見せ方
//   for (var i = fireworks.length-1; i >= 0; i--){
//     fireworks[i].update();
//     fireworks[i].show();
//     if(fireworks[i].done()){
//       fireworks.splice(i, 1);
//     }
//   }
// }
// ;
// function Firework(){
//   this.hu = random(60,255); // 花火の色相
//   this.firework = new Particle(random(width), height, this.hu, true);
//   this.exploded = false;
//   this.particles = [];
// // 花火が打ち上がったのかをチェックする関数
//   this.done = function(){
//     if (this.exploded && this.particles.length === 0){
//       return true;
//     }else{
//       return false;
//     }
//   }
// // 花火が打ち上がったらどのように落ちて行くのかを設定
//   this.update = function(){
//     if (!this.exploded){
//       this.firework.applyForce(gravity);// gravity分だけ下に下げる関数(particle.jsで定義)
//       this.firework.update();
//       if (this.firework.vel.y >= 0) {
//         this.exploded = true;
//         this.explode();
//       }
//     }
//     for (var i = this.particles.length-1; i >= 0; i--){
//       this.particles[i].applyForce(gravity);
//       this.particles[i].update();
//       if(this.particles[i].done()){
//         this.particles.splice(i, 1);
//       }
//     }
//   }
// // 花火がどのように爆発して開くのかをチェックする関数
//   this.explode = function(){
//     for (var i = 0; i < 100; i++){
//       var p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
//       this.particles.push(p);
//     }
//   }
// // 花火を見せるための関数
//   this.show = function(){
//     if (!this.exploded){
//       this.firework.show();
//     }
//     for (var i = 0; i < this.particles.length; i++){
//       this.particles[i].show();
//     }
//   }
// }
// function Particle(x, y, hu, firework){
//   this.pos = createVector(x,y);
//   this.firework = firework; // 基本的にtrue
//   this.lifespan = 255;
//   this.hu = hu; //friework.jsで定義した色相をここでも代入
//   //ランダムにベクトルを定義
//   if (this.firework){
//     this.vel = createVector(0,random(-29, -15));
//   }else{
//     this.vel = p5.Vector.random2D(); // ランダムにベクトルを定義
//     this.vel.mult(random(5, 35));
//   }
//   this.acc = createVector(0,0);
//   this.applyForce = function(force) {
//     this.acc.add(force);
//   }
//   this.update = function(){
//     if (!this.firework){
//       this.vel.mult(0.85);
//       this.lifespan -= 6;
//     }
//     this.vel.add(this.acc);
//     this.pos.add(this.vel);
//     this.acc.mult(0);
//   }
//   this.done = function(){
//     if(this.lifespan < 0){
//       return true;
//     }else {
//       return false;
//     }
//   }
//   this.show = function(){
//     colorMode(HSB);
//     if(!this.firework){
//       strokeWeight(3);
//       stroke(hu, 255, 255, this.lifespan);// hsbの定義で線を描画
//     }else{
//       strokeWeight(6);
//       stroke(hu, 255,255)// hsbの定義で線を描画
//     }
//     point(this.pos.x, this.pos.y);//点を描画
//   }
// }
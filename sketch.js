let canvas;
let fireworks = [];

function windowResized() {
  resizeCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
}

function setup(){
  // キャンバスの設定
  canvas=createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  colorMode(RGB);
  frameRate(60);
}

function draw(){
  // 背景色を設定
  background(0);
  noStroke();

  // 花火を打ち上げる間隔を調整0
  if (0 === frameCount%20) {
    fireworks.push(new DrawEllipse());
  }

  for(let i=0; i<fireworks.length; i++){
    // 打ち切った花火を処理対象から外す（配列から削除する）
    if (fireworks[i].getAlpha < 0 || fireworks[i].getDelete) {
      fireworks = fireworks.filter(n => n !== fireworks[i]);
    }

    // 打ち上げアニメーションを呼び出す
    if (fireworks[i].getRisingFlg) {
      fireworks[i].drawRising();
    }

    // 打ち上がったら爆発アニメーションを呼び出す
    // if (array[i].getExplosionFlg) {
    // }
  }
}

class DrawEllipse {
  constructor() {
    // 初期設定 //////////
    // 花火の色
    this.r = random(155) + 100;
    this.g = random(155) + 100;
    this.b = random(155) + 100;
    this.a = 255;

    // 初期位置
    this.x = random(width);
    this.y = height;

    // 花火の玉の大きさ
    this.w = random(5, 10);

    // 花火の高さ
    this.maxHeight = random(height/8, height/2);

    // 処理で使うためのステータス
    this.risingFlg = true;
    this.explosionFlg = false;
    this.frame = 0;

    let speed=1;
    let gravity=0.2;
  }

  get getAlpha() {
    return this.a;
  }

  get getFrame() {
    return this.frame;
  }

  get getRisingFlg() {
    return this.risingFlg;
  }

  get getExplosionFlg() {
    return this.explosionFlg;
  }

  get getDelete() {
    return 255 < this.frame ? true : false;
  }

  // 打ち上げアニメーション
  drawRising() {
    this.frame = this.frame + 1;

    // 打ち上がるスピード
    this.y = this.y - ((height - this.maxHeight)/(100-(20-this.frame)));

    // 残像を制御
    for (let i=30; 0<i; i--) {
      if (this.y - (this.y - height)/i < height) {
        this.update(this.x, this.y - (this.y - height)/i, this.w-(this.w-i/2), this.a - (round((32/i))));
      }
    }

    // 一定時間経ったら徐々に消す
    if (80 < this.frame) {
      this.a = this.a - 5;
    }
  }

  // 花火を表示する
  update(x, y, w, a) {
    let c = color(this.r, this.g, this.b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

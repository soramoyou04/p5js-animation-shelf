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

  // 花火を打ち上げる間隔を調整
  if (0 === frameCount%45) {
    fireworks.push(new FireWork());
  }

  for(let i=0; i<fireworks.length; i++){
    // 打ち切った花火を処理対象から外す（配列から削除する）
    if (fireworks[i].getAlpha < 0 || fireworks[i].getDelete) {
      fireworks = fireworks.filter(n => n !== fireworks[i]);
    }

    // 打ち上げアニメーションを呼び出す
    if (0 === fireworks[i].getType) {
      fireworks[i].drawRising();
    }

    // 打ち上がったら爆発アニメーションを呼び出す
    if (0 !== array[i].getType) {
      fireworks[i].drawExplosion();
    }
  }
}

class FireWork {
  // 初期設定
  constructor(r, g, b, a, vx, vy, gv, type) {
    // 花火の色
    if (r) {
      this.r = r;
    } else {
      this.r = random(155) + 100;
    }
    if (g) {
      this.g = g;
    } else {
      this.g = random(155) + 100;
    }
    if (b) {
      this.b = b;
    } else {
      this.b = random(155) + 100;
    }
    if (a) {
      this.a = a;
    } else {
      this.a = 255;
    }

    // 重力
    if (vx) {
      this.vx = vx;
    }
    if (vy) {
      this.vy = vy;
    }
    if (gv) {
      this.gv = gv;
    }

    // 初期位置
    if (x) {
      this.x = x;
    } else {
      this.x = random(width);
    }
    if (y) {
      this.y = y;
    } else {
      this.y = height;
    }
    
    // 花火の玉の大きさ
    if (w) {
      this.w = w;
    } else {
      this.w = random(10, 5);
    }

    // 花火の高さ
    this.maxHeight = random(height/4, height/2);

    // 花火が打ち上がる速さ
    this.speed = 90;

    // 残像のズレ
    this.n = [];
    for (let i=30; 0<i; i--) {
      this.n.push(random(-i/2, i/2));
    }

    // 花火のタイプ
    if (type) {
      this.type = type;
    } else {
      // 0:打ち上げ
      this.type = 0;
    }
    
    // フレームカウンター
    this.frame = 0;
  }

  get getAlpha() {
    return this.a;
  }

  get getFrame() {
    return this.frame;
  }

  get getType() {
    return this.type;
  }

  get getDelete() {
    return 255 < this.frame ? true : false;
  }

  // 打ち上げアニメーション
  drawRising() {
    this.frame = this.frame + 1;

    // 打ち上がるスピード
    this.y = this.y - (sin((((this.speed*2)-this.frame)/100)*90/this.speed))*((height - this.maxHeight)/100);

    // 残像を制御
    for (let i=30; 0<i; i--) {
      if (this.y - (this.y - height)/i < height) {
        this.update(this.x + this.n[i], this.y - (this.y - height)/i, this.w-(this.w-i/2), this.a - (round((32/i))));
      }
    }

    // 一定時間経ったら徐々に消す
    if (this.speed*1.2 < this.frame) {
      this.a = this.a - 5;
    }
  }

  drawExplosion() {
    this.frame = this.frame + 1;

    // 爆発のための移動（重力に引っ張られる）
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gv;

    update(x, y, w, a);
    
  }

  // 花火を表示する
  update(x, y, w, a) {
    let c = color(this.r, this.g, this.b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

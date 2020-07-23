const Y_AXIS = 1;
const X_AXIS = 2;
let canvas;
let fireworks = [];
let star = [];

function windowResized() {
  resizeCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
  this.preStar();
}

function setup() {
  // キャンバスの設定
  canvas = createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  colorMode(RGB);
  frameRate(60);
  this.preStar();
}

function draw() {
  // 背景色を設定
  setGradient(0, 0, width, height, color(0, 0, 0), color(24, 32, 72), Y_AXIS);
  // background(0);
  noStroke();

  // 星を描く
  this.drawStar();

  // 花火を打ち上げる間隔を調整
  if (0 === frameCount % 100) {
    // 打ち上がるスピード
    let speed = random(10, 30);
    fireworks.push(new FireWork(random(width), height, 0, speed, 0.98));
  }

  for (let fw of fireworks) {
    // 打ち切った花火を処理対象から外す（配列から削除する）
    if (2 === fw.getType || 30000 < fw.getFrame) {
      fireworks = fireworks.filter(n => n !== fw);
      continue;
    }

    // 打ち上げアニメーションを呼び出す
    fw.fire();
  }
}

class FireWork {
  // 初期設定
  constructor(x, y, vx, vy, gv) {
    // フレームカウンター
    this.frame = 0;
    this.type = 0;
    this.next = 0;
    // 花火の色
    this.r = random(155) + 80;
    this.g = random(155) + 80;
    this.b = random(155) + 80;
    this.a = 255;

    // 初期位置
    this.x = x;
    this.y = y;

    // 玉の大きさ
    this.w = random(10, 5);

    // 打ち上がる高さ
    this.maxHeight = random(height / 6, height / 2);
    this.fireHeight = (height - this.maxHeight)

    // 重力
    this.vx = vx;
    this.vy = vy;
    this.gv = gv;

    // 残像表示用配列
    this.afterImages = [];
    // 爆発用配列
    this.explosions = [];

    // 爆発の大きさ
    this.large = random(5, 15);
    // 爆発の玉の数
    this.ball = random(20, 100);
    // 爆発から消えるまでの長さ
    this.exend = random(20, 40);
    // 爆発のブレーキ
    this.exStop = 0.96;
  }

  get getFrame() {
    return this.frame;
  }

  get getType() {
    return this.type;
  }

  fire() {
    switch (this.type) {
      case 0:
        this.rising();
        break;
      case 1:
        this.explosion();
        break;
    }
  }

  // 打ち上げアニメーション
  rising() {
    // 頂点まで達したら消す
    if (this.y * 0.8 < this.maxHeight) {
      this.a = this.a - 6;
    }

    // 指定の高さまで上昇する
    this.x += this.vx;
    this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);

    // 残像を表示
    this.afterImages.push(new Afterimage(this.r, this.g, this.b, this.x, this.y, this.w, this.a));
    for (let ai of this.afterImages) {
      ai.image();
      if (ai.getAlpha <= 0) {
        this.afterImages = this.afterImages.filter(n => n !== ai);
      }
    }

    // 打ち上げ表示
    this.update(this.x, this.y, this.w);

    // 全ての表示が消えたら処理の種類を変更する
    if (0 == this.afterImages.length) {
      if (0 === this.next) {
        this.next = this.frame + Math.round(random(40, 80));
      } else if (this.next === this.frame) {
        // 花火の大きさ
        for (let i = 0; i < this.ball; i++) {
          // 爆発の角度
          let r = random(0, 360);
          // 爆発の広がり
          let s = random(0.1, 1);
          let vx = Math.cos(r * Math.PI / 180) * s * this.large;
          let vy = Math.sin(r * Math.PI / 180) * s * this.large;
          // 爆発用の火玉を格納
          this.explosions.push(new FireWork(this.x, this.y, vx, vy, this.exStop));
        }
        this.type = 1;
      }
    }
  }

  // 爆発アニメーション
  explosion() {


    for (let ex of this.explosions) {
      ex.frame++;
      // 爆発し終わった花火を配列から除去する
      if (2 === ex.getType) {
        this.explosions = this.explosions.filter(n => n !== ex);
        continue;
      }

      // 残像を描画
      if (0 === Math.round(random(0, 32))) {
        ex.afterImages.push(new Afterimage(this.r, this.g, this.b, ex.x, ex.y, ex.w, ex.a));
      }

      for (let ai of ex.afterImages) {
        if (ai.getAlpha < 0) {
          ex.afterImages = ex.afterImages.filter(n => n !== ai);
          continue;
        }
        ai.stay();
      }

      // 爆発を描画
      this.update(ex.x, ex.y, ex.w, ex.a);
      ex.x += ex.vx;
      ex.y += ex.vy;
      ex.vx = ex.vx * ex.gv;
      ex.vy = ex.vy * ex.gv;
      // ex.vy = ex.vy + (ex.gv / 100);
      if (this.exend < ex.frame) {
        ex.w -= 0.1;
        ex.a = ex.a - 6;
        if (ex.a < 0 && 0 === ex.afterImages.length) {
          ex.type = 2;
        }
      }
    }
  }

  // 花火を表示する
  update(x, y, w, a) {
    this.frame++;

    let c = color(this.r, this.g, this.b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

class Afterimage {
  constructor(r, g, b, x, y, w, a) {
    this.frame = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.w = w;
    this.a = a;
    this.vx = random(-0.24, 0.24);
    this.vy = random(0.2, 0.8);
    this.vw = random(0.05, 0.2);
  }

  get getAlpha() {
    return this.a;
  }

  image() {
    this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
    this.r += 4;
    this.g += 4;
    this.b += 4;
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    if (0 < this.w) {
      this.w = this.w - this.vw;
    }
    this.a = this.a - 4;
  }

  stay() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 2;
      this.g += 2;
      this.b += 2;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 2;
    }
  }

  update(r, g, b, x, y, w, a) {
    this.frame++;
    let c = color(r, g, b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

// グラデーションを描画
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

// 星を作成
function preStar() {
  star = [];
  for (let i = 0; i < 100; i++) {
    star.push([random(width), random(height / 2), random(1, 4)]);
  }
}

// 星を描画
function drawStar() {
  // 星を描く
  for (let s of star) {
    let c = color(random(150, 255), random(150, 255), 255);
    c.setAlpha(random(150, 200));
    fill(c);
    ellipse(s[0], s[1], s[2], s[2]);
  }
}

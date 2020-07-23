let canvas;
let fireworks = [];

function windowResized() {
  resizeCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
}

function setup() {
  // キャンバスの設定
  canvas = createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  colorMode(RGB);
  frameRate(60);
}

function draw() {
  // 背景色を設定
  background(0);
  noStroke();

  // 花火を打ち上げる間隔を調整
  if (0 === frameCount % 45) {
    fireworks.push(new FireWork(random(width), height, 0, random(10, 30), 0.98));
  }

  for (let fw of fireworks) {
    // 打ち切った花火を処理対象から外す（配列から削除する）
    if (3000 < fw.getFrame) {
      fireworks = fireworks.filter(n => n !== fw);
    }

    // 打ち上げアニメーションを呼び出す
    // if (0 === fireworks[i].getType) {
    fw.fire();
    // }

    // 打ち上がったら爆発アニメーションを呼び出す
    // if (0 !== array[i].getType) {
    //   fireworks[i].drawExplosion();
    // }
  }
}

class FireWork {
  // 初期設定
  constructor(x, y, vx, vy, gv) {
    // フレームカウンター
    this.frame = 0;
    this.type = 0;
    // 花火の色
    this.r = random(155) + 100;
    this.g = random(155) + 100;
    this.b = random(155) + 100;
    this.a = 255;

    // 初期位置
    this.x = x;
    this.y = y;

    // 玉の大きさ
    this.w = random(10, 5);

    // 打ち上がる高さ
    this.maxHeight = random(height / 6, height / 2);
    this.fireHeight = (height - this.maxHeight)

    // if (r) this.r = r;
    // if (g) this.g = g;
    // if (b) this.b = b;
    // if (a) this.a = a;
    // if (x) this.x = x;
    // if (y) this.y = y;
    // if (w) this.w = w;

    // 重力
    this.vx = vx;
    this.vy = vy;
    this.gv = gv;
    // if (vx) this.vx = vx;
    // if (vy) this.vy = vy;
    // if (gv) this.gv = gv;

    // 残像のズレ
    // this.n = [];
    // for (let i = 30; 0 < i; i--) {
    //   this.n.push(random(-i / 2, i / 2));
    // }

    // 花火のタイプ
    // if (type) {
    //   this.type = type;
    // } else {
    //   // 0:打ち上げ
    //   this.type = 0;
    // }

    // 残像表示用配列
    this.afterImages = [];
    // 爆発用配列
    this.explosions = [];
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
      this.a = this.a - 5;
    }

    // 指定の高さまで上昇する
    this.x += this.vx;
    this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);
    // this.vy = this.vy * this.gv;

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
      for (let i = 0; i < 100; i++) {
        // 爆発の角度
        let r = random(0, 360);
        // 爆発のスピード
        let s = random(10, 400);
        // 横方向の広がり
        let vx = Math.cos(r * Math.PI / 180) * s;
        // 縦方向の広がり
        let vy = Math.sin(r * Math.PI / 180) * s;
        // 爆発用の火玉を格納
        this.explosions.push(new FireWork(this.x, this.y, vx, vy, 0.98));
      }
      this.type = 1;
    }
  }

  // 爆発アニメーション
  explosion() {
    for (let ex of this.explosions) {
      this.update(ex.x, ex.y, ex.w, 255);
      ex.x += ex.vx;
      ex.y += ex.vy;
      ex.vy = ex.vy * ex.gv;
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
    this.vw = random(0.1, 0.2);
  }

  get getAlpha() {
    return this.a;
  }

  image() {
    this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    if (0 < this.w) {
      this.w = this.w - this.vw;
    }
    this.a = this.a - 6;
  }

  update(r, g, b, x, y, w, a) {
    this.frame++;
    let c = color(r, g, b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

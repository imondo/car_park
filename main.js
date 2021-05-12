/**
 * 整体手机屏幕宽屏查看
 * 方位：
 *     前
 *
 * 左  车位  右
 *
 *     后
 */
var canvas = document.getElementById('canvas'),
  WIDTH,
  HEIGHT;
var ctx = canvas.getContext('2d');

WIDTH = document.documentElement.clientWidth;
HEIGHT = document.documentElement.clientHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

/**
 * 绘制类
 * @param {*} x
 * @param {*} y
 */
function DrawCarport() {
  this.bgColor = '#969593'; // 车位颜色
  this.borderColor = '#ffffff'; // 车位border颜色
  this.lineWidth = 1; // 车位线宽度

  this.padding = 5; // 停车场边缘宽度

  this.car_entry_w = 55; // 入口宽度

  this.portW = WIDTH - this.padding * 2;
  this.portH = HEIGHT - this.padding * 2;
  this.halveW = this.portW / 5;
  this.halveH = this.portH / 4;
}

/**
 * 绘制停车场外围
 */
DrawCarport.prototype.drawPort = function () {
  // 停车场边缘 4个点
  // (5, 5) (WIDTH - 5, 5) (WIDTH - 5, HEIGHT - 5), (5, HEIGHT - 5)
  // 停车场 长度 HEIGHT - 5  分为 4等分 HEIGHT - 5 / 4
  // 停车场 宽度 WIDTH - 5 分为 5等分 WIDTH - 5 / 5
  // 整个停车场边缘

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(this.padding, this.padding);
  ctx.lineTo(this.portW + this.padding, this.padding);
  ctx.lineTo(this.portW + this.padding, this.portH + this.padding);
  ctx.lineTo(this.padding, this.portH + this.padding);
  ctx.lineTo(this.padding, this.portH - this.halveH); // 入口拐点
  ctx.lineTo(this.portW - this.halveW * 4, this.portH - this.halveH); // 入口拐点
  ctx.lineTo(
    this.portW - this.halveW * 4,
    this.portH - this.halveH - this.car_entry_w
  ); // 入口拐点
  ctx.lineTo(this.padding, this.portH - this.halveH - this.car_entry_w); // 入口拐点
  ctx.lineTo(this.padding, this.padding); // 入口拐点

  ctx.strokeStyle = '#fffba0';
  ctx.stroke();
  ctx.closePath();
};

/**
 * 绘制办公楼
 * @param {*} x 坐标x
 * @param {*} y 坐标y
 * @param {*} w 宽度
 * @param {*} h 高度
 * @param {*} hasText 是否绘制文字
 */
DrawCarport.prototype.drawOffice = function (x, y, w, h, hasText) {
  ctx.beginPath();
  // 办公楼主体
  ctx.lineWidth = 1;
  ctx.rect(x, y, w, h);
  // 填充颜色
  ctx.fillStyle = '#b6ddca';
  ctx.fill();

  ctx.strokeStyle = '#515435';
  ctx.stroke();

  if (hasText) {
    ctx.save();
    this.rotateContext(ctx, this.portW + this.padding, this.padding, 90);
    ctx.fillStyle = '#333';
    ctx.font = '18px STheiti, SimHei';
    ctx.fillText('办 公 楼', (x + w) * 7.5, (y + h) / 1.3);
    ctx.restore();
  }
};

/**
 * 旋转画布
 * @param {*} ctx
 * @param {*} x
 * @param {*} y
 * @param {*} degree
 */
DrawCarport.prototype.rotateContext = function (ctx, x, y, degree) {
  ctx.translate(x, y);
  ctx.rotate((degree * Math.PI) / 180);
  ctx.translate(-x, -y);
};

/**
 * 绘制绿化带
 * @param {*} x 坐标x
 * @param {*} y 坐标y
 * @param {*} w 宽度
 * @param {*} h 高度
 * @param {*} hasText 是否绘制文字
 */
DrawCarport.prototype.drawGreenbelts = function (x, y, w, h) {
  ctx.beginPath();
  // 办公楼主体
  ctx.rect(x, y, w, h);
  // 填充颜色
  ctx.fillStyle = '#85c226';
  ctx.fill();
};

/**
 * 绘制绿地线条
 */
DrawCarport.prototype.drawGreenLine = function () {
  // 10 等分
  // 右边绿地
  var green_w = this.halveW * 4;
  var len = green_w / 6;
  for (let i = 0; i < 10; i++) {
    var _base_w = this.padding + this.halveW - 4;
    ctx.beginPath();
    var _w = _base_w + len * i;
    var _h = this.portH - this.halveH + len * i;
    console.log(_h);
    ctx.moveTo(_w, this.portH - this.halveH);
    ctx.lineTo(_base_w, _h);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.beginPath();
    var _w = _base_w + len * i + 10;
    ctx.moveTo(_w, this.portH - this.halveH);
    var _h = this.portH - this.halveH + len * i + 10;
    ctx.lineTo(_base_w, _h < 0 ? this.portH : _h);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }

  var green_w_q = this.portH - this.halveH - this.car_entry_w;
  var len_q = green_w_q / 8;
  for (let i = 0; i < 12; i++) {
    var _base_w = this.halveW - this.padding + 6.5;
    ctx.beginPath();
    var _w = _base_w + len_q * i;
    var _h = this.padding + 2 + len_q * i;
    if (_h > green_w_q) {
      continue;
    }
    ctx.moveTo(_base_w, _h);
    ctx.lineTo(_w, this.padding + 2);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.beginPath();
    var _w = _base_w + len_q * i + 10;
    var _h = this.padding + 2 + len_q * i + 10;
    // x + h
    if (_h > green_w_q) {
      continue;
    }
    ctx.moveTo(_base_w, _h);
    ctx.lineTo(_w, this.padding + 2);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }
};

/**
 * 绘制车位
 */
DrawCarport.prototype.drawCar = function (x, y, w, h) {
  ctx.beginPath();
  ctx.lineWidth = this.lineWidth;
  ctx.rect(x, y, w, h);

  // 填充颜色
  ctx.fillStyle = this.bgColor;
  ctx.fill();

  // 描边
  ctx.strokeStyle = this.borderColor;
  ctx.stroke();
};

/**
 * 绘制停车场空地
 */
DrawCarport.prototype.drawCarSpace = function () {
  ctx.beginPath();
  // 起始点
  var start = {
    x: this.halveW - this.padding + 8 + (this.halveW - this.padding) / 2,
    y: this.padding + 2,
  };
  ctx.moveTo(start.x, start.y); // 从上开始
  ctx.lineTo(this.portW + 4, this.padding);
  ctx.lineTo(this.portW + 4, this.halveH * 3);
  ctx.lineTo(this.halveW, this.halveH * 3);
  ctx.lineTo(this.halveW, this.halveH * 3 - this.car_entry_w + 6);
  ctx.lineTo(
    this.halveW + (this.halveW - this.padding) / 2,
    this.halveH * 3 - this.car_entry_w + 6
  );
  // 填充颜色
  ctx.fillStyle = '#eee';
  ctx.fill();
};

DrawCarport.prototype.init = function () {
  this.drawPort();

  // 右办公楼主体
  this.drawOffice(
    this.padding,
    this.portH - this.halveH,
    this.halveW - this.padding,
    this.halveH + this.padding
  );
  // 前办公楼主体
  this.drawOffice(
    this.padding,
    this.padding,
    this.halveW - this.padding,
    this.portH - this.halveH - this.car_entry_w
  );

  // 右绿化带
  this.drawGreenbelts(
    this.padding + this.halveW - 4,
    this.portH - this.halveH,
    this.halveW * 4 + 2,
    this.halveH + this.padding
  );

  // 前绿化带
  this.drawGreenbelts(
    this.halveW - this.padding + 6.5,
    this.padding + 2,
    (this.halveW - this.padding) / 2,
    this.portH - this.halveH - this.car_entry_w
  );

  // 绿化带线条
  this.drawGreenLine(this.car_entry_w);
  // 停车场空地
  this.drawCarSpace();

  /**
   * 1. 绘制办公楼停车场 后侧
   */
  // 办公楼绿地长度
  var _greeW = this.portH - this.halveH - this.car_entry_w;
  // 停车位宽度
  var car_w = _greeW / 24;
  // 起始点
  var start = {
    x: this.halveW - this.padding + 8 + (this.halveW - this.padding) / 2,
    y: this.padding + 2,
  };
  // 绘制 23个
  for (let i = 0; i < 23; i++) {
    this.drawCar(start.x, start.y + car_w * i, 2 * car_w, car_w);
  }

  /**
   * 2. 绘制左侧
   */
  // 停车位宽度
  // 起始点
  var start = {
    x: this.halveW - this.padding + 8 + (this.halveW - this.padding) / 2 + 2 * car_w + 55,
    y: this.padding + 2,
  };
  // 绘制 12个
  for (let i = 0; i < 12; i++) {
    this.drawCar(start.x + (car_w+5) * i, start.y, car_w+5, car_w * 2);
  }

  /**
   * 3. 绘制前侧
   */
  // 停车位宽度
  // 起始点
  var start = {
    x: this.portW - car_w * 2,
    y: this.padding + 2 + car_w * 2 + 10,
  };
  // 绘制 21个
  for (let i = 0; i < 21; i++) {
    this.drawCar(start.x, start.y + car_w * i, car_w * 2, car_w);
  }

  /**
   * 4. 绘制右侧
   */
  // 停车位宽度
  // 起始点
  var start = {
    x: this.halveW - this.padding + 8 + (this.halveW - this.padding) / 2 + 2 * car_w + 55,
    y: this.portH - this.halveH - car_w * 2,
  };
  // 绘制 12 个
  for (let i = 0; i < 12; i++) {
    this.drawCar(start.x + (car_w + 5) * i, start.y, car_w + 5, car_w * 2);
  }

  /**
   * 中间4排
   */
  var drawCar = this.drawCar
  // 起始点
  function draw_Car(num, halveW, padding, car_w) {
    var start = {
      x: halveW - padding + 8 + (halveW - padding) / 2 + 2 * car_w + 55,
      y: padding + 2 + car_w * 2 + car_w * 2 * num,
    };
    // 绘制 12个
    for (let i = 0; i < 9; i++) {
      drawCar(start.x + (car_w+5) * i, start.y, car_w+5, car_w * 2);
    }
  }

  draw_Car(1, this.halveW, this.padding, car_w)
  draw_Car(2, this.halveW, this.padding, car_w)

  draw_Car(4, this.halveW, this.padding, car_w)
  draw_Car(5, this.halveW, this.padding, car_w)

  draw_Car(7, this.halveW, this.padding, car_w)
  draw_Car(8, this.halveW, this.padding, car_w)

  draw_Car(10, this.halveW, this.padding, car_w)
  draw_Car(11, this.halveW, this.padding, car_w)

  
};

var drawCarport = new DrawCarport();

drawCarport.init();


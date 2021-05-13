/**
 * 整体手机屏幕宽屏查看
 * 方位：
 *     前
 *
 * 左  车位  右
 *
 *     后
 */
function createHDCanvas(w = 300, h = 150) {
  var ratio = window.devicePixelRatio || 1;
  var canvas = document.getElementById('canvas');
  canvas.width = w * ratio; // 实际渲染像素
  canvas.height = h * ratio; // 实际渲染像素
  canvas.style.width = `${w}px`; // 控制显示大小
  canvas.style.height = `${h}px`; // 控制显示大小
  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
}

var canvas,
  WIDTH,
  HEIGHT,ctx;

WIDTH = document.documentElement.clientWidth;
HEIGHT = document.documentElement.clientHeight;

/**
 * 绘制类
 */
function DrawCarport() {
  this.bgColor = '#969593'; // 车位颜色
  this.borderColor = '#ffffff'; // 车位border颜色
  this.lineWidth = 1; // 车位线宽度

  this.padding = 5; // 停车场边缘宽度

  this.portLine = 0; // 停车场外围边线宽度

  // 车位宽度 至少需要29等分
  this.car_w = WIDTH / 29;

  HEIGHT = this.car_w * 42; // 重新计算高度，保证停车场能完全展示

  // canvas.height = HEIGHT;

  canvas = createHDCanvas(WIDTH, HEIGHT);
  ctx = canvas.getContext('2d');

  this.portW = WIDTH - this.padding * 2;
  this.portH = HEIGHT - this.padding * 2;
  this.halveW = this.portW / 5;
  this.halveH = this.portH / 4;

  // 停车场入口宽度
  this.car_entry_w = this.car_w * 2 + 6;

  // 办公楼墙体宽度
  this.office_w = 5 * this.car_w - this.lineWidth * 5; // 6 个车位宽

  // 右侧绿地宽高
  this.green_w = this.portW - this.office_w - 4;

  // 后侧绿地宽高
  this.green_office_w = this.car_w * 2;

  /**
   * 主体信息
   */
  // 长办公室
  this.long_office = {
    x: this.padding,
    y: this.padding,
    w: this.office_w,
    h: this.portH - this.halveH - this.car_entry_w,
  };
  // 短办公楼
  this.short_office = {
    x: this.padding,
    y: this.portH - this.halveH,
    w: this.office_w,
    h: this.halveH + this.padding,
  };

  // 长绿化
  this.long_office_green = {
    x: this.car_w * 6 - this.lineWidth * 13,
    y: this.padding + 2,
    w: 2 * this.car_w,
    h: this.portH - this.halveH - this.car_entry_w,
  };
  // 短绿化
  this.short_office_green = {
    x: this.padding + this.office_w + 1.5,
    y: this.portH - this.halveH,
    w: this.portW - this.office_w - 4,
    h: this.halveH + this.padding,
  };
}

DrawCarport.prototype.init = function () {
  this.drawPort();
  // 长办公室
  this.drawOffice(this.long_office);
  // 短办公室
  this.drawOffice(this.short_office);

  // 办公楼绿化
  this.drawGreenbelts(this.long_office_green);

  // 右测短绿化
  this.drawGreenbelts(this.short_office_green);

  // 绿化带线条
  this.drawGreenLine();
  // 停车场空地
  this.drawCarSpace();

  /**
   * 1. 绘制办公楼停车场 后侧
   */
  // 车位横向起点
  var car_x =
    this.padding + 5 * this.car_w - this.lineWidth * 5 + this.car_w * 2;

  // 起始点
  var start = {
    x: car_x,
    y: this.padding + 2,
  };
  // 绘制 24个
  for (let i = 0; i < 24; i++) {
    this.drawCar(start.x, start.y + this.car_w * i, 2 * this.car_w, this.car_w);
  }

  /**
   * 2. 绘制左侧
   */
  // 停车位宽度
  // 起始点
  var start = {
    x: car_x + this.car_w * 4,
    y: this.padding + 2,
  };
  // 绘制 12个
  for (let i = 0; i < 12; i++) {
    this.drawCar(
      start.x + (this.car_w + 5) * i,
      start.y,
      this.car_w + 5,
      this.car_w * 2
    );
  }

  /**
   * 3. 绘制前侧
   */
  // 停车位宽度
  // 起始点
  var start = {
    x: this.portW - this.car_w * 2 - 5,
    y: this.padding + 2 + this.car_w * 3,
  };
  // 绘制 21个
  for (let i = 0; i < 21; i++) {
    this.drawCar(
      start.x + 3,
      start.y + this.car_w * i,
      this.car_w * 2,
      this.car_w
    );
  }

  // 绘制前侧车位后面灰色墙体
  ctx.beginPath();
  ctx.rect(
    start.x + this.car_w * 2 + 3,
    this.padding + 2,
    6,
    this.long_office.h + this.car_w * 2
  );
  ctx.fillStyle = this.bgColor;
  ctx.fill();

  /**
   * 4. 绘制右侧
   */
  // 停车位宽度
  // 起始点
  var start = {
    x: car_x + this.car_w * 4,
    y: this.portH - this.halveH - this.car_w * 2,
  };
  // 绘制 12 个
  for (let i = 0; i < 12; i++) {
    this.drawCar(
      start.x + (this.car_w + 5) * i,
      start.y,
      this.car_w + 5,
      this.car_w * 2
    );
  }

  /**
   * 中间4排
   */
  var drawCar = this.drawCar;
  // 起始点
  function draw_Car(num, padding, car_w) {
    var start = {
      x: car_x + car_w * 4,
      y: padding + 2 + car_w * 2 + car_w * 2 * num,
    };
    // 绘制 12个
    for (let i = 0; i < 9; i++) {
      drawCar(start.x + (car_w + 5) * i, start.y, car_w + 5, car_w * 2);
    }
  }

  draw_Car(1, this.padding, this.car_w);
  draw_Car(2, this.padding, this.car_w);

  draw_Car(4, this.padding, this.car_w);
  draw_Car(5, this.padding, this.car_w);

  draw_Car(7, this.padding, this.car_w);
  draw_Car(8, this.padding, this.car_w);

  draw_Car(10, this.padding, this.car_w);
  draw_Car(11, this.padding, this.car_w);
};

/**
 * 绘制停车场外围
 */
DrawCarport.prototype.drawPort = function () {
  // 停车场边缘 4个点
  // (5, 5) (WIDTH - 5, 5) (WIDTH - 5, HEIGHT - 5), (5, HEIGHT - 5)
  // 停车场 长度 HEIGHT - 5  分为 4等分 HEIGHT - 5 / 4
  // 停车场 宽度 WIDTH - 5 分为 5等分 WIDTH - 5 / 5
  // 整个停车场边缘

  ctx.lineWidth = this.portLine;
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
DrawCarport.prototype.drawOffice = function ({ x, y, w, h, hasText }) {
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
DrawCarport.prototype.drawGreenbelts = function ({ x, y, w, h }) {
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
    var _base_w = this.padding + this.short_office.w + 1;
    ctx.beginPath();
    var _w = _base_w + len * i;
    var _h = this.portH - this.halveH + len * i;
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
    var _base_w = this.padding + this.short_office.w + 1;
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
    x: this.office_w + 2 * this.car_w + 4,
    y: this.padding + 2,
  };
  ctx.moveTo(start.x, start.y); // 从上开始
  ctx.lineTo(this.portW + 4, this.padding);
  ctx.lineTo(this.portW + 4, this.halveH * 3);
  ctx.lineTo(this.office_w + 4, this.halveH * 3);
  ctx.lineTo(this.office_w + 4, this.halveH * 3 - this.car_entry_w + 6);
  ctx.lineTo(start.x, this.halveH * 3 - this.car_entry_w + 6);
  // 填充颜色
  ctx.fillStyle = '#eee';
  ctx.fill();
};

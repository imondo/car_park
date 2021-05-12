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

var CAR = {
  width: 150,
  height: 100,
};

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
  this.lineWidth = 2; // 车位线宽度

  this.padding = 5; // 停车场边缘宽度

  this.portW = WIDTH - this.padding * 2;
  this.portH = HEIGHT - this.padding * 2;
  this.halveW = this.portW / 5;
  this.halveH = this.portH / 4;
}

/**
 * 绘制停车场
 */
DrawCarport.prototype.drawPort = function () {
  var car_entry_w = 55; // 入口宽度
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
    this.portH - this.halveH - car_entry_w
  ); // 入口拐点
  ctx.lineTo(this.padding, this.portH - this.halveH - car_entry_w); // 入口拐点
  ctx.lineTo(this.padding, this.padding); // 入口拐点

  ctx.strokeStyle = '#fffba0';
  ctx.stroke();
  ctx.closePath();

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
    this.portH - this.halveH - car_entry_w,
  );

  // 右绿化带
  this.drawGreenbelts(
    this.padding + this.halveW - 4,
    this.portH - this.halveH,
    this.halveW*4 + 2,
    this.halveH + this.padding
  );

  // 前绿化带
  this.drawGreenbelts(
    this.halveW - this.padding + 6.5,
    this.padding + 2,
    (this.halveW - this.padding) / 2,
    this.portH - this.halveH - car_entry_w,
  );

  this.drawGreenLine(car_entry_w)
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
    ctx.save()
    this.rotateContext(ctx, (this.portW + this.padding), this.padding, 90);
    ctx.fillStyle = '#333';
    ctx.font = '18px STheiti, SimHei';
    ctx.fillText('办 公 楼', (x + w) * 7.5, (y + h) / 1.3);
    ctx.restore()
  }
};

/**
 * 旋转画布
 * @param {*} ctx 
 * @param {*} x 
 * @param {*} y 
 * @param {*} degree 
 */
DrawCarport.prototype.rotateContext = function(ctx, x, y, degree) {
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
DrawCarport.prototype.drawGreenLine = function(car_entry_w) {
  // 10 等分
  // 右边绿地
  var green_w = this.halveW * 4;
  var len = green_w / 6
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    var _w = this.padding + this.halveW - 4 + len * i;
    ctx.moveTo(_w, this.portH - this.halveH)
    var _h = this.portH - this.halveH + len * i;
    ctx.lineTo(this.padding + this.halveW - 4, _h < 0 ? this.portH : _h)
    ctx.strokeStyle = '#fff';
    ctx.stroke()

    ctx.beginPath()
    var _w = this.padding + this.halveW - 4 + len * i + 10;
    if (_w > this.portW) {
      ctx.moveTo(_w, this.portH - this.halveH)
    } else {
      ctx.moveTo(_w, this.portH - this.halveH)
    }
    var _h = this.portH - this.halveH + len * i + 10;
    ctx.lineTo(this.padding + this.halveW - 4, _h < 0 ? this.portH : _h)
    ctx.strokeStyle = '#fff';
    ctx.stroke()
  }

  var green_w_q = this.portH - this.halveH - car_entry_w;
  var len_q = green_w_q / 5
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    var _w = this.halveW - this.padding + 6.5 + len_q * i;
    var _h = this.padding + 2 + len_q * i;
    if (_h > green_w_q) {
      continue
    }
    ctx.moveTo(this.halveW - this.padding + 6.5, _h)
    ctx.lineTo(_w, this.padding + 2)
    ctx.strokeStyle = '#fff';
    ctx.stroke()
  }

  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    var _w = this.halveW - this.padding + 6.5 + len_q * i + 10;
    var _h = this.padding + 2 + len_q * i + 10;
    // x + h
    if (_h > green_w_q) {
      continue;
    }
    ctx.moveTo(this.halveW - this.padding + 6.5, _h)
    ctx.lineTo(_w, this.padding + 2)
    ctx.strokeStyle = '#fff';
    ctx.stroke()
  }
}

/**
 * 绘制车位
 */
DrawCarport.prototype.drawCar = function (x, y) {
  ctx.beginPath();
  ctx.lineWidth = this.lineWidth;
  ctx.rect(x, y, CAR.width, CAR.height);

  // 填充颜色
  ctx.fillStyle = this.bgColor;
  ctx.fill();

  // 描边
  ctx.strokeStyle = this.borderColor;
  ctx.stroke();
};

var drawCarport = new DrawCarport();

drawCarport.drawPort();

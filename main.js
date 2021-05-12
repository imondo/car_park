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

  // 小办公楼主体
  this.drawOffice(
    this.padding,
    this.portH - this.halveH,
    this.halveW - this.padding,
    this.halveH + this.padding
  );
  // 大办公楼主体
  this.drawOffice(
    this.padding,
    this.padding,
    this.halveW - this.padding,
    this.portH - this.halveH - car_entry_w,
    true
  );
};

/**
 * 绘制办公楼
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
    ctx.translate(this.portW + this.padding, this.padding);
    ctx.rotate(90 * Math.PI / 180)
    ctx.fillStyle = '#333';
    ctx.font = '18px STheiti, SimHei';
    ctx.fillText('办公楼', (x + w)*2.5, (y + h)/1.3);
  }
};

/**
 * 绘制车位
 */
DrawCarport.prototype.draw = function (x, y) {
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

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  WIDTH,
  HEIGHT;

WIDTH = document.documentElement.clientWidth;
HEIGHT = document.documentElement.clientHeight;

var CAR = {
  width: 150,
  height: 100
}

canvas.width = WIDTH;
canvas.height = HEIGHT;

/**
 * 绘制类
 * @param {*} x 
 * @param {*} y 
 */
function DrawCarport() {
  this.bgColor = "#969593"; // 车位颜色
  this.borderColor = '#ffffff'; // 车位border颜色
  this.lineWidth = 2; // 车位线宽度
}

/**
 * 绘制停车场
 */
DrawCarport.prototype.drawPort = function() {
  var _padding = 5; // 停车场边缘宽度
  var car_entry_w = 55 // 入口宽度
  // 停车场边缘 4个点
  // (5, 5) (WIDTH - 5, 5) (WIDTH - 5, HEIGHT - 5), (5, HEIGHT - 5)
  // 停车场 长度 HEIGHT - 5  分为 4等分 HEIGHT - 5 / 4 
  // 停车场 宽度 WIDTH - 5 分为 5等分 WIDTH - 5 / 5
  // 整个框架
  var port_w = WIDTH - _padding;
  var port_h = HEIGHT - _padding;
  var halve_w = port_w / 5;
  var halve_h = port_h / 4;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(_padding, _padding)
  ctx.lineTo(port_w, _padding)
  ctx.lineTo(port_w, port_h)
  ctx.lineTo(_padding, port_h)
  ctx.lineTo(_padding, port_h - halve_h) // 入口拐点
  ctx.lineTo(port_w - halve_w * 4, port_h - halve_h) // 入口拐点
  ctx.lineTo(port_w - halve_w * 4, port_h - halve_h - car_entry_w) // 入口拐点
  ctx.lineTo(_padding, port_h - halve_h - car_entry_w) // 入口拐点
  ctx.lineTo(_padding, _padding) // 入口拐点
  
  ctx.strokeStyle = '#fffba0'
  ctx.stroke();
}

/**
 * 绘制车位
 */
DrawCarport.prototype.draw = function(x, y) {
  ctx.lineWidth = this.lineWidth;
  ctx.rect(x, y, CAR.width, CAR.height);

  // 填充颜色
  ctx.fillStyle = this.bgColor;
  ctx.fill();

  // 描边
  ctx.strokeStyle = this.borderColor;
  ctx.stroke();
}

var drawCarport = new DrawCarport()

drawCarport.drawPort();
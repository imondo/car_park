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

var canvas, WIDTH, HEIGHT, ctx;

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

  this.portLine = 4; // 停车场外围边线宽度

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
    text: '办 公 楼',
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
    text: '绿 化 带',
  };
  // 短绿化
  this.short_office_green = {
    x: this.padding + this.office_w + 1.5,
    y: this.portH - this.halveH,
    w: this.portW - this.office_w - 4,
    h: this.halveH + this.padding,
  };

  /**
   * 记录车位数，为车位标记做准备
   * {x, y, w, h} 车位标记点
   */
  this.car_list = [];

  // 点中的车位点
  this.markPoint = null;

  // 车位占用颜色
  this.markColor = '#FF4B2B';
}

/**
 * 车位排序
 */
function carportBySort(data) {
  if (!data || !data.length) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.carport_num = i + 1;
  }
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
  var car_dot_1 = {
    direction: '后侧',
    x: start.x,
    w: this.car_w * 2,
    h: this.car_w,
  };
  // 绘制 24个
  for (let i = 0; i < 24; i++) {
    var _dot = Object.assign({}, car_dot_1, {
      id: i,
      y: start.y + this.car_w * i,
    });
    this.drawCar(_dot);
    // 记录车位
    this.car_list.unshift(_dot);
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
  var car_dot_2 = {
    direction: '左侧',
    y: start.y,
    w: this.car_w + 5,
    h: this.car_w * 2,
  };
  // 绘制 12个
  for (let i = 0; i < 12; i++) {
    var _dot = Object.assign({}, car_dot_2, {
      id: i,
      x: start.x + (this.car_w + 5) * i,
    });
    this.drawCar(_dot);
    // 记录车位
    this.car_list.push(_dot);
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
  var car_dot_3 = {
    direction: '前侧',
    x: start.x + 3,
    w: this.car_w * 2,
    h: this.car_w,
  };
  // 绘制 21个
  for (let i = 0; i < 21; i++) {
    var _dot = Object.assign({}, car_dot_3, {
      id: i,
      y: start.y + this.car_w * i,
    });
    this.drawCar(_dot);
    // 记录车位
    this.car_list.push(_dot);
  }

  // 绘制前侧车位后面灰色墙体
  ctx.beginPath();
  ctx.rect(
    start.x + this.car_w * 2 + 4,
    this.padding,
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
  var car_dot_4 = {
    direction: '右侧',
    y: start.y,
    w: this.car_w + 5,
    h: this.car_w * 2,
  };
  // 绘制 12 个
  var you_car_list = [];
  for (let i = 0; i < 12; i++) {
    var _dot = Object.assign({}, car_dot_4, {
      id: i,
      x: start.x + (this.car_w + 5) * i,
    });
    this.drawCar(_dot);
    // 记录车位
    you_car_list.unshift(_dot);
  }
  this.car_list = this.car_list.concat(you_car_list);

  /**
   * 中间4排
   */
  var drawCar = this.drawCar;
  // 起始点
  function draw_Car(num, padding, car_w, car_list) {
    var start = {
      x: car_x + car_w * 4,
      y: padding + 2 + car_w * 2 + car_w * 2 * num,
    };
    var car_dot_5 = {
      direction: '中间',
      y: start.y,
      w: car_w + 5,
      h: car_w * 2,
    };
    // 绘制 12个
    for (let i = 0; i < 9; i++) {
      var _id = num + '-' + i;
      var _dot = Object.assign({}, car_dot_5, {
        id: _id,
        x: start.x + (car_w + 5) * i,
      });
      drawCar(_dot);
      // 记录车位
      car_list.push(_dot);
    }
  }

  draw_Car(1, this.padding, this.car_w, this.car_list);
  draw_Car(2, this.padding, this.car_w, this.car_list);

  draw_Car(4, this.padding, this.car_w, this.car_list);
  draw_Car(5, this.padding, this.car_w, this.car_list);

  draw_Car(7, this.padding, this.car_w, this.car_list);
  draw_Car(8, this.padding, this.car_w, this.car_list);

  draw_Car(10, this.padding, this.car_w, this.car_list);
  draw_Car(11, this.padding, this.car_w, this.car_list);

  carportBySort(this.car_list);

  // 停车场文字
  this.drawText({
    text: '停 车 区',
    color: '#949293',
    fontSize: '19px',
    x: this.portW - this.car_w * 4 + 19 / 2,
    y: this.long_office.h / 2,
  });

  // 入口处文字
  this.drawEntryText();
};

/**
 * 车位标记
 * @param {number} carport_num 车位
 */
DrawCarport.prototype.mark = function (carport_num) {
  ctx.beginPath();
  var _carport = this.car_list.find((v) => v.carport_num == carport_num);
  ctx.rect(_carport.x, _carport.y, _carport.w, _carport.h);
  ctx.fillStyle = this.markColor;
  ctx.fill();
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
  ctx.moveTo(this.padding + this.long_office.w, this.padding);
  ctx.lineTo(this.portW + this.padding, this.padding);
  ctx.lineTo(this.portW + this.padding, this.portH + this.padding);
  ctx.lineTo(this.short_office.w, this.portH + this.padding);
  ctx.lineTo(this.short_office.w, this.portH - this.halveH); // 入口拐点

  ctx.strokeStyle = '#fffba0';
  ctx.stroke();
};

/**
 * 绘制办公楼
 * @param {*} x 坐标x
 * @param {*} y 坐标y
 * @param {*} w 宽度
 * @param {*} h 高度
 * @param {*} hasText 是否绘制文字
 */
DrawCarport.prototype.drawOffice = function ({ x, y, w, h, text }) {
  ctx.beginPath();
  // 办公楼主体
  ctx.lineWidth = 1;
  ctx.rect(x, y, w, h);
  // 填充颜色
  ctx.fillStyle = '#b6ddca';
  ctx.fill();

  ctx.strokeStyle = '#515435';
  ctx.stroke();

  if (text) {
    this.drawText({
      text,
      color: '#142f20',
      fontSize: '18px',
      x: (x + w) / 2,
      y: (y + h) / 2,
    });
  }
};

/**
 * 绘制绿化带
 * @param {*} x 坐标x
 * @param {*} y 坐标y
 * @param {*} w 宽度
 * @param {*} h 高度
 * @param {*} hasText 是否绘制文字
 */
DrawCarport.prototype.drawGreenbelts = function ({ x, y, w, h, text }) {
  ctx.beginPath();
  // 办公楼主体
  ctx.rect(x, y, w, h);
  // 填充颜色
  ctx.fillStyle = '#85c226';
  ctx.fill();

  if (text) {
    this.drawText({
      text,
      color: '#142f20',
      fontSize: '15px',
      x: x + w / 2,
      y: (y + h) / 2,
    });
  }
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
DrawCarport.prototype.drawCar = function ({ x, y, w, h }) {
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
  ctx.fillStyle = '#c1c1c1';
  ctx.fill();
};

/**
 * 绘制入口处箭头和文字
 */
DrawCarport.prototype.drawEntryText = function () {
  ctx.save();
  ctx.beginPath();
  // 箭头中间点
  var _start = {
    x: this.long_office.w - this.car_w * 2,
    y: this.long_office.h + this.car_entry_w / 2 + 2,
  };
  ctx.translate(_start.x + 6, _start.y);
  ctx.scale(0.7, 0.7);
  ctx.translate(-_start.x + 6, -_start.y);

  ctx.moveTo(_start.x, _start.y - 2);
  ctx.lineTo(_start.x + 15, _start.y - 2);
  ctx.lineTo(_start.x + 15, _start.y - 6);
  ctx.lineTo(_start.x + 25, _start.y);
  ctx.lineTo(_start.x + 15, _start.y + 6);
  ctx.lineTo(_start.x + 15, _start.y + 2);
  ctx.lineTo(_start.x, _start.y + 2);
  ctx.closePath();
  ctx.fillStyle = '#b6ddca';
  ctx.fill();
  ctx.strokeStyle = '#515435';
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  this.drawText({
    text: '入口处',
    fontSize: '7px',
    color: '#142f20',
    x: _start.x + 5,
    y: _start.y,
  });
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

DrawCarport.prototype.drawText = function ({ text, color, fontSize, x, y }) {
  const myFont = new FontFace('myFont', 'url(./webfont.ttf)');
  var _this = this;
  myFont
    .load()
    .then((font) => {
      document.fonts.add(font);
    })
    .then(function () {
      ctx.save();
      _this.rotateContext(ctx, x, y, 90);
      ctx.fillStyle = color;
      ctx.font = fontSize + ' myFont';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
      ctx.restore();
    });
};

DrawCarport.prototype.drawMarkPoint = function (point) {
  if (this.markPoint) {
    ctx.clearRect(this.markPoint.x - 3, this.markPoint.y - 3, 6, 6);
    ctx.rect(this.markPoint.x - 3, this.markPoint.y - 3, 6, 6)
    ctx.fillStyle = this.markPoint.state ? this.markColor : this.bgColor;
    ctx.fill();
    ctx.strokeStyle = this.markPoint.state ? this.markColor : this.bgColor;
    ctx.stroke();
    this.markPoint = null;
  }
  if (!point) {
    return;
  }
  ctx.beginPath();
  var circle = {
    x: point.x + point.w / 2,
    y: point.y + point.h / 2,
  };
  this.markPoint = Object.assign({}, circle, { state: point.space.useStatus === 1});
  ctx.arc(circle.x, circle.y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#eaafc8';
  ctx.fill();
};

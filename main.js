(function (window, document, axios) {
  var drawCarport = new DrawCarport();
  drawCarport.init();
  getSpaceList();

  // 由于居中影响元素点位置，(整体高度 - canvas 高度 / 2)
  var factor_height =
    (document.documentElement.clientHeight -
      document.querySelector('#canvas').clientHeight) /
    2;

  document.querySelector('#canvas').addEventListener('click', function (e) {
    var point = {
      x: e.x,
      y: e.y,
    };
    var car_port = drawCarport.car_list.find(function (v) {
      return checkPointInPolyline(point, v);
    });
    toastCarMsg(car_port);
  });

  function getSpaceList() {
    axios.get('https://sapi.siwea.net/general/pub/spaces?parkId=15').then(
      function (res) {
        if (res.data && res.data.length) {
          var list = res.data[0];
          var spaceList = list.spaceList;
          var _len = spaceList.length;
          var car_num = 0; // 占用车位
          for (var i = 0; i < _len; i++) {
            var carport = spaceList[i];
            var num = carport.name.replace(/[A-Z]/g, '');
            carport.carport_num = +num;
            // 车位占用 1 占用 0 空闲
            if (+carport.useStatus) {
              car_num++;
              drawCarport.mark(carport.carport_num);
            }
            drawCarport.car_list[i].space = carport;
          }
          setCarpartInfo(_len, car_num);
        }
      },
      function (err) {
        console.log('err');
      }
    );
  }

  function setCarpartInfo(len, num) {
    document.querySelector('#sum').innerText = len;
    document.querySelector('#remain').innerText = len - num;
  }

  // 判断是否点中车位
  function checkPointInPolyline(point, polylinePoints) {
    // 当 x > 车位起始点 && x < 起始点 + 车位宽度 && y > 起始点 && y < 起始点 + 车位高度
    if (
      point.x >= polylinePoints.x &&
      point.x <= polylinePoints.x + polylinePoints.w &&
      point.y - factor_height >= polylinePoints.y &&
      point.y - factor_height <= polylinePoints.y + polylinePoints.h
    ) {
      return true;
    } else {
      return false;
    }
  }

  // 弹出车位状态
  function toastCarMsg(point) {
    var $toast = document.querySelector('#toast');
    var $toastCar = document.querySelector('#toastCar');
    var $toastState = document.querySelector('#toastState');

    $toast.style.display = !point ? 'none' : 'block';
    drawCarport.drawMarkPoint(point);
    if (!point || !point.space) {
      return;
    }
    var _isUse = point.space.useStatus === 1;
    $toastCar.innerText = point.space.name;
    $toastState.innerText = _isUse ? '已占用' : '空闲';
    $toastState.className = _isUse ? 'occupy' : 'free';
  }

  // 判断手机端
  function isMobile() {
    var sUserAgent = navigator.userAgent;
    if (
      sUserAgent.indexOf('Android') > -1 ||
      sUserAgent.indexOf('iPhone') > -1 ||
      sUserAgent.indexOf('iPad') > -1 ||
      sUserAgent.indexOf('iPod') > -1 ||
      sUserAgent.indexOf('Symbian') > -1
    ) {
      return true;
    } else {
      return true;
    }
  }
})(window, document, axios);

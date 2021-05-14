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
          for (var i = 0; i < _len; i++) {
            var carport = spaceList[i];
            var num = carport.name.replace(/[A-Z]/g, '');
            carport.carport_num = +num;
            // 车位占用 1 占用 0 空闲
            if (+carport.useStatus) {
              drawCarport.mark(carport.carport_num);
            }
            drawCarport.car_list[i].space = carport;
          }
        }
      },
      function (err) {
        console.log('err');
      }
    );
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
    if (!point) {
      return;
    }

    var _isUse = point.space.useStatus === 1;
    $toast.style.top = point.y + (point.w > point.h ? point.h + point.h / 2 : point.h) + 'px';
    $toast.style.left = point.x + 'px';
    $toastCar.innerText = point.space.name;
    $toastState.innerText = _isUse ? '已占用' : '空闲';
    $toastState.className = _isUse ? 'occupy' : 'free';
  }
})(window, document, axios);

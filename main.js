(function (window, document, axios) {
  var drawCarport = new DrawCarport();
  drawCarport.init();

  getSpaceList();

  document.querySelector('#canvas').addEventListener('click', function(e) {
    console.log(e);
    var _x = e.x;
    var _y = e.y;
    var car_port = drawCarport.car_list.find(v => v.x > )
  })

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
})(window, document, axios);

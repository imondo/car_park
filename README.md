# car_park

一个使用 canvas 绘制的停车场示意图

```js

  var context = canvas.getContext("2d");//得到绘图的上下文环境

  context.beginPath();//开始绘制线条，若不使用beginPath，则不能绘制多条线条
  context.moveTo(100, 100);//线条开始位置
  context.lineTo(700, 700);//线条经过点
  context.lineTo(100, 700);
  context.lineTo(100, 100);
  context.closePath();//结束绘制线条，不是必须的
  
  context.lineWidth = 5;//设置线条宽度
  context.strokeStyle = "red";//设置线条颜色
  context.stroke();//用于绘制线条

  context.beginPath();
  context.moveTo(200, 100);
  context.lineTo(700, 600);
  context.closePath();
  context.strokeStyle = "black";
  context.stroke();
```
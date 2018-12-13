// index.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖

let chart = null;



Page({
  data: {
    shops:['沈阳店','上海店'],
    index: 0,
    partSales:{
      dailyAverage:'200',
      dayDoc:{
        upOrDown:0,
        rate:'20%',
        actualAmount:'1000.00',
        supplyAmount:'750',
        orderNum:'300',
      },
      monthDoc: {
        upOrDown: 0,
        rate: '20%',
        actualAmount: '1000.00',
        supplyAmount: '750',
        orderNum: '300',
        months: [
           '2018.10', '2018.11', '2018.12'
        ],
        index:0
      }
    },
    salesData: {
      onInit:(canvas, width, height, F2)=> { // 使用 F2 绘制图表
        const data = getApp().globalData.data
        chart = new F2.Chart({
          el: canvas,
          width,
          height
        });
        chart.source(data, {
          sales: {
            tickCount: 5
          }
        });
        chart.tooltip({
          showItemMarker: false,
          onShow(ev) {
            const { items } = ev;
            items[0].name = null;
            items[0].name = items[0].title;
            items[0].value = '¥ ' + items[0].value;
          }
        });
        chart.interval().position('year*sales');
        chart.render();
        return chart;
      }
    }
  },
  bindShopPickerChange(e) {
    console.log('picker发送选择改变，Shop携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMonthsPickerChange(e) {
    console.log('picker发送选择改变，Months携带值为', e.detail.value)
    this.setData({
      'partSales.monthDoc.index': e.detail.value
    })
  },
  onReady() {
  }
});


// pages/index/index.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
const app = getApp();
let chart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 截止目前平台销售额
    partSales: {
      sales: '0',
      platformProfit:'0',
    },
    // 销售趋势
    salesTrendData: {
      onInit: salesTrend
    },
    // 销售占比
    salesShareData: {
      lazyLoad: true
      // onInit: salesShare
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData('')
  },

  getIndexData: function (shopId) {
    const that = this;
    app.Ajax(
      'Dashboard',
      'POST',
      'GetHomePageData',
      { shopId: shopId },
      function (json) {
        console.log('首页', json)
        if (json.success) { 
          new Promise((resolve, reject)=>{
            // console.log('promise')
            app.globalData.index = json.data;
            resolve()
          }).then(()=>{
            // console.log('thennnn')
            that.re();
          })
        } else {
          // that.Toast('','none',2000,json.msg.code)
          console.log('here');
        }
      })
  },
  init: function () {
    const partSalesData = app.globalData.index.partSales
    this.setData({
      'partSales.sales': partSalesData.sales,
      'partSales.platformProfit': partSalesData.platformProfit
    })
  },
  re: function () {
    // console.log('re',app.globalData.trade.proportion)
    this.init();
    // 销售趋势
    let salesTrend = this.selectComponent('#line-dom');
    salesTrend.chart.changeData(app.globalData.index.salesTrendData.salesTrends)

    // 销售占比
    const newSalesShareData = app.globalData.index.salesShareData.data
    let salesShareChartComponent = this.selectComponent('#guage-dom');
    // salesShare.chart.changeData(newSalesShareData)
    salesShareChartComponent.init(salesShare)
  }
})

function salesTrend(canvas, width, height) {
  // const data=[
  //   { "month": 1, "type": "销售金额", "value": 490 },
  //   { "month": 2, "type": "销售金额", "value": 450 },
  //   { "month": 1, "type": "平台利润", "value": 48 },
  //   { "month": 2, "type": "平台利润", "value": 43 },
  // ]
  const data = app.globalData.index.salesTrendData.salesTrends
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    month: {
      range: [0, 1],
      ticks: [1, 2]
    },
    // value: {
    //   tickCount: 10,
    //   formatter(val) {
    //     // return val.toFixed(1);
    //   }
    // }
  });

  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.bottom[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const { name, value } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.bottom[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });

  // chart.guide().rect({
  //   start: [2011, 'max'],
  //   end: ['max', 'min'],
  //   style: {
  //     fill: '#CCD6EC',
  //     opacity: 0.3
  //   }
  // });
  // chart.guide().text({
  //   position: [2014, 'max'],
  //   content: 'Scott administratio\n(2011 to present)',
  //   style: {
  //     fontSize: 10,
  //     textBaseline: 'top'
  //   }
  // });

  chart.line().position('month*value').color('type', val => {
    if (val === '线下店') {
      return '#ff0000';
    } else if (val === '一般贸易'){
      return '#9bbb59';
    }
  });
  chart.render();
  return chart;
}

function salesShare(canvas, width, height, F2) {
  // const map = {
  //   '上海店': '40%',
  //   '沈阳店': '20%',
  //   '其他': '18%',
  // };
  // const data = [
  //   { shopName: '上海店', percent: 0.4, constValue: '1' },
  //   { shopName: '沈阳店', percent: 0.2, constValue: '1' },
  //   { shopName: '其他', percent: 0.18, constValue: '1' },
  // ];


  const map = {}
  const data = app.globalData.index.salesShareData.data

  data.map(i => {
    map[i.name] = (i.percent * 100).toFixed(2) + '%'
  })

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    percent: {
      formatter(val) {
        return val * 100 + '%';
      }
    }
  });
  chart.legend({
    position: 'right',
    itemFormatter(val) {
      return val + '  ' + map[val];
    }
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval()
    .position('a*percent')
    .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
    .adjust('stack')
    .style({
      lineWidth: 1,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
    })
    .animate({
      // appear: {
      //   duration: 1200,
      //   easing: 'bounceOut'
      // }
    });

  chart.render();
  return chart;
}

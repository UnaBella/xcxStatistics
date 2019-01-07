// pages/trade/trade.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖

let chart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    shops: [
      { shopId: '', shopName: '全部店铺' },
    ],
    shopIds: [],
    shopNames: [],

    partSales: {
      dayDoc: {
        upOrDown: 0,
        rate: '0',
        actualAmount: '0',
        supplyAmount: '0',
        orderNum: '0',
      },
      index: 0,
      months: ['2019年1月','2018年12月'],
      monthDoc: {
        upOrDown: 0,
        rate: '0',
        actualAmount: '0',
        supplyAmount: '0',
        orderNum: '0'
      }
    },
    // 销售趋势
    salesTrendData: {
      onInit: salesTrend
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

})

function salesTrend(canvas, width, height, F2) {
  const data = [
    { "month": 1, "type": "销售金额", "value": 490 }, 
    { "month": 2, "type": "销售金额", "value": 450 }, 
    { "month": 1, "type": "平台利润", "value": 48 }, 
    { "month": 2, "type": "平台利润", "value": 43 },
   ];

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    year: {
      range: [0, 1],
      ticks: [1, 2]
    },
    value: {
      tickCount: 10,
      formatter(val) {
        return val.toFixed(1);
      }
    }
  });

  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
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
      const legend = chart.get('legendController').legends.top[0];
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
    if (val === '平台利润') {
      return '#ff0000';
    }
  });
  chart.render();
  return chart;
}
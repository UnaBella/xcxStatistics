// pages/trade/trade.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
const app = getApp();
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
      status:'',
      onInit: salesTrend
    },
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTradeData('');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindShopPickerChange(e) {
    // console.log('picker发送选择改变，Shop携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      'partSales.index': 0,
    })
    const shopId = this.data.shopIds[e.detail.value]
    this.getTradeData(shopId);


  
    let salesShare = this.selectComponent('#guage-dom');
    salesShare.chart.changeData(data)
  },
  bindMonthsPickerChange(e) {
    // console.log('picker发送选择改变，Months携带值为', e.detail.value)
    const partSalesData = app.globalData.trade.partSales
    this.setData({
      'partSales.index': e.detail.value,
      'partSales.monthDoc': partSalesData.monthGroups.list[e.detail.value]
    })
  },
  getTradeData: function (shopId) {
    const that = this;
    app.Ajax(
      'Dashboard',
      'POST',
      'GetTradeData',
      { shopId: shopId },
      function (json) {
        // console.log('tradeSuccess', json.data)
        if (json.success) {
          // console.log('tradeSuccess', json.data)
          new Promise((resolve, reject)=>{
            // console.log('promise')
            app.globalData.trade = json.data;
            that.setData({
              'salesTrendData.status': json.data.salesTrendData.status
            })
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
  init:function(){
    const partSalesData = app.globalData.trade.partSales
    const that = this;
    this.setData({
      shopIds: app.globalData.trade.shops.list.map(i => { return i.shopId }),
      shopNames: app.globalData.trade.shops.list.map(i => { return i.shopName }),
      
      'partSales.dayDoc': partSalesData.partSalesDay,
      'partSales.months': partSalesData.monthGroups.list.map(i => { return i.month }),
      'partSales.monthDoc': partSalesData.monthGroups.list[this.data.partSales.index]
    })
  },
  re:function(){
    // console.log('re',app.globalData.trade.proportion)
    this.init();
    // 销售趋势
    let salesTrend = this.selectComponent('#line4-dom');
    salesTrend.chart.changeData(app.globalData.trade.salesTrendData.salesTrends)

  }
})

function salesTrend(canvas, width, height) {
    // const data=[
    //   { "month": 1, "type": "销售金额", "value": 490 },
    //   { "month": 2, "type": "销售金额", "value": 450 },
    //   { "month": 1, "type": "平台利润", "value": 48 },
    //   { "month": 2, "type": "平台利润", "value": 43 },
    // ]
  const data = app.globalData.trade.salesTrendData.salesTrends
  // console.log('da', data)
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
          return val;
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
            map[name].value = value + '元';
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


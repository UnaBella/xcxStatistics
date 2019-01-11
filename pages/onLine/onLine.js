// index.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖

let chart = null;
const app = getApp();


Page({
  data: {
    moreStatus: false,
    index: 0,
    shops: [
      { shopId: '', shopName: '全部店铺' },
    ],
    shopIds: [],
    shopNames: [],
    
    partSales: {
      dailyAverage: '0',
      dayDoc: {
        upOrDown: 0,
        rate: '0',
        actualAmount: '0',
        supplyAmount: '0',
        orderNum: '0',
      },
      index: 0,
      months: ['2018'],
      monthDoc: {
        upOrDown: 0,
        rate: '0',
        actualAmount: '0',
        supplyAmount: '0',
        orderNum: '0', 
      }
    },
    // 销售占比
    proportionData: {
      lazyLoad: true,
      // onInit: proportionData 
    },
    // 过去7天销售趋势
    salesTrendData: {
      lazyLoad: true,
      // onInit: salesTrendData 
    },
    // 过去7天订单成交趋势
    orderTrendData: {
      lazyLoad: true,
      // onInit: orderTrendData 
    },

    // 最畅销的十款商品
    bestSellerGoodsData: {
      lazyLoad: true,
      // onInit: bestSellerGoodsData 
    },
    // 低销量十款商品
    // lowSalesGoodsData: {
    //   onInit: lowSalesGoodsData 
    // },
    // 应收账款周转率
    accountsReceivableTRateData: {
      lazyLoad: true,
      // onInit: accountsReceivableTRateData 
    },
    // 流量来源
    

  },
  onLoad:function(){
    // this.init()
    // app.getOnLineData('', this);
    app.getOnLineData('', this);
  },
  onShow:function(){
    // this.init()
  },
  init:function(){
    const partSalesData = app.globalData.onLine.partSales
    const that = this;
    this.setData({
      shopIds: app.globalData.onLine.shops.list.map(i => { return i.shopId }),
      shopNames: app.globalData.onLine.shops.list.map(i => { return i.shopName }),

      'partSales.dailyAverage': partSalesData.dailyAverage,
      'partSales.dayDoc': partSalesData.partSalesDay,
      'partSales.months': partSalesData.monthGroups.list.map(i => { return i.month }),
      'partSales.monthDoc': partSalesData.monthGroups.list[this.data.partSales.index]
    })
  },
 

  bindShopPickerChange(e) {
    // console.log('picker发送选择改变，Shop携带值为', e.detail.value)

    this.setData({
      index: e.detail.value,
      'partSales.index': 0
    })
    const shopId = this.data.shopIds[e.detail.value]
    const that = this
  

    app.getOnLineData(shopId, that);
  },
  reOnLine: function () {
    this.init();
    //  销售占比
    let proportion = this.selectComponent('#table-proportion');
    proportion.init(proportionData)
    //  过去7天销售趋势（元）
    let salesTrend = this.selectComponent('#table-salesTrend');
    // console.log(salesTrend)
    salesTrend.init(salesTrendData)
    //  过去7天订单成交趋势（笔）
    let orderTrend = this.selectComponent('#table-orderTrend');
    orderTrend.init(orderTrendData)
    // 最畅销的十款商品
    let bestSeller = this.selectComponent('#table-bestSeller');
    bestSeller.init(bestSellerGoodsData)
    // 低销量十款商品
    // let lowSales = this.selectComponent('#table-lowSales');
    // lowSales.init(lowSalesGoodsData)
    // 应收账款周转率
    let accountsReceivable = this.selectComponent('#table-accountsReceivable');
    accountsReceivable.init(accountsReceivableTRateData)
    // 流量来源
   
  },
  bindMonthsPickerChange(e) {
    // console.log('picker发送选择改变，Months携带值为', e.detail.value)

    const partSalesData = app.globalData.onLine.partSales
    this.setData({
      'partSales.index': e.detail.value,
      'partSales.monthDoc': partSalesData.monthGroups.list[e.detail.value]
    })
  },
 
});

// 销售占比
function proportionData(canvas, width, height, F2) { // 使用 F2 绘制图表
  const mapDoc = getApp().globalData.onLine.proportion.proportionLegend
  // const map = {
  //   '上海店': '40%',
  //   '沈阳店': '58%',
  //   '其他': '2%',
  // };
  // console.log(mapDoc)
  const map = {}
  mapDoc.map(i => {
    map[i.shopName] = i.percentDisplay
  })
  // console.log(map)
  const data = getApp().globalData.onLine.proportion.proportionValues
  const data1 = [
    { shopName: '上海店', percent: 0.4, constValue: '1' },
    { shopName: '沈阳店', percent: 0.58, constValue: '1' },
    { shopName: '其他', percent: 0.02, constValue: '1' }
  ];
  const chart = new F2.Chart({
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
    .color('shopName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
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

// 过去7天销售趋势
function salesTrendData(canvas, width, height, F2) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false
  });
  const data1 = [
    { money: 5900, day: 1, title: '第一天' },
    { money: 1284, day: 2, title: '第二天' },
    { money: 1117, day: 3, title: '第三天' },
    { money: 978, day: 4, title: '第四天' },
    { money: 700, day: 5, title: '第五天' },
    { money: 567, day: 6, title: '第六天' },
    { money: 201, day: 7, title: '第七天' },
  ];
  
  const data = getApp().globalData.onLine.salesTrendData.list
  chart.source(data, {
    day: {
      min: 0.9,
      max: 7.1
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    showItemMarker: false,
    background: {
      radius: 2,
      fill: '#1890FF',
      padding: [3, 5]
    },
    nameStyle: {
      fill: '#fff'
    },
    onShow(ev) {
      const items = ev.items;
      items[0].value = items[0].value + ' 元 ';
      items[0].name =  items[0].title ;
    }
  });
  chart.line().position('title*money');
  chart.point()
    .position('title*money')
    .style({
      lineWidth: 1,
      stroke: '#fff'
    });

  chart.interaction('pan');
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      offsetY: -5
    }
  });

  // 绘制 tag
  chart.guide().tag({
    position: [1969, 1344],
    withPoint: false,
    content: '1,344',
    limitInPlot: true,
    offsetX: 5,
    direct: 'cr'
  });
  chart.render();
  return chart;
}

// 过去7天订单成交趋势（笔）
function orderTrendData(canvas, width, height, F2) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false
  });
  const data1 = [
    { count: 500, day: 1, title: '第一天' },
    { count: 184, day: 2, title: '第二天' },
    { count: 117, day: 3, title: '第三天' },
    { count: 78, day: 4, title: '第四天' },
    { count: 70, day: 5, title: '第五天' },
    { count: 67, day: 6, title: '第六天' },
    { count: 21, day: 7, title: '第七天' },
  ];
  const data = app.globalData.onLine.orderTrendData.list
  chart.source(data, {
    day: {
      min: 0.9,
      max: 7.1
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    showItemMarker: false,
    background: {
      radius: 2,
      fill: '#1890FF',
      padding: [3, 5]
    },
    nameStyle: {
      fill: '#fff'
    },
    onShow(ev) {
      const items = ev.items;
      items[0].value = items[0].value + ' 笔 ';
      items[0].name = items[0].title;
    }
  });
  chart.line().position('title*count');
  chart.point()
    .position('title*count')
    .style({
      lineWidth: 1,
      stroke: '#fff'
    });

  chart.interaction('pan');
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      offsetY: -5
    }
  });

  // 绘制 tag
  chart.guide().tag({
    position: [1969, 1344],
    withPoint: false,
    content: '1,344',
    limitInPlot: true,
    offsetX: 5,
    direct: 'cr'
  });
  chart.render();
  return chart;
}

// 最畅销的十款商品
function bestSellerGoodsData(canvas, width, height, F2) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  const Global = F2.Global;
  const data1 = [
    { brand: '片仔癀', count: 1070 },
    { brand: '美年达', count: 1080 },
    { brand: '大宝', count: 1314 },
    { brand: '罗拉', count: 1470 },
    { brand: '7°', count: 10497 },
    { brand: 'CPB', count: 10970 },
    { brand: '兰芝', count: 10970 },
    { brand: '菲洛嘉', count: 18203 },
    { brand: '兰蔻', count: 23489 },
    { brand: '后', count: 27034 },
  ];
  const data = app.globalData.onLine.bestSellerGoodsData.list
  // 绘制文本
  data.map(function (obj) {
    chart.guide().text({
      position: [obj.brand, obj.count],
      content: obj.count,
      style: {
        width: '100px',
        textAlign: 'start',
        size: '12px'
      },
      offsetX: 1
    });
  });
  chart.source(data, {
    population: {
      tickCount: 5
    }
  });
  chart.coord({
    transposed: true
  });
  chart.axis('brand', {
    line: Global._defaultAxis.line,
    grid: null
  });
  chart.axis('count', {
    line: null,
    grid: Global._defaultAxis.grid,
    label: function label(text, index, total) {
      var textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.tooltip({
    onShow(ev) {
      const items = ev.items;
      items[0].value = items[0].value;
      items[0].name = items[0].title;
    }
  });
  chart.interval().position('brand*count');
  chart.render();

  return chart;
}

// 低销量十款商品
function lowSalesGoodsData(canvas, width, height, F2) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  const Global = F2.Global;
  const data1 = [
    { brand: '片仔癀', count: 17 },
    { brand: '美年达', count: 108 },
    { brand: '大宝', count: 131 },
    { brand: '罗拉', count: 147 },
    { brand: '7°', count: 1049 },
    { brand: 'CPB', count: 1097 },
    { brand: '兰芝', count: 1097 },
    { brand: '菲洛嘉', count: 1820 },
    { brand: '兰蔻', count: 2348 },
    { brand: '后', count: 2703 },
  ];
  const data = app.globalData.onLine.lowSellerGoodsData.list
  // 绘制文本
  data.map(function (obj) {
    chart.guide().text({
      position: [obj.brand, obj.count],
      content: obj.count,
      style: {
        textAlign: 'start',
        size: '12px'
      },
      offsetX: 1
    });
  });
  chart.source(data, {
    population: {
      tickCount: 5
    }
  });
  chart.coord({
    transposed: true
  });
  chart.axis('brand', {
    line: Global._defaultAxis.line,
    grid: null
  });
  chart.axis('count', {
    line: null,
    grid: Global._defaultAxis.grid,
    label: function label(text, index, total) {
      var textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.tooltip({
    onShow(ev) {
      const items = ev.items;
      items[0].value = items[0].value;
      items[0].name = items[0].title;
    }
  });
  chart.interval().position('brand*count');
  chart.render();

  return chart;
}


// 应收账款周转率
function accountsReceivableTRateData(canvas, width, height, F2) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false
  });
  const data1 = [
    { rate: 0.66, title: 1 },
    { rate: 0.60, title: 2 },
    { rate: 0.56, title: 3 },
    { rate: 0.16, title: 4 },
    { rate: 0.36, title: 5 },
    { rate: 0.76, title: 6 },
    { rate: 0.26, title: 7 },
    { rate: 0.36, title: 8 },
    { rate: 0.56, title: 9 },
    { rate: 0.43, title: 10 },
    { rate: 0.76, title: 11 },
    { rate: 0.26, title: 12 },
  ];
  const data = app.globalData.onLine.accountsReceivableTRateData.list
  chart.source(data, {
    title: {
      min: 0.9,
      max: 12.1,
    },
    rate: {
      formatter(val) {
        // return val * 100 + '%';
        return val  + '%';

      }
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    showItemMarker: false,
    background: {
      radius: 2,
      fill: '#1890FF',
      padding: [3, 5]
    },
    nameStyle: {
      fill: '#fff'
    },
    onShow(ev) {
      const items = ev.items;
      items[0].value = items[0].value;
      items[0].name = items[0].title + '月';
    }
  });
  chart.line().position('title*rate');
  chart.point()
    .position('title*rate')
    .style({
      lineWidth: 1,
      stroke: '#fff'
    });

  chart.interaction('pan');
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      offsetY: -5
    }
  });

  // 绘制 tag
  chart.guide().tag({
    position: [1969, 1344],
    withPoint: false,
    content: '1,344',
    limitInPlot: true,
    offsetX: 5,
    direct: 'cr'
  });
  chart.render();
  return chart;
}

// 流量来源

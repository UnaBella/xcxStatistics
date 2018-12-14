// index.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖

let chart = null;



Page({
  data: {
    moreStatus: false,
    shops: ['沈阳店', '上海店'],
    index: 0,
    partSales: {
      dailyAverage: '200',
      dayDoc: {
        upOrDown: 0,
        rate: '20%',
        actualAmount: '1000.00',
        supplyAmount: '750',
        orderNum: '300',
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
        index: 0
      }
    },
    // 销售占比
    proportionData: {
      onInit: (canvas, width, height, F2) => { // 使用 F2 绘制图表
        const map = {
          '上海店': '40%',
          '沈阳店': '58%',
          '其他': '2%',
        };
        const data = [
          { name: '上海店', percent: 0.4, a: '1' },
          { name: '沈阳店', percent: 0.58, a: '1' },
          { name: '其他', percent: 0.02, a: '1' }
        ];
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
            appear: {
              duration: 1200,
              easing: 'bounceOut'
            }
          });

        chart.render();
        return chart;
      }
    },
    // 过去7天销售趋势
    salesTrendData: {
      onInit: function initChart(canvas, width, height, F2) {
        chart = new F2.Chart({
          el: canvas,
          width,
          height,
          animate: false
        });
        const data = [
          { money: 5900, day: 1, title: '第一天' },
          { money: 1284, day: 2, title: '第二天' },
          { money: 1117, day: 3, title: '第三天' },
          { money: 978, day: 4, title: '第四天' },
          { money: 700, day: 5, title: '第五天' },
          { money: 567, day: 6, title: '第六天' },
          { money: 201, day: 7, title: '第七天' },
        ];
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
            items[0].name = '第 ' + items[0].title + ' 天 ';
          }
        });
        chart.line().position('day*money');
        chart.point()
          .position('day*money')
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
    },
    // 过去7天订单成交趋势
    orderTrendData: {
      onInit: function initChart(canvas, width, height, F2) {
        chart = new F2.Chart({
          el: canvas,
          width,
          height,
          animate: false
        });
        const data = [
          { count: 500, day: 1, title: '第一天' },
          { count: 184, day: 2, title: '第二天' },
          { count: 117, day: 3, title: '第三天' },
          { count: 78, day: 4, title: '第四天' },
          { count: 70, day: 5, title: '第五天' },
          { count: 67, day: 6, title: '第六天' },
          { count: 21, day: 7, title: '第七天' },
        ];
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
            items[0].name = '第 ' + items[0].title + ' 天 ';
          }
        });
        chart.line().position('day*count');
        chart.point()
          .position('day*count')
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
    },

    // 最畅销的十款商品
    bestSellerGoodsData: {
      onInit: (canvas, width, height, F2) => {
        chart = new F2.Chart({
          el: canvas,
          width,
          height
        });

        const Global = F2.Global;
        const data = [
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
    },
    // 低销量十款商品
    lowSalesGoodsData: {
      onInit: (canvas, width, height, F2) => {
        chart = new F2.Chart({
          el: canvas,
          width,
          height
        });

        const Global = F2.Global;
        const data = [
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
    },
    
    
    // 应收账款周转率
    accountsReceivableTRateData: {
      onInit: function initChart(canvas, width, height, F2) {
        chart = new F2.Chart({
          el: canvas,
          width,
          height,
          animate: false
        });
        const data = [
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
        chart.source(data, {
          title: {
            min: 0.9,
            max: 12.1,
          },
          rate: {
            formatter(val) {
              return val * 100 + '%';
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
    },
    // 流量来源
    trafficSourceData:{
      onInit: (canvas, width, height, F2) => { // 使用 F2 绘制图表
        const map = {
          '淘宝': '40%',
          '喆含': '38%',
          '妮素': '22%',
        };
        const data = [
          { name: '淘宝', percent: 0.4, a: '1' },
          { name: '喆含', percent: 0.38, a: '1' },
          { name: '妮素', percent: 0.22, a: '1' }
        ];
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
            appear: {
              duration: 1200,
              easing: 'bounceOut'
            }
          });

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
  checkMore: function () {
    this.setData({
      moreStatus: true
    })
  }
});



$(function () {

    echarts_1();
    echarts_2();
    map();
    echarts_3();
    echarts_4();
    echarts_5();
    echarts_6();

    function echarts_1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_1'));

        var data = [
            {
              name: '经济学院',
              children: [
                {
                  name: '经济学',
                  value: 17,
                  
                },
                {
                  name: '国际金融',
                  value: 12,
                  
                },
                {
                    name: '金融学',
                    value: 17,    
                },
                {
                    name: '保险学',
                    value: 7,    
                },
                {
                    name: '财政学',
                    value: 8,    
                },
                {
                    name: '资源环境经济学',
                    value: 9,    
                },
                {
                    name: '经济史学',
                    value: 9,    
                },
              ]
            },
            {
              name: '人口所',
              value:17
            },
            {
                name: '国发院',
                value:50
            },
            {
                name: '光华管理学院',
                children: [
                  {
                    name: '会计学',
                    value: 16,
                    
                  },
                  {
                    name: '应用经济学',
                    value: 18,
                    
                  },
                  {
                      name: '商务统计与经济计量系',
                      value: 9,    
                  },
                  {
                      name: '组织与战略管理系',
                      value: 23,    
                  },
                  {
                      name: '金融系',
                      value: 28,    
                  },
                  {
                      name: '管理科学与信息系统系',
                      value: 12,    
                  },
                  {
                      name: '市场营销学',
                      value: 15,    
                  },
                ]
              },
          ];
          option = {
            series: {
              type: 'sunburst',
              // emphasis: {
              //     focus: 'ancestor'
              // },
              data: data,
              radius: [0, '90%'],
              label: {
                rotate: 'radial'
              }
            }
          };;

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_2'));

        option = {
            backgroundColor: 'rgba(0,0,0,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}  <br/>{c}人"
            },
            legend: {
                x: 'center',
                y: '2%',
                data: ['每年入学学生', '在校本科生','在校研究生'],
                icon: 'circle',
                textStyle: {
                    color: '#fff',
                }
            },
            calculable: true,
            series: [{
                name: '人数',
                type: 'pie',
                //起始角度，支持范围[0, 360]
                startAngle: 0,
                //饼图的半径，数组的第一项是内半径，第二项是外半径
                radius: [41, 110],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '20%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                roseType: 'area',
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}人'
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length2: 1,
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: [
                    
                    {
                        value: 1000,
                        name: '每年入学学生',
                        itemStyle: {
                            normal: {
                                color: '#5045f6'
                            }
                        }
                    },
                    {
                        value: 1355,
                        name: '在校本科生',
                        itemStyle: {
                            normal: {
                                color: '#ad46f3'
                            }
                        }
                    },
                    {
                        value: 2274,
                        name: '在校研究生',
                        itemStyle: {
                            normal: {
                                color: '#4777f5'
                            }
                        }
                    },
                    
                    
                    

                    
                    
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                ]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function map() {
        // 基于准备好的dom，初始化echarts实例
        // var myChart = echarts.init(document.getElementById('map'));

    
        // var mapName = 'china'
        // var data = []
        // var geoCoordMap = {};
        // var toolTipData = [];

        /*获取地图数据*/
        // myChart.showLoading();
        // var mapFeatures = echarts.getMap(mapName).geoJson.features;
        // myChart.hideLoading();
        // mapFeatures.forEach(function(v) {
        //     // 地区名称
        //     var name = v.properties.name;
        //     // 地区经纬度
        //     geoCoordMap[name] = v.properties.cp;
        //     data.push({
        //         name: name,
        //         value: Math.round(Math.random() * 100 + 10)
        //     })
        //     toolTipData.push({
        //         name: name,
        //         value: [{
        //             name: "车型一",
        //             value: Math.round(Math.random() * 100 + 10) + '辆'
        //         },
        //             {
        //                 name: "车型二",
        //                 value: Math.round(Math.random() * 100 + 10)+ '辆'
        //             },
        //             {
        //                 name: "车型三",
        //                 value: Math.round(Math.random() * 100 + 10)+ '辆'
        //             },
        //             {
        //                 name: "车型四",
        //                 value: Math.round(Math.random() * 100 + 10)+ '辆'
        //             }
        //         ]
        //     })
        // });

        // var max = 480,
        //     min = 9; // todo
        // var maxSize4Pin = 50,
        //     minSize4Pin = 20;

        // var convertData = function(data) {
        //     var res = [];
        //     for (var i = 0; i < data.length; i++) {
        //         var geoCoord = geoCoordMap[data[i].name];
        //         if (geoCoord) {
        //             res.push({
        //                 name: data[i].name,
        //                 value: geoCoord.concat(data[i].value),
        //             });
        //         }
        //     }
        //     return res;
        // };

        // option = {



        //     tooltip: {
        //         trigger: 'item',
        //         formatter: function(params) {
        //             if (typeof(params.value)[2] == "undefined") {
        //                 var toolTiphtml = ''
        //                 for(var i = 0;i<toolTipData.length;i++){
        //                     if(params.name==toolTipData[i].name){
        //                         toolTiphtml += toolTipData[i].name+':<br>'
        //                         for(var j = 0;j<toolTipData[i].value.length;j++){
        //                             toolTiphtml+=toolTipData[i].value[j].name+':'+toolTipData[i].value[j].value+"<br>"
        //                         }
        //                     }
        //                 }
        //                 console.log(toolTiphtml)
        //                 // console.log(convertData(data))
        //                 return toolTiphtml;
        //             } else {
        //                 var toolTiphtml = ''
        //                 for(var i = 0;i<toolTipData.length;i++){
        //                     if(params.name==toolTipData[i].name){
        //                         toolTiphtml += toolTipData[i].name+':<br>'
        //                         for(var j = 0;j<toolTipData[i].value.length;j++){
        //                             toolTiphtml+=toolTipData[i].value[j].name+':'+toolTipData[i].value[j].value+"<br>"
        //                         }
        //                     }
        //                 }
        //                 console.log(toolTiphtml)
        //                 // console.log(convertData(data))
        //                 return toolTiphtml;
        //             }
        //         }
        //     },
        //     legend: {
        //         orient: 'vertical',
        //         y: 'bottom',
        //         x: 'right',
        //         data: ['credit_pm2.5'],
        //         textStyle: {
        //             color: '#fff'
        //         }
        //     },
        //     visualMap: {
        //         show: false,
        //         min: 0,
        //         max: 600,
        //         left: 'left',
        //         top: 'bottom',
        //         text: ['高', '低'], // 文本，默认为数值文本
        //         calculable: true,
        //         seriesIndex: [1],
        //         inRange: {
        //             // color: ['#3B5077', '#031525'] // 蓝黑
        //             // color: ['#ffc0cb', '#800080'] // 红紫
        //             // color: ['#3C3B3F', '#605C3C'] // 黑绿
        //             //  color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
        //             // color: ['#23074d', '#cc5333'] // 紫红
        //             //   color: ['#00467F', '#A5CC82'] // 蓝绿
        //             // color: ['#1488CC', '#2B32B2'] // 浅蓝
        //             // color: ['#00467F', '#A5CC82','#ffc0cb'] // 蓝绿红
        //             // color: ['#00467F', '#A5CC82'] // 蓝绿
        //             // color: ['#00467F', '#A5CC82'] // 蓝绿
        //             // color: ['#00467F', '#A5CC82'] // 蓝绿
        //             color: ['#22e5e8', '#0035f9','#22e5e8'] // 蓝绿

        //         }
        //     },
        //     /*工具按钮组*/
        //     toolbox: {
        //         show: false,
        //         orient: 'vertical',
        //         left: 'right',
        //         top: 'center',
        //         feature: {

        //             dataView: {
        //                 readOnly: false
        //             },
        //             restore: {},
        //             saveAsImage: {}
        //         }
        //     },
        //     geo: {
        //         show: true,
        //         map: mapName,
        //         label: {
        //             normal: {
        //                 show: false
        //             },
        //             emphasis: {
        //                 show: false
        //             }
        //         },
        //         roam: true,
        //         itemStyle: {
        //             normal: {
        //                 areaColor: '#031525',
        //                 borderColor: '#097bba'
        //             },
        //             emphasis: {
        //                 areaColor: '#2B91B7'
        //             }
        //         }
        //     },
        //     series: [{
        //         name: '散点',
        //         type: 'scatter',
        //         coordinateSystem: 'geo',
        //         data: convertData(data),
        //         symbolSize: function(val) {
        //             return val[2] / 10;
        //         },
        //         label: {
        //             normal: {
        //                 formatter: '{b}',
        //                 position: 'right',
        //                 show: false
        //             },
        //             emphasis: {
        //                 show: false
        //             }
        //         },
        //         itemStyle: {
        //             normal: {
        //                 color: 'rgba(255,255,0,0.8)'
        //             }
        //         }
        //     },
        //         {
        //             type: 'map',
        //             map: mapName,
        //             geoIndex: 0,
        //             aspectScale: 0.75, //长宽比
        //             showLegendSymbol: false, // 存在legend时显示
        //             label: {
        //                 normal: {
        //                     show: true
        //                 },
        //                 emphasis: {
        //                     show: false,
        //                     textStyle: {
        //                         color: '#fff'
        //                     }
        //                 }
        //             },
        //             roam: true,
        //             itemStyle: {
        //                 normal: {
        //                     areaColor: '#031525',
        //                     borderColor: '#3B5077',
        //                 },
        //                 emphasis: {
        //                     areaColor: '#2B91B7'
        //                 }
        //             },
        //             animation: false,
        //             data: data
        //         },
        //         {
        //             name: '点',
        //             type: 'scatter',
        //             coordinateSystem: 'geo',
        //             symbol: 'pin', //气泡
        //             symbolSize: function(val) {
        //                 var a = (maxSize4Pin - minSize4Pin) / (max - min);
        //                 var b = minSize4Pin - a * min;
        //                 b = maxSize4Pin - a * max;
        //                 return a * val[2] + b;
        //             },
        //             label: {

        //                 normal: {
        //                     show: false,
        //                     formatter:function (params) { return params.data.value[2] },
        //                     textStyle: {
        //                         color: '#fff',
        //                         fontSize: 9,
        //                     }
        //                 }
        //             },
        //             itemStyle: {

        //                 normal: {
        //                     color: 'rgba(255,255,0,0)', //标志颜色
        //                 }
        //             },
        //             zlevel: 6,
        //             data: convertData(data),
        //         },
        //         {
        //             name: 'Top 5',
        //             type: 'effectScatter',
        //             coordinateSystem: 'geo',
        //             data: convertData(data.sort(function(a, b) {
        //                 return b.value - a.value;
        //             }).slice(0, 5)),
        //             symbolSize: function(val) {
        //                 return val[2] / 10;
        //             },
        //             showEffectOn: 'render',
        //             rippleEffect: {
        //                 brushType: 'stroke'
        //             },
        //             hoverAnimation: true,
        //             label: {
        //                 normal: {
        //                     formatter: '{b}',
        //                     position: 'right',
        //                     show: true
        //                 }
        //             },
        //             itemStyle: {
        //                 normal: {
        //                     color: 'rgba(255,255,0,0.8)',
        //                     shadowBlur: 10,
        //                     shadowColor: '#05C3F9'
        //                 }
        //             },
        //             zlevel: 1
        //         },

        //     ]
        // };

        // // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
        // window.addEventListener("resize",function(){
        //     myChart.resize();
        // });
    }
    function echarts_3() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_3'));

        option = {

            tooltip : {
                trigger: 'axis'
            },
            legend: {
                orient: 'vertical',
                data:['简易程序案件数']
            },
            grid: {
                left: '3%',
                right: '3%',
                top:'8%',
                bottom: '5%',
                containLabel: true
            },
            color:['#a4d8cc','#25f3e6'],
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },

            calculable : true,
            xAxis : [
                {
                    type : 'category',

                    axisTick:{show:false},

                    boundaryGap : false,
                    axisLabel: {
                        textStyle:{
                            color: '#ccc',
                            fontSize:'12'
                        },
                        lineStyle:{
                            color:'#2c3459',
                        },
                        interval: {default: 0},
                        rotate:50,
                        formatter : function(params){
                            var newParamsName = "";// 最终拼接成的字符串
                            var paramsNameNumber = params.length;// 实际标签的个数
                            var provideNumber = 4;// 每行能显示的字的个数
                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                            /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
                            // 条件等同于rowNumber>1
                            if (paramsNameNumber > provideNumber) {
                                /** 循环每一行,p表示行 */
                                var tempStr = "";
                                tempStr=params.substring(0,4);
                                newParamsName = tempStr+"...";// 最终拼成的字符串
                            } else {
                                // 将旧标签的值赋给新标签
                                newParamsName = params;
                            }
                            //将最终的字符串返回
                            return newParamsName
                        }

                    },
                    data: ["22/12/11","22/12/18","22/12/25","23/1/1","23/1/8","23/1/15","23/1/22","23/1/29","23/2/5","23/2/12","23/2/19","23/2/26","23/3/5","23/3/12","23/3/19","23/3/26","23/4/2","23/4/9","23/4/16","23/4/23","23/4/30","23/5/7","23/5/14","23/5/21","23/5/28","23/6/4","23/6/11","23/6/18","23/6/25","23/7/2","23/7/9","23/7/16","23/7/23","23/7/30","23/8/6","23/8/13","23/8/20","23/8/27","23/9/3","23/9/10","23/9/17","23/9/24","23/10/1","23/10/8","23/10/15","23/10/22","23/10/29","23/11/5","23/11/12","23/11/19","23/11/26"]

                }
            ],
            yAxis : {

                type : 'value',
                axisLabel: {
                    textStyle: {
                        color: '#ccc',
                        fontSize:'12',
                    }
                },
                axisLine: {
                    lineStyle:{
                        color:'rgba(160,160,160,0.3)',
                    }
                },
                splitLine: {
                    lineStyle:{
                        color:'rgba(160,160,160,0.3)',
                    }
                },

            }
            ,
            series : [
                {
                    // name:'简易程序案件数',
                    type:'line',
                    areaStyle: {

                        normal: {type: 'default',
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
                                offset: 0,
                                color: '#25f3e6'
                            }, {
                                offset: 1,
                                color: '#0089ff'
                            }], false)
                        }
                    },
                    smooth:true,
                    itemStyle: {
                        normal: {areaStyle: {type: 'default'}}
                    },
                    data:[78,71,54,103,64,37,53,35,51,46,90,78,72,68,143,61,50,132,108,52,64,126,90,75,87,72,68,58,107,65,92,52,130,51,73,63,55,106,75,102,53,87,55,53,59,74,52,56,37,67,45]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function echarts_4() {
        // // 基于准备好的dom，初始化echarts实例
        // var myChart = echarts.init(document.getElementById('echarts_4'));

        // option = {
        //     tooltip: {},
        //     animationDurationUpdate: 1500,
        //     animationEasingUpdate: 'quinticInOut',
        //     series: [
        //       {
        //         type: 'graph',
        //         layout: 'none',
        //         symbolSize: 50,
        //         roam: true,
        //         label: {
        //           show: true
        //         },
        //         edgeSymbol: ['circle', 'arrow'],
        //         edgeSymbolSize: [4, 10],
        //         edgeLabel: {
        //           fontSize: 10
        //         },
        //         data: [
        //         {
        //             name:'跨学科类学院',
        //             x:550,
        //             y:300
        //         },
        //           {
        //             name: '现代农学院',
        //             x: 300,
        //             y: 300
        //           },
        //           {
        //             name: '元培学院',
        //             x: 400,
        //             y: 442
        //           },
        //           {
        //             name: '燕京学堂',
        //             x: 700,
        //             y: 442
        //           },
        //           {
        //             name: '科维理天文天体研究所',
        //             x: 400,
        //             y: 158
        //           },
        //           {
        //             name: '前沿交叉学科研究院',
        //             x: 700,
        //             y: 158
        //           },
        //           {
        //             name: '信息科学技术学院',
        //             x: 650,
        //             y: 58
        //           },
        //           {
        //             name: '数学科学学院',
        //             x: 790,
        //             y: 208
        //           },

        //           {
        //             name: '清华大学农学院',
        //             x: 200,
        //             y: 200
        //           },
        //           {
        //             name: '华北大学农学院',
        //             x: 200,
        //             y: 400
        //           },
        //           {
        //             name: '国际数学研究中心',
        //             x: 850,
        //             y: 300
        //           },
                  
        //           {
        //             name: '人工智能研究院',
        //             x: 550,
        //             y: 100
        //           },
        //           {
        //             name: '核科学与技术院',
        //             x: 550,
        //             y: 500
        //           },
        //           {
        //             name: '物理系',
        //             x: 550,
        //             y: 600
        //           },
        //           {
        //             name: '化学系',
        //             x: 450,
        //             y: 550
        //           },
        //           {
        //             name: '环境系',
        //             x: 650,
        //             y: 550
        //           }
        //         ],
        //         // links: [],
        //         links: [
        //           {
        //             source: '跨学科类学院',
        //             target: '现代农学院',
        //             symbolSize: [5, 20],
        //             lineStyle: {
                      
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: 0,
        //             target: '国际数学研究中心',
        //             lineStyle: {
                        
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: 0,
        //             target: '人工智能研究院',
        //             lineStyle: {
                        
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: 0,
        //             target: '核科学与技术院',
        //             lineStyle: {
                        
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: '跨学科类学院',
        //             target: '燕京学堂',
        //             symbolSize: [5, 20],
        //             lineStyle: {
                      
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: '跨学科类学院',
        //             target: '元培学院',
        //             symbolSize: [5, 20],
        //             lineStyle: {
                      
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: '元培学院',
        //             target: '跨学科类学院',
        //             symbolSize: [5, 20],
        //             lineStyle: {
                      
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: '跨学科类学院',
        //             target: '科维理天文天体研究所',
        //             symbolSize: [5, 20],
        //             lineStyle: {
                      
        //               curveness: 0.2
        //             }
        //           },
        //           {
        //             source: '跨学科类学院',
        //             target: '前沿交叉学科研究院',
        //             symbolSize: [5, 20],
        //             lineStyle: {
                      
        //               curveness: 0.2
        //             }
        //           },
                  
        //           {
        //             source: '核科学与技术院',
        //             target: '物理系'
        //           },
        //           {
        //             source: '核科学与技术院',
        //             target: '化学系'
        //           },
        //           {
        //             source: '核科学与技术院',
        //             target: '环境系'
        //           },
        //           {
        //             source: '现代农学院',
        //             target: '清华大学农学院'
        //           },
        //           {
        //             source: '现代农学院',
        //             target: '华北大学农学院'
        //           },
        //           {
        //             source: '前沿交叉学科研究院',
        //             target: '人工智能研究院'
        //           },
        //           {
        //             source: '前沿交叉学科研究院',
        //             target: '信息科学技术学院'
        //           },
        //           {
        //             source: '前沿交叉学科研究院',
        //             target: '数学科学学院'
        //           },
        //           {
        //             source: '数学科学学院',
        //             target: '国际数学研究中心'
        //           },
        //           {
        //             source: '信息科学技术学院',
        //             target: '人工智能研究院'
        //           },


                  
        //         ],
        //         lineStyle: {
        //           opacity: 0.9,
        //           width: 2,
        //           curveness: 0
        //         }
        //       }
        //     ]
        //   };


        // // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
        // window.addEventListener("resize",function(){
        //     myChart.resize();
        // });
    }
    function echarts_5() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_5'));

        var xData = function() {
            var data = ['80年代','90年代','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010',
                        '2011','2012','2013','2014','2015','2016','2017','2018','2019','2020',
                        '2021','2022','2023'];

            return data;
        }();

        var data = [2, 26, 7, 3, 4, 2, 1, 1, 2, 1, 4, 1, 2, 1, 1, 1, 3, 6, 1, 1, 1, 1, 1, 1, 0, 0]

        option = {
            // backgroundColor: "#141f56",

            tooltip: {
                show: "true",
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.4)', // 背景
                padding: [8, 10], //内边距
                // extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
                formatter: function(params) {
                    if (params.seriesName != "") {
                        return params.name + ' ：  ' + params.value + ' 件';
                    }
                },

            },
            grid: {
                borderWidth: 0,
                top: 20,
                bottom: 35,
                left:55,
                right:30,
                textStyle: {
                    color: "#fff"
                }
            },
            xAxis: [{
                type: 'category',

                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    // formatter:function(val){
                    //     return val.split("").join("\n")
                    // },
                },
                data: xData,
            }, {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                data: xData,
            }],
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#32346c',
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#32346c ',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    formatter: '{value}',
                },
            },
            series: [{
                // name: '生师比(%)',
                type: 'bar',
                itemStyle: {
                    normal: {
                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00c0e9'
                        }, {
                            offset: 1,
                            color: '#3b73cf'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,
                    },
                    emphasis: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(105,123, 214, 0.7)'
                    }
                },
                zlevel: 2,
                barWidth: '20%',
                data: data,
            },
                {
                    name: '',
                    type: 'bar',
                    xAxisIndex: 1,
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            color: '#121847',
                            borderWidth: 0,
                            shadowBlur: {
                                shadowColor: 'rgba(255,255,255,0.31)',
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 2,
                            },
                        }
                    },
                    barWidth: '20%',
                    data: [30, 30, 30, 30, 30]
                }
            ]
        }


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function echarts_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_6'));

        var data = {
            "chart": [{
                month: "NO.1",
                value: 600,

            },

                {
                    month: "NO.2",
                    value: 500,

                },

                {
                    month: "NO.3",
                    value: 614,

                },

                {
                    month: "NO.4",
                    value: 442,

                },

                {
                    month: "NO.5",
                    value: 322

                }

            ]
        }


        var xAxisMonth = [],
            barData = [],
            lineData = [];
        for (var i = 0; i < data.chart.length; i++) {
            xAxisMonth.push(data.chart[i].month);
            barData.push({
                "name": xAxisMonth[i],
                "value": data.chart[i].value
            });
            lineData.push({
                "name": xAxisMonth[i],
                "value": data.chart[i].ratio
            });
        }

        option = {
            // backgroundColor: "#020d22",
            title: '',
            grid: {
                top: '10%',
                left: '18%',
                bottom: '3%',
                right:'5%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function(params) {
                    return params[0]["data"].name + "<br/>" + '报警次数: ' + params[1]["data"].value+'次' ;
                }
            },
            xAxis: [{
                type: 'category',
                show: false,
                data: ['NO.1', 'NO.2', 'NO.3', 'NO.4', 'NO.5'],
                axisLabel: {
                    textStyle: {
                        color: '#b6b5ab'
                    }
                }
            },
                {
                    type: 'category',
                    position: "bottom",
                    data: xAxisMonth,
                    boundaryGap: true,
                    // offset: 40,
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: "rgba(255,255,255,0.2)"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        color: "rgba(255,255,255,0.2)"
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#b6b5ab'
                        }
                    }
                }

            ],
            yAxis: [{
                show: true,
                offset: 52,
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: "rgba(255,255,255,0.2)"
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    color: "rgba(255,255,255,0.2)"
                },
                axisLabel: {
                    show: true,
                    color: '#b6b5ab'
                }
            }, {
                show: false,
                type: "value",
                // name: "合格率(%)",
                nameTextStyle: {
                    color: '#ccc'
                },
                axisLabel: {
                    color: '#ccc'
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: true
                }
            }],
            color: ['#e54035'],
            series: [{
                name: '训练人次',
                type: 'pictorialBar',
                xAxisIndex: 1,
                barCategoryGap: '-80%',
                // barCategoryGap: '-5%',
                symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var colorList = [
                                'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                                'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                                'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)'
                            ];
                            return colorList[params.dataIndex];
                        }
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: barData,
            },
                {
                    symbol: 'image://data:image/png;base64,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',
                    symbolSize: 42,
                    name: "完成率",
                    type: "line",
                    yAxisIndex: 1,
                    data: lineData,
                    itemStyle: {
                        normal: {
                            borderWidth: 5,
                            color: {
                                colorStops: [{
                                    offset: 0,
                                    color: '#821eff'
                                },

                                    {
                                        offset: 1,
                                        color: '#204fff'
                                    }
                                ],
                            }
                        }
                    }
                }
            ]
        }


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }






})


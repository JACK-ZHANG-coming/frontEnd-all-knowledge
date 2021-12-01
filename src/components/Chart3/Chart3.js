import React, { useEffect } from "react";
import * as echarts from 'echarts';

const Child3Item = props => {

  const initChart = () => {
    let element = document.getElementById('chart3');
    let myChart = echarts.init(element);
    myChart.clear()
    let option;
    option = {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    option && myChart.setOption(option);
  }

  useEffect(() => {
    initChart()
  }, [])

  return (
    <div id='chart3' style={{ width: '80%', margin: '50px auto', height: '600px' }}></div>
  )
}

export default Child3Item;


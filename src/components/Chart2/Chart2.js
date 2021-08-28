import React, { useEffect } from "react";
import * as echarts from 'echarts';

const Child2Item = props => {

  const initChart = () => {
    let element = document.getElementById('chart2');
    let myChart = echarts.init(element);
    myChart.clear()
    let option;
    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }]
    };

    option && myChart.setOption(option);
  }

  useEffect(() => {
    initChart()
  }, [])

  return (
    <div id='chart2' style={{ width: '80%', margin: '50px auto', height: '600px' }}></div>
  )
}

export default Child2Item;


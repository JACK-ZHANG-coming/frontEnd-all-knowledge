import React, { useEffect } from "react";
import * as echarts from 'echarts';

const Child1Item = props => {

  const initChart = () => {
    let element = document.getElementById('chart1');
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }]
    };

    option && myChart.setOption(option);
  }

  useEffect(() => {
    initChart()
  }, [])

  return (
    <div id='chart1' style={{ width: '80%', margin: '50px auto', height: '600px' }}></div>
  )
}

export default Child1Item;


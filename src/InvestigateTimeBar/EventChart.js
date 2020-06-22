/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

const EventChart = props => {
  const { min, max, data } = props;

  return (
    <ReactEchartsCore
      echarts={echarts}
      style={{ height: '100%', width: '100%' }}
      option={{
        grid: {
          top: 10,
          bottom: 60,
          left: 45,
          right: 45,
        },
        xAxis: {
          type: 'time',
          min,
          max,
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: 'Count',
          position: 'right',
          show: false,
          type: 'value',
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            data,
            type: 'bar',
            barMaxWidth: 40,
            barMinWidth: 2,
          },
        ],
        tooltip: {
          show: 'true',
        },
      }}
    />
  );
};

export default EventChart;

<template>
  <div class="w-100% h-100%">
    <BoxHeader title="备件更换" />
    <div class="box-container">
      <div class="h-20% mt-2 flex justify-between">
        <div class="w-45% flex items-center justify-center">
          <div class="w-35px h-35px bg1"></div>
          <div class="ml-5%">
            <div class="text-12px text-#666666">总更换数</div>
            <div class="text-24px text-blue">3,000</div>
          </div>
        </div>
        <div class="w-45% flex items-center justify-start ml-5%">
          <div class="w-35px h-35px bg2"></div>
          <div class="ml-5%">
            <div class="text-12px text-#666666">总费用</div>
            <div class="text-24px text-blue">30,000</div>
          </div>
          <!-- <div class="text-12px">总费用</div> -->
        </div>
      </div>
      <div class="h-70%" ref="replaceCharts"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';

  const props = defineProps({
    loading: Boolean,
  });
  const replaceCharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(replaceCharts as Ref<HTMLDivElement>);
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255)',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#A7D6FF',
                  },
                  {
                    offset: 0.5,
                    color: '#fff',
                  },
                  {
                    offset: 1,
                    color: '#A7D6FF',
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: '20%',
          left: '4%',
          right: '7%',
          bottom: '2%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['设备1', '设备2', '设备3', '设备4', '设备5', '设备6'],
            axisTick: {
              show: false, // 是否显示坐标轴轴线
            },
            axisLabel: {
              color: '#666666',
              fontSize: 12,
            },
            splitLine: {
              show: false,
            },
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。
              show: true,
              // inside: false,
              lineStyle: {
                color: '#000',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            nameTextStyle: {
              color: '#666666',
              fontSize: 12,
              align: 'center',
              padding: [0, 40, 0, 0],
            },
            // min: 0,
            // splitNumber: 6,
            // splitLine: { show: true },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              show: true,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(131,101,101,0.2)',
                type: 'dashed',
              },
            },
            show: true,
          },
          {
            type: 'value',
            // max: 50,
            name: '金额',
            nameTextStyle: {
              color: '#666666',
              fontSize: 12,
              align: 'center',
              padding: [0, 0, 0, 40],
            },

            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#cdd5e2',
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              formatter: '{value}', //右侧Y轴文字显示

              color: '#666666',
              fontSize: 12,
            },
          },
        ],
        series: [
          {
            name: '总更换数量',
            type: 'bar',
            barMaxWidth: 20,
            // zlevel: 11,
            yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用

            // barGap: '100%',
            data: [844, 1169, 1421, 1675, 2215, 2459],
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#4F93FE',
                  },
                  {
                    offset: 1,
                    color: '#A7D6FF',
                  },
                ],
              },
              borderRadius: [30, 30, 0, 0],
              label: {
                show: true, //开启显示
                position: 'inside', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#3b6ebf',
                  fontSize: 12,
                  fontWeight: 400,
                },
              },
            },
          },

          {
            name: '总费用',
            type: 'line',
            // zlevel: 11,
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: true, //平滑曲线显示
            symbol: 'circle', //标记的图形为实心圆
            symbolSize: 8, //标记的大小
            itemStyle: {
              color: '#ffa43a',
              borderColor: 'rgba(255, 234, 0, 0.5)', //圆点透明 边框
              borderWidth: 7,
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#915c1e',
                  fontSize: 12,
                  fontWeight: 400,
                },
                formatter: function (res) {
                  if (res.value) {
                    return res.value + '%';
                  } else {
                    return 0;
                  }
                },
              },
            },
            lineStyle: {
              color: '#ffa43a',
            },
            data: [29.23, 38.37, 21.55, 17.88, 32.23, 11.02],
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
<style lang="less" scoped>
  .box-container {
    height: calc(100% - 30px);
    // .box-top {
    //   display: flex;
    //   justify-content: space-around;
    //   background-color: red;
    //   .box-top-left {
    //     width: 46%;
    //     height: calc(100% - 5px);

    //     background: url('@/assets/images/equipmentManagement/replace_icon1.png') no-repeat;
    //     // background-size: cover;
    //   }
    //   .box-top-right {
    //     width: 46%;
    //     height: calc(100% - 5px);

    //     background: url('@/assets/images/equipmentManagement/replace_icon2.png') no-repeat;
    //     // background-size: cover;
    //   }
    // }
    .bg1 {
      background: url('@/assets/images/equipmentManagement/replace_icon3.png') no-repeat;
      background-size: 100% 100%;
    }
    .bg2 {
      background: url('@/assets/images/equipmentManagement/replace_icon4.png') no-repeat;
      background-size: 100% 100%;
    }
  }
</style>

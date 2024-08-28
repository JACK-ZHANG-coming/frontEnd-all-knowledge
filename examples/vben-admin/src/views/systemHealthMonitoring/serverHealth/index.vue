<!-- 服务器健康 -->
<template>
  <div class="main-container">
    <div class="w-84% h-100% ver-flex">
      <div class="w-100% h-30%"
        ><BasicInfo :info="CurrentHealthInfo" :dailyAddInfo="DailyAddInfo"
      /></div>
      <div class="w-100% h-69% hor-flex">
        <div class="w-69% h-100%"><Line /></div>
        <div class="w-30% h-100% ver-flex">
          <div class="w-100% h-44%"><ServeRate :diskInfo="diskInfo" /></div>
          <div class="w-100% h-54%"><ServeList /></div>
        </div>
      </div>
    </div>
    <div class="w-15% h-100% ver-flex">
      <div class="w-100% h-30%"><Operation /></div>
      <div class="w-100%"><ImageTurn /></div>

      <div class="w-100% h-25%"><Info /></div>
      <div class="w-100% h-20%"><Help /></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import BasicInfo from './components/BasicInfo.vue';
  import ServeRate from './components/ServeRate.vue';
  import ServeList from './components/ServeList.vue';
  import Line from './components/Line.vue';

  import Help from './components/Help.vue';
  import Info from './components/Info.vue';
  import ImageTurn from './components/ImageTurn.vue';
  import Operation from './components/Operation.vue';
  import { GetCurrentHealth, GetDailyAdd } from '@/api/systemHealthMonitoring/serverHealth';

  const CurrentHealthInfo = ref<any>(null);
  const DailyAddInfo = ref<any>(null);
  const diskInfo = ref<any>(null);
  const getHealth = () => {
    GetCurrentHealth()
      .then((res) => {
        CurrentHealthInfo.value = res;
        //饼图数据处理
        let temp: any = [];
        res.forEach((item: any) => {
          let write = 0;
          let read = 0;
          if (Number(item.diskInfo.readCount) > 0) {
            read = Number(item.diskInfo.readCount);
          }
          if (Number(item.diskInfo.writeCount) > 0) {
            write = Number(item.diskInfo.writeCount);
          }

          read = Number(item.diskInfo.readCount);
          let tempNumber = item.nodeUrl?.lastIndexOf('.');
          temp.push({
            name: item.nodeUrl.slice(tempNumber + 1, item.nodeUrl.length),

            // name: item.nodeUrl ? item.nodeUrl.slice(-2) : item.nodeUrl,
            write: write ? write.toFixed(2) : write,
            read: read ? read.toFixed(2) : read,
            value: write + read ? (write + read).toFixed(2) : write + read,
          });
        });

        diskInfo.value = temp;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDailyAddData = () => {
    GetDailyAdd()
      .then((res) => {
        DailyAddInfo.value = res;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getHealth();
  getDailyAddData();
</script>
<style lang="less" scoped>
  .main-container {
    display: flex;
    justify-content: space-between;
    height: 100%;
    padding: 1rem;

    .ver-flex {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
    }

    .hor-flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  .heightDiv {
    height: calc(56% - 180px);
  }
</style>

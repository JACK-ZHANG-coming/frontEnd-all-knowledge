<template>
  <div class="child">
    <h2>child(子)</h2>
    <h4>数据：{{ car }}</h4>
    <Son/>
  </div>
</template>

<script>
import Son from "./Son";
import { inject } from "vue";

export default {
  name: "Child",
  components: {Son},
  setup() {
    let car  = inject('car');
    console.log('@@@@ Car ', inject('car'))
  
    return {
      car
    }
  }
}
</script>

<style scoped>
   .child{
     background: skyblue;
     padding: 10px;
   }
</style>

<template>
  <h1>我是app组件</h1>
  <h2>{{ name }}</h2>
  <h2>{{ age }}</h2>
  <h3>{{ work.type }}</h3>
  <h3>{{ work.salary }}</h3>
  <nut-button @click="changeInfo ">tip</nut-button>
</template>
<script>
import { ref } from "vue";
export default {
  name:'app',
  setup() {
    let name = ref('zhao')
    let age = ref(18)
    let work = ref({
      type:'前端',
      salary:'30k'
    })

    function changeInfo() {
      name.value = 'zll'
      age.value = 20
      work.value.type = 'ui'
      console.log(work.value);
      console.log(age);
    }

    return {
      name,
      age,
      work,
      changeInfo
    }
  }
};
</script>


<template>
  <div class="completed-todos">
    <div class="completed-list">
      <h2>已完成待办事项</h2>
      <nut-table :columns="columns" :bordered="false" :data="data" striped @sorter="handleSorter"></nut-table>
    </div>
    <div id="chart" class="chart"></div>
    <nut-button type="success" @click="$router.push('/')">点击返回待办事项</nut-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';
import { Button, Icon, Table } from '@nutui/nutui';


const router = useRouter();
const completedTodos = ref([]);

const columns = ref([
  {
    title: '事项',
    key: 'text'
  },
  {
    title: '完成时间',
    key: 'completedTime'
  },
  {
    title: '用时',
    key: 'calculateDuration',
    align: 'center',
    sorter: (row1, row2) => {
      return row1.calculateDuration - row2.calculateDuration
    }
  }
]);
const data = ref([]);

const fetchCompletedTodos = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  completedTodos.value = todos.filter(todo => todo.completed);
  // 更新 data
  data.value = completedTodos.value.map(todo => ({
    text: todo.text,
    completedTime: formatTime(todo.completedTime),
    calculateDuration: calculateDuration(todo.completedTime, todo.createdTime)
  }));
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 补零处理
  const day = date.getDate().toString().padStart(2, '0'); // 补零处理
  const hours = date.getHours().toString().padStart(2, '0'); // 补零处理
  const minutes = date.getMinutes().toString().padStart(2, '0'); // 补零处理

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const calculateDuration = (completedTime, createdTime) => {
  return Math.floor((completedTime - createdTime) / 60000); // 转换为分钟
};

const updateChart = () => {
  const chartDom = document.getElementById('chart');
  if (echarts.getInstanceByDom(chartDom)) {
    echarts.dispose(chartDom);
  }

  const chart = echarts.init(chartDom);
  const recentCompleted = completedTodos.value.slice(-8);
  const categories = recentCompleted.map((todo, index) => `${todo.text}`);
  console.log(categories);
  const durations = recentCompleted.map(todo => calculateDuration(todo.completedTime, todo.createdTime));

  chart.setOption({
    title: {
      text: '最近 8 个已完成待办用时',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 45 // 旋转 x 轴标签
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '用时',
        type: 'bar',
        data: durations,
        itemStyle: {
          color: '#42b983'
        }
      }
    ]
  });
};

onMounted(() => {
  fetchCompletedTodos();
  updateChart();
});
</script>

<style lang="scss" scoped>
.checkbox-button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.checkbox-button input[type="checkbox"] {
  display: none;
}

.checkbox-button.selected {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.completed-todos {

  .completed-list {
    margin-bottom: 20px;

    table {
      width: 100%;
    }

    .tbody {
      height: 200px;
      overflow-y: auto;
    }

    h2 {
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      padding: 0;
      max-height: 200px;
      overflow-y: auto;

      li {
        background: #f9f9f9;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          color: #42b983;
        }

        .todo-text {
          font-weight: bold;
          color: #333;
        }

        .completed-time {
          margin-left: 5px;
          color: #666;
        }

        .duration {
          margin-left: 5px;
          color: #ff0000;
        }
      }
    }
  }

  .chart {
    width: 100%;
    height: 45vh;
  }

  .nut-table {
    height: 35vh;
    overflow-y: auto;
  }


}
</style>

<template>
  <div id="home">
    <h1>待办事项</h1>
    <TodoInput :historyData="history" @add="handleAdd" ref="input"></TodoInput>
    <div class="todo-list">
      <TodoItem v-for="(todo, index) in todos" :key="index" :todo="todo" @delete="deleteTodo(index)" />
    </div>
    <div id="chart" style="width: 100%; height: 380px; "></div>
    <nut-button type="info" @click="$router.push('/completed')">点击查看待办完成情况</nut-button>
    <nut-popup v-model:visible="dialogVisible" position="center">
      <nut-date-picker v-model="selectedTime" type="datetime" :three-dimensional="false" @cancel="cancelAddTodo"
        @confirm="confirmAddTodo"></nut-date-picker>
    </nut-popup>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import TodoItem from '../components/todoItem';
import TodoInput from '../components/todoInput';
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
  name: 'App',
  components: {
    TodoItem,
    TodoInput,
  },
  setup() {
    const input = ref(null);
    const todos = ref([]);
    const dialogVisible = ref(false);
    const selectedTime = ref(new Date());
    const historyData = localStorage.getItem('historyData');
    const history = ref(historyData ? JSON.parse(historyData) : []);

    const handleAdd = (text) => {
      dialogVisible.value = true;
      console.log(history.value);
    };

    const confirmAddTodo = () => {
      if (selectedTime.value) {
        const dueTime = new Date(selectedTime.value).getTime();
        // new Date(2030, 3, 30).getTime();
        const now = new Date().getTime();
        const remainingTime = dueTime - now;
        console.log(remainingTime, '1111111');
        const newTodo = {
          text: input.value.newTodoText,
          completed: false,
          unfinished: false,
          createdTime: now,
          dueTime: dueTime,
          timer: setTimeout(() => {
            if (!newTodo.completed) {
              newTodo.unfinished = true;
              updateChart();
              saveTodos();
            }
          }, remainingTime)
        };

        todos.value.push(newTodo);
        const existingIndex = history.value.findIndex(item => item.text === input.value.newTodoText);
        if (existingIndex === -1) {
          history.value.unshift({ text:input.value.newTodoText, completed: false });
          if (history.value.length > 10) {
            history.value.pop();
          }
        }
        selectedTime.value = new Date();
        input.value.newTodoText = '';
        dialogVisible.value = false;
        saveTodos();
        updateChart();
      } else {
        ElMessage({
          message: '请选择有效时间',
          type: 'warning'
        });
      }
    };

    const cancelAddTodo = () => {
      const now = new Date().getTime();
      const dueTime = now + 7 * 24 * 60 * 60 * 1000; // 一周后的时间戳
      const remainingTime = dueTime - now;
      console.log(remainingTime, '1111111');
      const newTodo = {
        text: input.value.newTodoText,
        completed: false,
        unfinished: false,
        createdTime: now,
        dueTime: dueTime,
        timer: setTimeout(() => {
          if (!newTodo.completed) {
            newTodo.unfinished = false;
            updateChart();
            saveTodos();
          }
        }, remainingTime)
      };
      todos.value.push(newTodo);
      history.value.unshift({ text: input.value.newTodoText, completed: false }); // 将新待办添加到历史记录最前面
      if (history.value.length > 10) {
        history.value.pop(); // 如果超过10条历史数据，删除最后一条
      }
      selectedTime.value = new Date();
      input.value.newTodoText = '';
      dialogVisible.value = false;
      saveTodos();
      updateChart();
    };

    const deleteTodo = (index) => {
      clearTimeout(todos.value[index].timer);
      todos.value.splice(index, 1);
      saveTodos();
      updateChart();
    };

    const updateChart = () => {
      const completed = todos.value.filter(todo => todo.completed).length;
      const uncompleted = todos.value.filter(todo => !todo.completed && !todo.unfinished).length;
      const unfinished = todos.value.filter(todo => todo.unfinished).length;
      const chartDom = document.getElementById('chart');

      if (echarts.getInstanceByDom(chartDom)) {
        echarts.dispose(chartDom);
      }

      const chart = echarts.init(chartDom);
      chart.setOption({
        title: {
          text: '待办事项统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '待办事项',
            type: 'pie',
            radius: '50%',
            data: [
              { value: completed, name: '已完成', itemStyle: { color: '#42b983' } },
              { value: uncompleted, name: '未完成', itemStyle: { color: '#ffcc00' } },
              { value: unfinished, name: '超时', itemStyle: { color: '#ff0000' } }
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
      });
    };

    const saveTodos = () => {
      localStorage.setItem('todos', JSON.stringify(todos.value));
    };

    const loadTodos = () => {
      const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      savedTodos.forEach(todo => {
        const now = new Date().getTime();
        const remainingTime = todo.dueTime - now;
        if (remainingTime > 0 && !todo.completed) {
          todo.timer = setTimeout(() => {
            if (!todo.completed) {
              todo.unfinished = true;
              updateChart();
              saveTodos();
            }
          }, remainingTime);
        } else if (remainingTime <= 0 && !todo.completed) {
          todo.unfinished = true;
        }
      });
      todos.value = savedTodos;
    };

    onMounted(() => {
      loadTodos();
    });

    watch(todos, saveTodos, { deep: true });
    watch(todos, updateChart, { deep: true });

    return {
      input,
      todos,
      dialogVisible,
      selectedTime,
      confirmAddTodo,
      deleteTodo,
      history,
      handleAdd,
      cancelAddTodo
    };
  }
}
</script>
<style>
h1 {
  text-align: center;
  color: #333;
}

.input-group {
  display: flex;
  margin-bottom: 20px;
}

.input-group input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-group button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.input-group button:hover {
  background-color: #359a6d;
}

.todo-list {
  max-height: 260px;
  overflow: auto;
  list-style: none;
  padding: 0;
}

.dialog-footer {
  text-align: right;
}

.nut-popup {
  padding: 20px;
  border-radius: 10px;
}
</style>
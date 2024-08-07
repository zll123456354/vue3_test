<template>
  <div class="input-group">
    <input type="text" v-model="newTodoText" placeholder="添加新任务" @keyup.enter="addTodo" @focus="showHistory = true" @input="showHistory = false" />
    <button @click="addTodo">添加</button>
    <ul v-show="showHistory">
      <li v-for="(item, index) in history" :key="index" @click="selectHistory(item)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
  name: 'TodoInput',
  props: {
    historyData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add', 'select'],
  setup(props, { emit }) {
    const newTodoText = ref('');
    const showHistory = ref(false);
    const history = ref(null);

    onMounted(() => {
      const savedHistory = localStorage.getItem('historyData');
      if (savedHistory) {
        history.value = JSON.parse(savedHistory).slice(0, 10);
      }
    });

    watch(() => props.historyData, (newValue) => {
      console.log('Props historyData updated:', newValue);
      history.value = newValue.slice(0, 10); // 只取最近的10条数据
      localStorage.setItem('historyData', JSON.stringify(history.value));
    }, { deep: true });

    const addTodo = () => {
      if (newTodoText.value.trim() === '') {
        ElMessage({
          message: '请先输入待办事项内容',
          type: 'warning'
        });
        return
      }
      emit('add', newTodoText.value);
      showHistory.value = false;
    };

    const selectHistory = (item) => {
      console.log(item);
      newTodoText.value = item.text;
      emit('select', item);
      showHistory.value = false;
    };

    return {
      newTodoText,
      showHistory,
      history,
      addTodo,
      selectHistory
    };
  }
};
</script>

<style scoped >
.input-group {
  position: relative;
  display: inline-block;
}

ul {
  position: absolute;
  z-index: 10;
  top: 42px;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 8px;
  cursor: pointer;
  text-align: left;
}

li:hover {
  background-color: #f0f0f0;
}
</style>

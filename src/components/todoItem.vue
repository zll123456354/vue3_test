<template>
  <div class="todo-item" :class="{ completed: todo.completed, unfinished: todo.unfinished }">
    <input type="checkbox" v-model="todo.completed" @change="updateCompletedTime(todo)" />
    <span>{{ todo.text }}</span>
    <button @click="$emit('delete')">删除</button>
    <span v-if="todo.unfinished" class="timeout-label">超时</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const updateCompletedTime = (todo) => {
  if (todo.completed) {
    todo.completedTime = new Date().getTime();
  } else {
    todo.completedTime = null; // 如果取消选中，则清空完成时间
  }
};
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}
.todo-item.unfinished span {
  color: red;
}
.timeout-label {
  margin-left: 10px;
  color: red;
  font-weight: bold;
}
button {
  margin-left: auto;
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #ff7875;
}
</style>

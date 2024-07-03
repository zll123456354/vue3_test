import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../views/index.vue';
import CompletedTodo from '../views/done.vue';

const routes = [
  { path: '/', component: TodoList },
  { path: '/completed', component: CompletedTodo }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


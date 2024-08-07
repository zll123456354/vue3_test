import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../views/index.vue';
import CompletedTodo from '../views/done.vue';
import login from "../views/login.vue";
import { showNotify } from '@nutui/nutui'

const routes = [
  { path: '/', component: TodoList },
  { path: '/completed', component: CompletedTodo },
  { path: '/login', component: login }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 导航守卫
router.beforeEach((to, from, next) => {
  function getItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
  
    // 如果 `item` 不存在，则返回 `null`
    if (!itemStr) {
      return null;
    }
  
    const item = JSON.parse(itemStr);
    const now = new Date();
  
    // 检查数据是否过期
    if (now.getTime() > item.expiry) {
      // 如果数据过期，删除它并返回 `null`
      localStorage.removeItem(key);
      return null;
    }
  
    return item.value;
  }

  const isAuthenticated = getItemWithExpiry('info');
  if (to.path !== '/login' && !isAuthenticated) {
    showNotify.text('请先完成登录', {
      duration: 2000,
      onClose: () => {
        console.log('close')
      },
      onClick: () => {
        console.log('click')
      }
    })
    next('/login');
  } else {
    next();
  }
});

export default router;


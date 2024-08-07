<template>
  <div>
    <loginForm ref="loginFormRef" :login="login"/>
    <nut-space style="margin: 10px">
      <nut-button type="primary" size="small" @click="submit">登录</nut-button>
      <nut-button size="small" @click="reset">重置登录信息</nut-button>
    </nut-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import loginForm from '../components/loginForm.vue';
import { useRouter } from 'vue-router';
const loginFormRef = ref(null);
const router = useRouter();

const submit = () => {
  // console.log(loginFormRef.value);
  // loginFormRef.value?.validateForm();
  loginFormRef.value?.validateForm()
}

const reset = () => {
  loginFormRef.value?.reset();
}

const login = (value) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + 3600000,
  };
  localStorage.setItem('info',JSON.stringify(item))
  router.push({
    path:'/',
  } ); 
} 
</script>

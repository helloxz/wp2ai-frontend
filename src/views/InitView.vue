<template>
    <div class="login">
      <div class="loginForm">
        <h2 style="text-align: center;">初始化</h2>
        <label style="margin-top: 30px;font-size: 14px">邮箱</label>
        <el-input style="margin-top: 5px;" type="text" placeholder="请输入您的邮箱" v-model="userForm.email"/>
        <label style="margin-top: 10px;font-size: 14px">密码</label>
        <el-input show-password style="margin-top: 5px;" type="password" placeholder="设置登录密码"
                  v-model="userForm.password"/>
        <label style="margin-top: 10px;font-size: 14px">重复密码</label>
        <el-input @keyup.enter="init" show-password style="margin-top: 5px;" type="password" placeholder="重复登录密码"
                  v-model="userForm.repeat_password"/>
        
        <!-- 隐私协议 -->
        <!-- <div class="privacy">
          <el-checkbox v-model="privacy" label="true">我已阅读并同意<a href="/assets/privacy/privacy.html" target="_blank">隐私协议</a></el-checkbox>
        </div> -->
        <!-- 隐私协议END -->
        <div style="display: flex;gap: 15px;">
            <el-button style="width: 100%;" @click="init" type="primary">初始化</el-button>
        </div>
        
      </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import req from '@/utils/req';
import { ElMessage } from 'element-plus';

const router = useRouter()
const userForm = ref({
  email: '',
  password: '',
  repeat_password: ''
})

const init = () => {
  let formData = new FormData();
  formData.append('email', userForm.value.email);
  formData.append('password', userForm.value.password);

  // 判断用户输入的密码是否一致
  if (userForm.value.password !== userForm.value.repeat_password) {
    
    return ElMessage.error('两次输入的密码不一致');
  }

  // 继续请求后端
  req.post('/api/init', formData).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('初始化成功');
      // 2s后跳转
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      // router.push('/login');
    } else {
      ElMessage.error(res.data.msg);
    }
  })
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background: linear-gradient(to right, #e0f7fa, #80deea); */
  background: radial-gradient(circle, #E7DFFF, #F8F0FF); /* 从中心浅紫色向外辐射到更浅的颜色 */
}

.loginForm {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 380px;
}

.loginForm h2 {
  margin-bottom: 20px;
}

.loginForm label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.loginForm .el-input {
  width: 100%;
  margin-bottom: 15px;
}
</style>
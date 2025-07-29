<template>
    <div class="login">
      <div class="loginForm">
        <h2 style="text-align: center;">管理员登录</h2>
        <label style="margin-top: 30px;font-size: 14px">邮箱</label>
        <el-input style="margin-top: 5px;" type="text" placeholder="请输入您的邮箱" v-model="userForm.email"/>
        <label style="margin-top: 10px;font-size: 14px">密码</label>
        <el-input @keyup.enter="login" show-password style="margin-top: 5px;" type="password" placeholder="输入登录密码"
                  v-model="userForm.password"/>
        
        <!-- 隐私协议 -->
        <!-- <div class="privacy">
          <el-checkbox v-model="privacy" label="true">我已阅读并同意<a href="/assets/privacy/privacy.html" target="_blank">隐私协议</a></el-checkbox>
        </div> -->
        <!-- 隐私协议END -->
        <div style="display: flex;gap: 15px;">
            <el-button style="width: 100%;" @click="login" type="primary">登录</el-button>
        </div>
        
      </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import req,{toForm} from '@/utils/req';
import { useRouter } from 'vue-router';

const userForm = ref({
  email: '',
  password: ''
})

const router = useRouter()

// 登录函数
const login = ()=>{
    req.post("/api/login",toForm(userForm.value))
    .then(res=>{
        if( res.data.code == 200 ) {
            // 登录成功
            localStorage.setItem("token",res.data.data)
            // 临时写入邮箱
            sessionStorage.setItem("email",userForm.value.email)
            // localStorage.setItem("user",JSON.stringify(res.data.data.user))
            // 提示成功
            ElMessage.success("登录成功")
            // 1.5s后跳转
            setTimeout(()=>{
                router.push("/admin")
            },1500)
        }
        else {
            // 登录失败
            ElMessage.error(res.data.msg)
        }
    })
    .catch(err=>{
        console.log(err)
        // 提示错误
        ElMessage.error("发生错误")
    })
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle, #E7DFFF, #F8F0FF); /* 从中心浅紫色向外辐射到更浅的颜色 */
  /* background: linear-gradient(to right, #e0f7fa, #80deea); */
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
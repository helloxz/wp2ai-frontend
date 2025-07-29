<script setup>
import Chat from '@/components/Chat.vue'
import Footer from '@/components/Footer.vue';
import { ref } from 'vue'
</script>

<template>
  <div class="index">
    <Chat></Chat>
    <!-- <Footer /> -->
  </div>
</template>

<style scoped>
.index{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-color: #F2F3F5; */
  background: radial-gradient(circle, #E7DFFF, #F8F0FF); /* 从中心浅紫色向外辐射到更浅的颜色 */
}

/**手机访问 */
@media screen and (max-width: 768px) {
  .index{
    display: block; /* 重置 display */
    justify-content: initial; /* 重置 justify-content */
    align-items: initial; /* 重置 align-items */
    height: auto; /* 重置 height */
    padding:14px;
    background: #FFF;
  }
}
</style>
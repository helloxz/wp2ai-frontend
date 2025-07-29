<template>
    <div class="new-body">
        <div class="ai">
            <!-- 骨架屏占位 -->
            <div v-show="chatList.length <= 0">
                <el-skeleton>
                    <template #template>
                        <div class="ai-notice">
                            <div class="avatar">
                                <img :src="aiLogo" alt="">
                            </div>
                            <div class="msg">
                                WP2AI将为您服务
                                <p style="font-weight: 400;padding:0 12px 0 12px;">我已经学习并掌握 <a :href="siteStore.wp_domain" target="_blank">{{ siteStore.wp_domain }}</a> 所有内容，我可以回答与此站点相关的问题。</p>
                            </div>
                        </div>
                    </template>
                </el-skeleton>
            </div>
            <!-- 骨架屏占位END -->

            <!-- 对话列表 -->
            <div ref="listID" class="chat-list" v-if="chatList.length > 0">
                <!-- 遍历对话列表 -->
                <div v-for="(item, index) in chatList" :key="index">
                    <!-- 用户对话 -->
                    <div class="user" v-if="item.type === 'user'">
                        <!-- 用户头像 -->
                        <div class="avatar">
                            <img :src="userAvatar" alt="">
                        </div>
                        <!-- 用户头像END -->
                         
                        <!-- 用户输入内容 -->
                        <div class="msg">
                            {{ item.msg }}
                        </div>
                        <!-- 用户输入内容END -->
                    </div>
                    <!-- 用户对话END -->
                    <!-- AI对话 -->
                    <div class="onenav-ai" v-else>
                        <!-- 用户头像 -->
                        <div class="avatar">
                            <img :src="aiLogo" alt="">
                        </div>
                        <!-- 用户头像END -->
                         
                        <!-- 用户输入内容 -->
                        <div class="msg markdown-body" v-html="item.msg">

                        </div>
                        <!-- 用户输入内容END -->
                    </div>
                    <!-- AI对话END -->
                </div>
                <!-- 对话列表END -->
            </div>

            <!-- 输入框 -->
            <div class="input-box">
                <div class="input">
                    <el-input
                        @keydown="handleKeydown"
                        v-model="inputText"
                        style="width: 100%; resize: none;"
                        :rows="2"
                        type="textarea"
                        :autofocus="true"
                        :placeholder="featureLimit.placeholder"
                    />
                </div>
                <!-- 底部按钮 -->
                <div class="btns">
                    <!-- 左侧按钮 -->
                    <div class="left-btn">
                        <!-- <el-tooltip
                            effect="dark"
                            content="API设置"
                            placement="top"
                        >
                        <a href="javascript:;" @click="settingDialog = true"><el-icon><Setting /></el-icon></a>
                        </el-tooltip> -->

                        <el-tooltip
                            effect="dark"
                            content="目前仅支持单轮对话，每次提交都视为新问题!"
                            placement="top"
                        >
                            <a href="javascript:;" @click="privacyDialog = true"><el-icon><InfoFilled /></el-icon></a>
                        </el-tooltip>

                        <el-tooltip
                            effect="dark"
                            content="WP2AI项目地址"
                            placement="top"
                        >
                            <a href="https://github.com/helloxz/wp2ai"  target="_blank" rel="nofollow"><el-avatar :size="24" loading="lazy" :src="Github"></el-avatar></a>
                        </el-tooltip>
                        
                        
                    </div>
                    <!-- 左侧按钮END -->
                    <!-- 右侧按钮 -->
                    <div class="right-btn">
                        <div class="feature">
                            <!-- <el-radio-group @change="handleFeatureChange" v-model="feature">
                                <el-radio-button label="检索" value="search" />
                                <el-radio-button label="翻译" value="translation" />
                            </el-radio-group> -->
                        </div>
                        <el-button title="支持Ctrl + Enter或Command + Enter提交" :disabled="inputText == ''" :loading="isLoading" @click="handleSubmit" type="primary" :icon="Promotion" round />
                    </div>
                    <!-- 右侧按钮end -->
                </div>
                <!-- 底部按钮END -->
            </div>
            <!-- 输入框END -->
        </div>
    </div>

    
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { marked } from 'marked'
import "github-markdown-css/github-markdown-light.css"
import Github from '@/assets/github.svg'
import {
  Check,
  Delete,
  Edit,
  Message,
  InfoFilled,
  Setting,
  Promotion
} from '@element-plus/icons-vue'
import aiLogo from '@/assets/ai.svg'
import userAvatar from '@/assets/user.svg'
import { useSiteStore } from '@/stores/site'


const siteStore = useSiteStore()
const listID = ref(null)
// 新增变量
const isLoading = ref(false)
// 设置弹窗创通
const settingDialog = ref(false)
const privacyDialog = ref(false)
// 选择AI功能
const feature = ref('search')
// 功能限制
const featureLimit = ref({
    // 字数限制
    number: 120,
    placeholder: '在这里输入您的问题，我们将利用 AI 技术，在全站内容中搜索相关答案。您可以像平时提问一样，使用完整的句子或短语。'
})
// 选项改变式触发修改功能限制
const handleFeatureChange = () => {
    let val = feature.value
    if( val === 'search' ) {
        featureLimit.value.number = 120
        featureLimit.value.placeholder = '请输入关键词或描述以进行书签检索，支持Ctrl + Enter或Command + Enter提交'
    }else{
        featureLimit.value.number = 3000
        featureLimit.value.placeholder = '请输入需要翻译的内容，支持Ctrl + Enter或Command + Enter提交'
    }
}

const inputText = ref('')
// 对话列表
const chatList = ref([
    
])

// 自定义 renderer
const renderer = {
  // 自定义链接渲染方式
  link({href, title, text}) {
    return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
  }
};

// 使用自定义的 renderer
marked.use({ renderer });

// AI返回的结果
const aiResult = ref('')

// 滚动到最底部
const scrollToBottom = () => {
    if (listID.value) {
        listID.value.scrollTo({
        top: listID.value.scrollHeight,
        behavior: 'smooth',  // 平滑滚动
        });
    }
};
// 用户同意意思时，保存到浏览器存储
const agreePrivacy = () => {
    localStorage.setItem('ai_privacy', 'agree')
    privacyDialog.value = false
}

// 快捷键触发提交
const handleKeydown = (e) => {
    // 判断是否按下的是 Ctrl (Windows) 或 Command (Mac) 和 Enter 键
    if ((e.ctrlKey || event.metaKey) && e.key === "Enter") {
        // 提交查询
        handleSubmit()
    }
};

const handleSubmit = async () => {
    // 如果输入的关键词是空的
    if( inputText.value.trim() === '') {
        ElMessage.error('请输入关键词！')
        return false;
    }
    // 如果长度过短
    if( inputText.value.trim().length < 2) {
        ElMessage.error('关键词长度过短！')
        return false;
    }
    // 限制长度不超过120字符
    if( inputText.value.trim().length > featureLimit.value.number) {
        ElMessage.error('内容过长！')
        return false;
    }
    // 清空当前的aiResult
  aiResult.value = ''
  if (!inputText.value.trim()) return

  const userInput = inputText.value

  chatList.value.push({
    type: 'user',
    msg: userInput
  })

  inputText.value = ''

  const aiMessage = {
    type: 'ai',
    msg: '思索中...'
  }
  chatList.value.push(aiMessage)

  isLoading.value = true
  // 滚动到最底部
    scrollToBottom()

  try {
    let newJson = [{
        "type":"user",
        "msg":userInput
    }]
    // 去掉最后一个
    // newJson.pop()
    const response = await fetch(import.meta.env.VITE_API_URL + "/api/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJson),
    })

    // console.log(newJson)
    // return

    if (!response.body) {
        ElMessage.error('浏览器不支持！')
        // 关闭loading
        isLoading.value = false
        return false;
    }

    const reader = response.body.getReader()
    // 判断content-type是否为text/event-stream
    const contentType = response.headers.get('content-type')
    if (contentType.includes('application/json')) {
      // 打印返回的内容
        const { done, value } = await reader.read()
        const decoder = new TextDecoder('utf-8')
        const result = decoder.decode(value)
        // 转为json
        const data = JSON.parse(result)
        if( data.code === -1002 ) {
            let msg = '参数错误！'
            if( data.err_msg == 'Authorization failure!' ) {
                msg = '认证失败，请先登录！'
            }
            // 提示错误，追加到机器人答复
            chatList.value[chatList.value.length - 1].msg = msg
        }
        else if( data.code === -2000 ) {
            // 提示错误，追加到机器人答复
            chatList.value[chatList.value.length - 1].msg = data.msg;
        }else{
            // 判断data.msg是否存在
            if( data.msg ) {
                // 提示错误，追加到机器人答复
                chatList.value[chatList.value.length - 1].msg = data.msg;
            }else{
                // 提示错误，追加到机器人答复
                chatList.value[chatList.value.length - 1].msg = data.err_msg;
            }
        }
        // 关闭loading
        isLoading.value = false
        return false;
    }
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let lines = buffer.split('\n')
      buffer = lines.pop()
      var data = ''

      for (let line of lines) {
        // line = line.trim()
        // console.log('Received data chunk:', line)
        if (line.startsWith('data:')) {
          data = line.replace('data:', '')
          if (data === '[DONE]') {
            console.log(chatList);
            // console.log(aiResult.value)
            // chatList.value[chatList.value.length - 1].msg = marked.parse(aiResult.value)
            isLoading.value = false
            return
          }

          // 转为json
          try {
            let tmp = JSON.parse(data)
            data = tmp.v
          } catch (error) {
            console.log(error)
          }

          aiResult.value += data
          // result += data
          // 获取chatList最后一个元素，且type为ai
          chatList.value[chatList.value.length - 1].msg = marked.parse(aiResult.value)
          // chatList.value[chatList.value.length - 1].msg = aiResult.value
          scrollToBottom()
            
        //   console.log('Received data chunk:', result)
          // console.log('Received data chunk:', content)
          
          // enqueueChars(data, aiMessage)
        }
      }
    }

  } catch (error) {
    console.error('请求失败:', error)
    isLoading.value = false
  }
}

onMounted(() => {
    // siteStore.getSiteInfo()
})
</script>

<style scoped>
:deep(.el-avatar){
    --el-avatar-bg-color: transparent;
}
/**大于1000宽度的时候 */
@media screen and (min-width: 1000px) {
    .ai {
        position: absolute; /* 绝对定位，脱离常规文档流 */
        top: 80px; /* 距离父容器顶部 40px */
        bottom: 80px;
        
        border-radius: 14px;
        background-color: #FFFFFF;
        width: 790px;
        height:600px;
        z-index: 1;
        left: 50%;
        transform: translateX(-50%); /* 居中对齐 */
        padding: 16px;
    }
    
}

.markdown-body{
    word-break: break-all; /* 强制在任何字符间换行 */
}

:deep(.markdown-body blockquote){
    margin:0;
    padding: 0.8em 10px;
    background-color: #f0f0f0; /* 浅灰色 */
    border-left: 5px solid #ccc; /* 侧边栏颜色 */
    border-radius: 5px;
}



.chat-list{
    height: calc(600px - 140px);
    overflow-y: auto;
    padding: 12px;
}
.input-box{
    /**固定在父元素底部 */
    position: absolute;
    bottom: 12px;
    display: block;
    width: calc(100% - 32px); /* 考虑父元素的左右 padding 各 16px */
    height:120px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border:1px solid #ebeef5;
    border-radius: 14px;
}
.input-box .input{
    width:100%;
    display: block;
}
.input-box .btns{
    width:100%;
    display: flex;
    margin-top:12px;
    /* 两端对齐 */
    justify-content: space-between;
}
.btns .right-btn{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-right: 12px;
}
.feature{
    margin-right: 14px;
}
.left-btn{
    padding-left:12px;
    /* display: flex;
    align-items: center; */
}
.left-btn a{
    color:#303133;
    padding-right: 8px;
}
.left-btn a:hover{
    color:#606266;
}
.left-btn i{
    padding-top:6px;
}

.btns .left-btn{
    font-size:24px;
    font-weight: 600;
    padding-right: 12px;
}

/**去除输入框边框 */
:deep(.el-textarea__inner){
    border:none;
    box-shadow:none;
    resize: none !important; /* 禁止拖拽，隐藏右下角的线条 */
}
.ai-notice{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    height: calc(600px - 120px);
}
.ai-notice .avatar img{
    max-width: 60px;
    height: auto;
}
.ai-notice .avatar,.ai-notice .msg{
    width:100%;
    display: block;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}
.ai-notice .msg{
    padding-top:14px;
    color:#606266;
    font-size:16px;
    font-weight: 600;
    width: auto;
}

.chat-list .user,.chat-list .onenav-ai{
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items: flex-start;
    flex-direction: row;
    margin-top: 12px;
}

.user .msg{
    /**用户输入的背景色和AI的最好背景色不同 */
    background-color:#D1E4F9;
    padding: 12px;
    border-radius: 12px;
    color:#606266;
    font-size: 14px;
    font-weight: 400;
    /* max-width: 60%; */
    word-wrap: break-word;
}

.onenav-ai .msg{
    background-color: #F5F7FA;
    padding: 12px;
    border-radius: 12px;
    color:#606266;
    font-size: 14px;
    font-weight: 400;
    /* max-width: 60%; */
    word-wrap: break-word;
}

.avatar{
    width: 40px;
    padding-right: 14px;
}

.avatar img{
    max-width: 32px;
    height: auto;
    border-radius: 50%;
    border:1px solid #ebeef5;
    padding:4px;
}
.ai-notice .msg p{
    font-size:14px;
    color:#606266;
}
.ai-notice .msg a{
    font-size:14px;
    font-weight: 400;
    color:#F56C6C;
}

/**分辨率大于800，但是小于1000 */
@media screen and (min-width: 800px) and (max-width: 1000px) {
    .ai {
        top: 20px; /* 距离父容器顶部 40px */
        bottom: 20px;
        padding:16px;
        /**针对白色背景的情况下考虑添加边框或者阴影特效 */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        position: absolute; /* 绝对定位，脱离常规文档流 */
        
        border-radius: 14px;
        background-color: #FFFFFF;
        width: 790px;
        height:600px;
        z-index: 1;
        left: 50%;
        transform: translateX(-50%); /* 居中对齐 */
    }
    
}

/**分辨率小于768视为手机 */
@media screen and (max-width: 768px) {
    .ai {
        border-radius: 14px;
        background-color: #FFFFFF;
        /* width: calc(100% -28px); */
        /* border: 1px solid #ccc; */
        height: calc(100vh - 170px);
        /**边框阴影特效 */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .chat-list{
        height: calc(100vh - 200px);
        
    }
    .input-box{
        position: fixed;
        bottom: 18px;
        background-color: #FFFFFF;
    }
}

</style>
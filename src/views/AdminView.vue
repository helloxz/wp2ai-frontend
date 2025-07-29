<template>
    <div class="admin">
        <div class="common-layout">
            <el-container>
            <el-aside class="left">
                <!-- 标题或者logo部分 -->
                <div class="logo" @click="router.push('/')">
                    <h1>WP2AI</h1>
                </div>
                <!-- 标题或者logo部分END -->

                <!-- 菜单部分 -->
                <div class="menus">
                    <el-menu
                        :default-active="currentIndex"
                    >
                        <el-menu-item @click="router.push('/admin/posts')" index="posts">
                            <el-icon><Notebook /></el-icon>
                            <span>文章数据</span>
                        </el-menu-item>

                        <!-- <el-menu-item index="embedding">
                            <el-icon><Tickets /></el-icon>
                            <span>向量数据</span>
                        </el-menu-item> -->

                        

                        <el-menu-item @click="router.push('/admin/setting')" index="setting">
                            <el-icon><setting /></el-icon>
                            <span>参数设置</span>
                        </el-menu-item>

                        <el-menu-item @click="router.push('/admin/chat')" index="chat">
                            <el-icon><Search /></el-icon>
                            <span>AI检索</span>
                        </el-menu-item>

                        <el-menu-item @click="router.push('/admin/about')" index="about">
                            <el-icon><User /></el-icon>
                            <span>关于我们</span>
                        </el-menu-item>

                    </el-menu>
                </div>
                <!-- 菜单部分END -->

                <!-- 版本部分 -->
                <div class="version">
                    <el-text class="mx-1" type="info">Beta {{ version }}</el-text>
                </div>
                <!-- 版本部分END -->
            </el-aside>
            <el-container>
                <el-header>
                    <div class="header">
                        <div class="l-header">
                            <!-- 显示Github -->
                            <div class="github">
                                <a title="WP2AI项目地址" href="https://github.com/helloxz/wp2ai" target="_blank" rel="nofollow">
                                    <el-avatar :size="36" loading="lazy" :src="Github"></el-avatar>
                                </a>
                            </div>
                            <!-- 显示Github END -->
                        </div>
                        <div class="r-header">
                            
                            <!-- 显示邮箱 -->
                            <el-text class="mx-1 email">{{ siteStore.email }}</el-text>
                            <!-- 显示邮箱END -->
                            <!-- 头像部分 -->
                            <div class="avatar" style="cursor: pointer;">
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        <el-avatar :size="36" loading="lazy" :src="avatar"></el-avatar>
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="logout">退出</el-dropdown-item>
                                        
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                            <!-- 头像部分END -->
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <!-- 内容主体区域 -->
                    <div class="content">
                        <component :is="currentTab"></component>
                    </div>
                    <!-- 内容主体区域END -->
                </el-main>
                <el-footer>
                    <div class="footer">
                        Copyright Ⓒ 2025.Powered by <a target="_blank" href="https://github.com/helloxz/wp2ai">WP2AI</a>
                    </div>
                </el-footer>
            </el-container>
            </el-container>
        </div>
    </div>
</template>

<script setup>
import {
    Setting,
    Tickets,
    Notebook,
    Search,
    User
} from '@element-plus/icons-vue'
import { ref,onMounted,shallowRef } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import Chat from '@/components/Chat.vue';
import posts from '@/components/admin/posts.vue';
import settingCom from '@/components/admin/setting.vue';
import about from '@/components/admin/about.vue';
import { useSiteStore } from '@/stores/site';
import md5 from 'md5';
import Github from '@/assets/github.svg'
import { ElMessage } from 'element-plus';
import req from '@/utils/req';

const currentIndex = ref("posts")
// 根据路由获取的名称来改变组件
const route = useRoute()
const router = useRouter()
const currentTab = shallowRef(posts) // 使用 ref 来保持响应式
const siteStore = useSiteStore()
// 系统版本
const version = ref("")
// 头像地址
const avatar = ref("")

const changeTab = ()=>{
    let name = route.params.name
    // console.log(name)
    switch(name){
        case 'chat':
            currentTab.value = Chat
            break
        case 'posts':
            currentTab.value = posts
            break
        case 'setting':
            currentTab.value = settingCom
            break
        case 'about':
            currentTab.value = about
            break
        default:
            currentTab.value = posts
    }
    currentIndex.value = name
    // console.log(currentTab.value)
}

// 退出登录
const logout = ()=>{
    // 弹出提示
    ElMessage.success("您已退出！")
    // 2s后执行
    setTimeout(()=>{
        localStorage.removeItem("token")
        sessionStorage.removeItem("app_info")
        router.push("/login")
    },2000)
}

// 检测用户是否登录
const isLogin = ()=>{
    req.get("/api/user/is_login")
    .then(res=>{
        if( res.data.code == 200) {
            return;
        }
        else{
            // 提示错误
            ElMessage.error(res.data.msg)
            router.push("/login")
        }
    })
}

onMounted(()=>{
    isLogin()
    changeTab()
    siteStore.getAppInfo()
    .then(res=>{
        version.value = siteStore.app_info["version"]
        avatar.value = 'https://gravatar.loli.net/avatar/' + md5(siteStore.app_info["email"])
    })
})

// 监听路由变化
router.afterEach((to, from) => {
    changeTab()
})

const email = ref(sessionStorage.getItem("email"))
</script>

<style scoped>
.github{
    margin-right: 26px;
    margin-left:12px;
}
.left{
    width: 200px;
    background: radial-gradient(circle, #E7DFFF, #F8F0FF); /* 从中心浅紫色向外辐射到更浅的颜色 */
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: sticky;
    top: 0; /* 或者其他你希望的顶部偏移量 */
    /* border-right: #E7DFFF; */
}
.version{
    height:40px;
    text-align: center;
}
.menus{
    height: calc(100% - 98px);
}
.header{
    /* background-color: #7C3AED; */
    height: 58px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    
    /* border-bottom: 1px solid #EBEEF5; */
    background: radial-gradient(circle, #E7DFFF, #F8F0FF); /* 从中心浅紫色向外辐射到更浅的颜色 */
}

.content{
    width:calc(100% - 100px);
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    /* background-color: #7C3AED; */
}

.r-header{
    display: flex;
    align-items: center;
}
.email{
    margin-right: 16px;
}
.avatar{
    margin-right: 12px;
}

.logo{
    display: flex;
    flex-wrap: nowrap;
    height: 58px;
    justify-content: center;
    align-items: center;
    background-color: #7C3AED;
}
.logo h1 {
    cursor: pointer;
    font-size: 24px;
    color: white; /* 或者 #f0f0f0 等浅色 */
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); /* 添加阴影增加立体感 */
}
.footer{
    text-align: center;
    font-size: 14px;
    color:#606266;
}

:deep(.el-menu){
    border-right: 0;
    background: none;
}

:deep(.el-avatar){
    --el-avatar-bg-color: transparent;
}
:deep(.el-header){
    position: sticky;
    z-index:99;
    top: 0; /* 或者其他你希望的顶部偏移量 */
}

:deep(.menus li){
    margin: 5px 8px 5px 8px;
    border-radius: 8px;
}
:deep(.menus li:hover){
    background-color: #DBCCFD;
    color:rgb(124, 58, 237);
}
:deep(.el-menu-item.is-active){
    color:rgb(124, 58, 237);
    background-color: #DBCCFD;
}

:deep(.el-header){
    padding:0;
}

:deep(.el-menu-item){
    height: 40px;
}

</style>
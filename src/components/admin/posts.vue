<template>
    <div class="posts">
        <Notice>
            <ul>
                <li>如果扫描失败，通常是由于数据库信息不正确导致，请在【参数设置 - WordPress】检查数据库信息并重新保存！</li>
                <li>如果您更换了向量模型，需要清空数据并重新扫描，否则无法正确检索</li>
                <li>每分钟大约可扫描15篇文章</li>
            </ul>
        </Notice>
        <!-- 按钮部分 -->
        <div class="btns">
            <el-button type="primary" @click="batchScanVisible = true">批量扫描</el-button>
            <el-button type="primary" @click="addPost">添加数据</el-button>
            <el-button type="danger" @click="confirmCleanData">清空数据</el-button>
        </div>
        <!-- 按钮部分END -->

        <el-divider />
        <!-- 表格 -->
        <el-table :data="postsData" style="width: 100%;margin-top:1em;">
            <el-table-column fixed prop="post_id" label="文章ID" width="100">
                <template #default="{row}">
                    <span><a style="text-decoration: none;color:#F56C6C;" :href="siteStore.wp_domain + '?p=' + row.post_id" target="_blank">{{row.post_id}}</a></span>
                </template>
            </el-table-column>
            <el-table-column prop="post_title" label="标题" width="450">
                <template #default="{row}">
                    <span :title="row.post_title" class="post_title">{{row.post_title}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="post_date" label="发布时间"  width="180">
                <template #default="{row}">
                    <span>{{siteStore.formatDateTime(row.post_date)}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="post_date" label="最近操作"  width="180">
                <template #default="{row}">
                    <span>{{siteStore.formatDateTime(row.updated_at)}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="120">
                <template #default="{row}">
                    <!-- 默认0：未处理，1：处理中，2：待更新，3：已处理,4:存在错误 -->
                    <el-tag v-if="row.status == 0" type="info">未处理</el-tag>
                    <el-tag v-if="row.status == 1" type="warning">处理中</el-tag>
                    <el-tag v-if="row.status == 2" type="success">待更新</el-tag>
                    <el-tag v-if="row.status == 3" type="success">已处理</el-tag>
                    <el-tag v-if="row.status == 4" type="danger">存在错误</el-tag>
                </template>
            </el-table-column>
           
            <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
                <el-popconfirm @confirm="deletePost(scope)" title="确认删除？">
                    <template #reference>
                        <el-button link type="danger" size="small">删除</el-button>
                    </template>
                </el-popconfirm>
                
            </template>
            </el-table-column>
        </el-table>
        <!-- 表格END -->

        <!-- 分页 -->
        <div class="page">
            <el-pagination @change="getPosts" v-model:current-page="pageInfo.currentPage" background layout="prev, pager, next" :total="pageInfo.total" />
        </div>
        <!-- 分页END -->
    </div>

    <!-- 批量扫描对话框 -->
    <el-dialog v-model="batchScanVisible" title="确认批量扫描？" width="520">
        <div style="font-size:13px;">
            <!-- <p><b>批量扫描会进行以下几个步骤，请确认！</b></p> -->
            <ol>
                <li>在开始之前请确保您已经在【参数设置】中正确设置WordPress数据库信息</li>
                <li>批量扫描会将WordPress已发布文章导入到WP2AI</li>
                <li>导入到WP2AI的文章会进行数据向量化，方便后续语义匹配</li>
                <li>任务提交后系统会自动处理，但是需要一些时间，您可以在当前页面查看状态</li>
            </ol>
        </div>
        <div class="dialog-btns">
            <el-button type="primary" @click="batchScan">确认扫描</el-button>
            <el-button type="info" @click="batchScanVisible = false">取消</el-button>
        </div>
    </el-dialog>
    <!-- 批量扫描对话框END -->
</template>

<script setup>
import {ref,onMounted} from 'vue'
import req, { toForm } from '@/utils/req'
import { useSiteStore } from '@/stores/site';
import { ElMessage } from 'element-plus';
import Notice from '../notice.vue';

const siteStore = useSiteStore()

const batchScanVisible = ref(false)

const postsData = ref([])

// 分页信息
const pageInfo = ref({
    total:0,// 总跳数
    pageSize:10,// 每页显示的条数
    currentPage:1,// 当前页
})

// 删除单篇文章
const deletePost = (index)=>{
    // console.log(index)
    let id = index.row.post_id
    let url = "/api/delete/post"
    req.post(url,toForm({id:id}))
    .then(res=>{
        if(res.data.code == 200){
            ElMessage.success(res.data.msg)
            postsData.value.splice(index.$index, 1)
        }
        else{
            ElMessage.error(res.data.msg)
        }
    })
    .catch(err=>{
        console.log(err)
        ElMessage.error("删除失败！")
    })
}



// 获取文章列表
const getPosts = ()=>{
    req.get("/api/post/list?page="+pageInfo.value.currentPage+"&limit="+pageInfo.value.pageSize)
    .then(res=>{
        if( res.data.code == 200 ) {
            postsData.value = res.data.data.posts
            pageInfo.value.total = res.data.data.count
        }
    })
}

// 提交批量扫描
const batchScan = ()=>{
    let url = "/api/batch-scan"

    var loading
    // 避免阻塞
    setTimeout(()=>{
        // 加载loading
        loading = ElLoading.service({
            lock: true,
            fullscreen:true,
        })
    },50)

    req.get(url)
    .then(res=>{
        
        // 如果成功
        if( res.data.code == 200 ) {
            // 提示成功
            ElMessage.success(res.data.msg)
            // 重新获取数据
            getPosts()
        }
        else {
            // 提示失败
            ElMessage.error(res.data.msg)
        }
    })
    .catch(err=>{
        // 提示错误
        ElMessage.error("发生错误")
    })
    .finally(()=>{
        // 关闭loading
        loading.close()
        batchScanVisible.value = false
    })
}

// 清空数据
const confirmCleanData = ()=>{
    ElMessageBox.confirm('此操作将清空所有数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 清空数据
        req.post("/api/delete/all")
        .then(res=>{
            if( res.data.code == 200 ) {
                // 提示成功
                ElMessage.success(res.data.msg)
                // 重新获取文章列表
                getPosts()
            }
            else {
                // 提示失败
                ElMessage.error(res.data.msg)
            }
        })
    }).catch((err) => {
        // ElMessage.error("操作失败！")
        // 提示取消
        // console.log(err)
    });
}

// 添加文章ID
const addPost = ()=>{
    ElMessageBox.prompt('请输入WordPress文章ID', '提示', {
        confirmButtonText: '添加',
        cancelButtonText: '取消',
        inputPattern:
        /^[0-9]+/,
        inputErrorMessage: '只能是数字',
    })
    .then(({ value }) => {
      req.post("/api/add/post",toForm({id:value}))
      .then(res=>{
        if(res.data.code == 200){
            ElMessage.success(res.data.msg)
            getPosts()
        }
        else{
            ElMessage.error(res.data.msg)
        }
      })
      .catch(err=>{
        console.log(err)
      })
    })
    .catch(() => {
      // 用户取消
    })
}

onMounted(()=>{
    getPosts()
})
</script>

<style scoped>
.btns{
    margin-top:1em;
}
.dialog-btns{
    display: flex;
    justify-content: center;
    margin-top:1.5em;
}
.post_title{
    /**超出省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 350px;
}


.page{
    margin-top:1em;
}
</style>
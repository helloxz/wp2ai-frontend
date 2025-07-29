<template>
    <div class="setting">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="WordPress" name="wp">
                <Notice>
                    <ul>
                        <li>如果您将WP2AI和WordPress安装在同一服务器，并使用HOST网络，数据库地址一般为 <code>localhost</code> 或 <code>127.0.0.1</code> </li>
                        <li>如果WP2AI与WordPress不在同一服务器，数据库需要开启远程访问，并填写公网IP</li>
                        <li>数据库端口默认使用 <code>3306</code> 暂不支持自定义端口</li>
                        <li>如果文章扫描失败，通常是数据库信息填写不正确导致</li>
                    </ul>
                </Notice>
                <el-form style="margin-top:1em;" ref="wpRuleRef" :rules="wp_rules" :model="formData" label-position="top">
                    <el-form-item label="数据库地址" prop="wordpress.db_host">
                        <el-input placeholder="如果WP2AI和WordPress在同一服务器，一般填写localhost或127.0.0.1" v-model="formData['wordpress.db_host']"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库用户名" prop="wordpress.db_username">
                        <el-input placeholder="WordPress数据库用户名" v-model="formData['wordpress.db_username']"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库密码" prop="wordpress.db_password">
                        <el-input type="password" :show-password="true" placeholder="WordPress数据库密码" v-model="formData['wordpress.db_password']"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库名称" prop="wordpress.db_name">
                        <el-input placeholder="WordPress数据库名称" v-model="formData['wordpress.db_name']"></el-input>
                    </el-form-item>

                    <el-form-item label="网站域名" prop="wordpress.domain">
                        <el-input placeholder="如https://blog.xiaoz.org 末尾不需要/" v-model="formData['wordpress.domain']"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="setWP" type="primary">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="向量模型" name="second">
                <Notice>
                    <p>向量模型API需要兼容OpenAI格式，API地址需要填写完整，目前测试过的向量模型如下：</p>
                    <ul>
                        <li><a href="https://cloud.siliconflow.cn/i/pIKsMvx3">硅基流动</a>： <code>https://api.siliconflow.cn/v1/embeddings</code></li>
                        <li><a href="https://www.volcengine.com/experience/ark?utm_term=202502dsinvite&ac=DSASUQY5&rc=AHP75U54">火山引擎</a>： <code>https://ark.cn-beijing.volces.com/api/v3/embeddings</code></li>
                    </ul>
                    <p><b>一旦更换模型名称，需要清空所有文章数据并重新扫描，请谨慎操作！</b></p>
                </Notice>
                <el-form style="margin-top:1em;" ref="ebRuleRef" :rules="emRules" :model="formData" label-position="top">
                    <el-form-item label="向量模型API地址" prop="embedding.url">
                        <el-input placeholder="https://api.siliconflow.cn/v1/embeddings" v-model="formData['embedding.url']"></el-input>
                    </el-form-item>
                    <el-form-item label="向量模型Key" prop="embedding.key">
                        <el-input :show-password="true" v-model="formData['embedding.key']"></el-input>
                    </el-form-item>
                    <el-form-item label="向量模型名称" prop="embedding.model">
                        <el-input v-model="formData['embedding.model']"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="setEmbedding" type="primary">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="AI模型" name="third">
                <Notice>
                    <p>AI模型的API接口需兼容OpenAI格式，且API地址无需包含末尾的<code>/chat/completions</code>。目前市面上大多数API均兼容OpenAI格式，比如：</p>
                    <ul>
                        <li><a href="https://cloud.siliconflow.cn/i/pIKsMvx3">硅基流动</a>： <code>https://api.siliconflow.cn/v1</code></li>
                        <li><a href="https://www.volcengine.com/experience/ark?utm_term=202502dsinvite&ac=DSASUQY5&rc=AHP75U54">火山引擎</a>： <code>https://ark.cn-beijing.volces.com/api/v3</code></li>
                        <li><a href="https://api-docs.deepseek.com/zh-cn/">DeepSeek</a>： <code>https://api.deepseek.com/v1</code></li>
                    </ul>
                </Notice>
                <el-form style="margin-top:1em;" ref="aiRuleRef" :rules="aiRules" :model="formData" label-position="top">
                    <el-form-item label="API地址" prop="openai.url">
                        <el-input placeholder="https://api.siliconflow.cn/v1" v-model="formData['openai.url']"></el-input>
                    </el-form-item>
                    <el-form-item label="API密钥" prop="openai.key">
                        <el-input :show-password="true" v-model="formData['openai.key']"></el-input>
                    </el-form-item>
                    <el-form-item label="模型名称" prop="openai.model">
                        <el-input v-model="formData['openai.model']"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="setAI" type="primary">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="系统设置">
                <el-form ref="sysRulesRef" :rules="sysRules" :model="formData" label-position="top">
                    <el-form-item prop="app.doc_limit" label="每次对话查找的文档数量（数值越大越精准，但消耗的tokens越多）">
                        <el-input v-model="formData['app.doc_limit']"></el-input>
                    </el-form-item>

                    <el-form-item prop="app.chat_limit" label="访客每日对话次数">
                        <el-input v-model="formData['app.chat_limit']"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button @click="setSys" type="primary">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import {ref,onMounted,reactive} from 'vue'
import req from '@/utils/req';
import { useSiteStore } from '@/stores/site';
import Notice from '../notice.vue';

const siteStore = useSiteStore()
const activeName = ref('wp')

// 表单属性
const wpRuleRef = ref(null);
const ebRuleRef = ref(null);
const aiRuleRef = ref(null);
const sysRulesRef = ref(null)

// 表单数据
const formData = ref({
    "app.doc_limit": "5",
    "app.chat_limit": "5",
    "wordpress.domain": "",
    "embedding.key": "",
    "embedding.model": "",
    "embedding.url": "",
    "openai.key": "",
    "openai.model": "grok-2",
    "openai.url": "",
    "wordpress.db_name": "",
    "wordpress.db_password": "",
    "wordpress.db_username": "",
    "wordpress.db_host": "",
    "version":""
})

// 校验规则
const wp_rules = reactive({
    "wordpress.db_host": [
        { required: true, message: '请输入数据库连接地址', trigger: 'blur' },
        { min: 3, max: 32, message: '长度不正确', trigger: 'blur' },
    ],
    "wordpress.db_username": [
        { required: true, message: '请输入数据库用户名', trigger: 'blur' },
        // 只能是字母、数字、下划线或中横线
        { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能是字母、数字、下划线或中横线', trigger: 'blur' },
    ],
    "wordpress.db_password": [
        { required: true, message: '请输入数据库密码', trigger: 'blur' },
        // 只能是字母、数字、下划线或中横线
        { pattern: /^[a-zA-Z0-9!@#$%^&\*()_-]+$/, message: '密码不符合要求', trigger: 'blur' },
    ],
    "wordpress.db_name": [
        { required: true, message: '请输入数据库名称', trigger: 'blur' },
        // 只能是字母、数字、下划线或中横线
        { pattern: /^[a-zA-Z0-9_-]+$/, message: '名称不符合规范', trigger: 'blur' },
    ],
    "wordpress.domain":[
        { required: true, message: '请输入网站域名', trigger: 'blur' },
        { pattern: /^(http:\/\/|https:\/\/)[a-zA-Z0-9.\-_]+[a-zA-Z0-9.\-_]*[^/]$/, message: '域名不符合规范', trigger: 'blur' },
    ],
  
});

const emRules = reactive({
    "embedding.url":[
        { required: true, message: '请输入API地址', trigger: 'blur' },
        { pattern: /^(http:\/\/|https:\/\/).+/, message: 'API地址不符合规范', trigger: 'blur' },
    ],
    "embedding.key":[
        { required: true, message: '请输入密钥', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9-\/_]+$/, message: '密钥不符合规范', trigger: 'blur' },
    ],
    "embedding.model":[
        { required: true, message: '请输入模型名称', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9-\/_\.]+$/, message: '模型名称不符合规范', trigger: 'blur' },
    ]
})

const aiRules = reactive({
    "openai.url":[
        { required: true, message: '请输入API地址', trigger: 'blur' },
        { pattern: /^(http:\/\/|https:\/\/).+/, message: 'API地址不符合规范', trigger: 'blur' },
    ],
    "openai.key":[
        { required: true, message: '请输入密钥', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9-\/_]+$/, message: '密钥不符合规范', trigger: 'blur' },
    ],
    "openai.model":[
        { required: true, message: '请输入模型名称', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9-\/_\.]+$/, message: '模型名称不符合规范', trigger: 'blur' },
    ]
})

const sysRules = reactive({
    "app.doc_limit":[
        { required: true, message: '请输入文档数量', trigger: 'blur' },
        { pattern: /^([1-9]|10)$/, message: '只能在1-10之间', trigger: 'blur' },
    ],
    "app.chat_limit":[
        { required: true, message: '请输入对话次数', trigger: 'blur' },
        { pattern: /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/, message: '只能在1-999之间', trigger: 'blur' },
    ]
})

// 设置wp
const setWP = ()=>{
    if (!wpRuleRef.value) return;
    // 验证没通过
    wpRuleRef.value.validate((valid) => {
        if (valid) {
            // 验证通过
            // 获取表单数据
            const formStr = {
                "wordpress.db_host": formData.value['wordpress.db_host'],
                "wordpress.db_username": formData.value['wordpress.db_username'],
                "wordpress.db_password": formData.value['wordpress.db_password'],
                "wordpress.db_name": formData.value['wordpress.db_name'],
                "wordpress.domain": formData.value['wordpress.domain'],
            }
            // 转为字符串
            const dataStr = JSON.stringify(formStr)
            // 发送请求
            req.post("/api/set/config",dataStr,{
                headers:{'Content-Type':'application/json'}
            })
            .then(res=>{
                if( res.data.code == 200 ) {
                    siteStore.wp_domain = formData.value['wordpress.domain']
                    // 提示成功
                    ElMessage.success("配置已保存")
                    // 清空缓存
                    // siteStore.app_info = {}
                    sessionStorage.removeItem("app_info")
                }
                else{
                    // 提示错误
                    ElMessage.error(res.data.msg)
                }
            })
            .catch(err=>{
                // 提示错误
                ElMessage.error("发生错误")
            })
        } else {
            return false;
        }
    });
}

// 设置向量模型
const setEmbedding = ()=>{
    if (!ebRuleRef.value) return;
    // 验证没通过
    ebRuleRef.value.validate((valid) => {
        if (valid) {
            // 验证通过
            // 获取表单数据
            const formStr = {
                "embedding.url": formData.value['embedding.url'],
                "embedding.key": formData.value['embedding.key'],
                "embedding.model": formData.value['embedding.model'],
            }
            // 转为字符串
            const dataStr = JSON.stringify(formStr)
            // 发送请求
            req.post("/api/set/config",dataStr,{
                headers:{'Content-Type':'application/json'}
            })
            .then(res=>{
                if( res.data.code == 200 ) {
                    // 提示成功
                    ElMessage.success("配置已保存")
                    // 清空缓存
                    sessionStorage.removeItem("app_info")
                }
                else{
                    // 提示错误
                    ElMessage.error(res.data.msg)
                }
            })
            .catch(err=>{
                // 提示错误
                ElMessage.error("发生错误")
            })
        } else {
            return false;
        }
    });
}

// 设置AI
const setAI = ()=>{
    if (!aiRuleRef.value) return;
    // 验证没通过
    aiRuleRef.value.validate((valid) => {
        if (valid) {
            // 验证通过
            // 获取表单数据
            const formStr = {
                "openai.url": formData.value['openai.url'],
                "openai.key": formData.value['openai.key'],
                "openai.model": formData.value['openai.model'],
            }
            // 转为字符串
            const dataStr = JSON.stringify(formStr)
            // 发送请求
            req.post("/api/set/config",dataStr,{
                headers:{'Content-Type':'application/json'}
            })
            .then(res=>{
                if( res.data.code == 200 ) {
                    // 提示成功
                    ElMessage.success("配置已保存")
                    // 清空缓存
                    sessionStorage.removeItem("app_info")
                }
                else{
                    // 提示错误
                    ElMessage.error(res.data.msg)
                }
            })
            .catch(err=>{
                // 提示错误
                ElMessage.error("发生错误")
            })
        } else {
            return false;
        }
    });
}

// 设置系统参数
const setSys = ()=>{
    if (!sysRulesRef.value) return;
    // 验证没通过
    sysRulesRef.value.validate((valid) => {
        if (valid) {
            // 验证通过
            // 获取表单数据
            const formStr = {
                "app.doc_limit": formData.value['app.doc_limit'],
                "app.chat_limit": formData.value['app.chat_limit'],
            }
            // 转为字符串
            const dataStr = JSON.stringify(formStr)
            // 发送请求
            req.post("/api/set/config",dataStr,{
                headers:{'Content-Type':'application/json'}
            })
            .then(res=>{
                if( res.data.code == 200 ) {
                    // 提示成功
                    ElMessage.success("配置已保存")
                    // 清空缓存
                    sessionStorage.removeItem("app_info")
                }
                else{
                    // 提示错误
                    ElMessage.error(res.data.msg)
                }
            })
            .catch(err=>{
                // 提示错误
                ElMessage.error("发生错误")
            })
        } else {
            return false;
        }
    });
}

// 获取配置信息
const getSetting = ()=>{
    siteStore.getAppInfo()
    .then(res=>{
        formData.value = siteStore.app_info
    })
}

onMounted (()=>{
    getSetting()
})
</script>

<style scoped>
.setting{
    width: 600px;
    
}
</style>
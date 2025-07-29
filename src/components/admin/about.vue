<template>
    <div class="about">
        <div class="content">
            <div class="markdown-body" v-html="htmlContent"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import req from '@/utils/req'
import { marked } from 'marked'


// 自定义 renderer
const renderer = {
  // 自定义链接渲染方式
  link({href, title, text}) {
    return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
  }
};

// 使用自定义的 renderer
marked.use({ renderer });

const htmlContent = ref('')

// 解析内容
const parseContent = () => {
    let content = `
## 关于WP2AI
WP2AI可以将您的WordPress文章变成智能知识库，并通过AI智能匹配和解读，使其更准确的回答问题。

### 核心功能与优势
* **全站内容深度分析：** WP2AI 会深入分析您 WordPress 网站的每一篇文章，理解其内容含义，而非仅仅依赖关键词匹配。
* **语义搜索，快速找到答案：** 用户可以用更自然的方式提问，WP2AI 能理解他们的真实意图，快速找到相关内容。
* **AI 辅助，智能呈现：** WP2AI 不仅能找到文章，还能结合 AI 技术，以更清晰、更易懂的方式呈现搜索结果。
* **私有部署，数据安全可控：** WP2AI 可以部署在您自己的服务器上，确保您的数据安全和隐私。
* **提升搜索体验，增强用户粘性：** WP2AI 为您的网站带来更流畅、更智能的搜索体验，让用户更容易找到所需信息，从而提升用户满意度和网站互动性。


### 适用场景

* 需要提升站内搜索效率的博客网站
* 拥有大量专业知识内容的在线平台
* 希望为用户提供更优质搜索服务的企业网站

### 其他产品

如果您有兴趣，还可以了解我们的其他产品。

* [OneNav](https://www.onenav.top/) - 高效的浏览器书签管理工具，将您的书签集中式管理。
* [Zdir](https://www.zdir.pro/zh/) - 一款轻量级、多功能的文件分享程序。
* [ImgURL](https://www.imgurl.org/) - 2017年上线的免费图床。

### 联系我们

QQ交流群：\`964597848\`

![ba55b32730f40f20.jpg](https://img.rss.ink/imgs/2025/02/28/ba55b32730f40f20.jpg)

微信交流群

![a2d8db876cf58e15.jpg](https://img.rss.ink/imgs/2025/03/03/a2d8db876cf58e15.jpg)

`;
    htmlContent.value = marked.parse(content);
}

onMounted(() => {
    parseContent()
})
</script>

<style scoped>
.products img{
    border-radius: 3px;
    width: auto;
    max-height: 130px;
    object-fit: cover;
}
.content{
    max-width: 800px;
    display: flex;
    justify-content: center;
}
.mardown-body{
    font-size:14px;
}
</style>
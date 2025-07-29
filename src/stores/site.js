import { defineStore } from "pinia";
import req from "@/utils/req";

export const useSiteStore = defineStore('site',{
    state:()=>({
        app_info:{},
        email:"",
        wp_domain:"",
    }),
    actions:{
        formatDateTime(dateTimeString) {
            if (!dateTimeString) {
              return '';
            }
            // 创建 Date 对象
            const date = new Date(dateTimeString);
          
            // 获取年份、月份、日期、小时和分钟
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1，并补零
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
          
            // 返回格式化后的字符串
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        async getAppInfo(){
            // 通过session获取app_info
            let app_info = sessionStorage.getItem("app_info");
            // 如果获取到了
            if( app_info ){
                this.app_info = JSON.parse(app_info);
                this.email = this.app_info.email;
                // this.wp_domain = this.app_info["wordpress.domain"];
                return;
            }
            // 没获取到
            await req.get("/api/get/appinfo").then((res)=>{
                if( res.data.code == 200 ){
                    this.app_info = res.data.data;
                    this.email = this.app_info.email;
                    // this.wp_domain = this.app_info["wordpress.domain"];
                    // 写入session中存储
                    sessionStorage.setItem("app_info",JSON.stringify(res.data.data));
                }
                else{
                    console.log(res.data.msg);
                }
            })
        },
        async getSiteInfo(){
            await req.get("/api/get/siteinfo").then((res)=>{
                if( res.data.code == 200 ){
                    this.wp_domain = res.data.data["wp_domain"];
                }
                else{
                    console.log(res.data.msg);
                }
            })
        }

    }
})
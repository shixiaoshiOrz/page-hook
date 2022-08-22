<template>
    <div class="youhou_tools_by_gcshi" >
        <!-- 标准产品信息梳理 -->
        <div class="youhou_info" v-drag @click="drawer = true">普</div>
        <el-drawer :visible.sync="drawer" :with-header="false" :size="size + '%'" class="youhou_drawer">
            <drawerWrap 
                @deletedUrl='deletedUrl' 
                @menuId='changePanelSize' 
                v-if="drawer"
                :isHighVersion="isHighVersion"
            ></drawerWrap>
        </el-drawer>
        <!-- 接口信息 -->
        <div class="youhou_hook" @click="ajaxDrawer = true"  v-drag>请求信息</div>
        <debugDrawer 
            :ajaxHookArray='ajaxHookArray' 
            v-if="ajaxDrawer"
            @clearList="ajaxHookArray = []"
            @close="ajaxDrawer = false"
        ></debugDrawer>
    </div>
</template>

<script>
import { GM_getObject } from './utils/GM_tools'
import { ajaxHook } from './utils/ajaxHook.js'
import drawerWrap from './components/standardInfo/drawerWrap.vue'
import debugDrawer from './components/debugTool/debugDrawer.vue'
import log from './plugins/log.js'
import createDom  from "./utils/dom.js"
export default {
    data(){
        return {
            drawer: false,  //标准产品信息
            size:50,        //信息面板大小

            optionName:"页面刷新加载",//hookinfo触发的dom文本信息
            
            deletedFulUrl:"",
            ajaxHookArray:[],       //ajaxHook暂存信息
            
            ajaxDrawer:false,        //请求信息面板
            //是否4.3及以上版本。通过是否存在ajax-hook判断
            isHighVersion:false,
            version:"普"
        }
    },
    components:{ drawerWrap ,debugDrawer},
    created(){ 
        //清除4.3版本自带的ajaxhook
        if(window.__xhr) this.clearXhr()
        ajaxHook(this)
        this.init()
    },
    beforeDestroy(){
        window.removeEventListener('load',this.load)
        window.removeEventListener('popstate',this.popstate)
    },
    methods:{
        init(){
            //全局绑定事件,用来获取当前对象名称
            window.addEventListener('click',(e)=>{
                this.optionName =  `点击【${e.target?.innerText || "--"}】`    
            },true)
            //主资源加载完毕时
            window.addEventListener('load',this.load),
            //当页面进行切换。路由改变时会触发popstate事件
            window.addEventListener('popstate',this.popstate)
            //工具名称打印
            log.pretty(`[persagy-tools] v1.2.0`, `欢迎使用标准产品辅助工具，目前兼容到4.2版本！有疑问请联系开发者shiguangchao@persagy.com`, '#ee0067')
            //DOM加载后，初始化界面大小
            this.initPanelSize()
        },
        //初始化信息面板大小
        initPanelSize(){
            const menuList = GM_getObject('MENULIST') || null
            if(menuList && menuList[0].id) {
            let id = menuList[0].id
            this.changePanelSize(id)
            }
        },
        //如果页面本身存在ajax-hook对象，清除ajaxhook对象
        clearXhr(){
            window.XMLHttpRequest = window.__xhr;
            window.__xhr = undefined;
            this.isHighVersion = true
        },
        //资源加载事件
        load(){
            //如果load时间触发完,出现xhr代理对象，清空该对象并重新代理
            if(window.__xhr){
                this.clearXhr()
                ajaxHook(this)
            }
            //创建工具按钮
            createDom(this.isHighVersion,this.deletedFulUrl)
            //子应用注入ajaxHook
            let iframe = document.querySelector('iframe')
            if(iframe){
                ajaxHook(this,iframe.contentWindow)
                //全局绑定事件,用来获取当前对象名称
                iframe.contentWindow.addEventListener('click',(e)=>{
                    this.optionName = `点击【${e.target?.innerText || "--"}】`   
                },true)
            }
        },
        popstate(){
            //路由切换时，iframe会发生变化，给新的iframe绑定ajaxhook
            let iframe = document.querySelector('iframe')
            if(iframe){
                ajaxHook(this,iframe.contentWindow)
                iframe.contentWindow.addEventListener('click',(e)=>{
                    this.optionName = `点击【${e.target?.innerText || "--"}】`   
                },true)
            }
        },
        //切换面板时，改变其宽度
        changePanelSize(id){
            if(id ==2 ){
                this.size = 90
            }else if(id == 1){
                this.size = 65
            }else{
                this.size = 50
            }
        },
        //删除的url
        deletedUrl(url){
            this.deletedFulUrl = url
        },
    },
    watch:{
        //给每一个hookinfo绑定一个触发的说明
        ajaxHookArray:{
            handler(v){
                if(v.length == 0) return
                v[v.length - 1].name = this.optionName
            },deep:true
        }
    },
}
</script>

<style lang='less' scoped>
.youhou_info{
    width: 46px;
    height: 46px;
    position: fixed;
    bottom: 40px;
    font-size:14px;
    left: 40px;
    background: rgb(245 108 108);
    text-align: center;
    line-height: 46px;
    color:#fff;
    cursor: pointer;
    border-radius: 50%;
    z-index: 1234567;
}
.youhou_drawer{
    z-index: 123456 !important;
}
.youhou_hook{
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 1234567;
    width: 98px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    color: #fff;
    cursor:pointer;
    background: rgb(230 162 60);
    border-radius: 5px;
}
 
</style>
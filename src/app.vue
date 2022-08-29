<template>
    <div class="youhou_tools_by_gcshi" >
        <!-- 标准产品信息梳理 -->
        <div class="youhou_info" v-drag @click="clickVersionMenu()" v-if="showBtnTool" :class="{light:version == '^_^'}"> {{ version }}</div>
        <el-drawer :visible.sync="drawer" :with-header="false" :size="size + '%'" class="youhou_drawer" >
            <drawerWrap 
                @deletedUrl='deletedUrl' 
                @menuId='changePanelSize' 
                v-if="drawer"
                :version="version"
                :persagyVersion = "persagyVersion"
                :showMenuBtn="hookVisible"
            ></drawerWrap>
        </el-drawer>
        <!-- 接口信息 -->
        <div class="youhou_hook" @click="ajaxDrawerVisible"  v-drag v-if="hookVisible && showBtnTool">请求信息</div>
        <debugDrawer 
            :ajaxHookArray='ajaxHookArray' 
            v-if="ajaxDrawer"
            @clearList="ajaxHookArray = []"
            @close="ajaxDrawer = false"
        ></debugDrawer>

        <el-dialog
            title="跳转提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span style="color:red">标准产品3.0+版本不支持在框架页面内使用该功能，但您可以在子页面内使用该功能</span>
            <span>点击【确定】将跳转至：</span>
            <p style="margin-top:10px"> <a :href="iframeSrc" target="_blank"> {{iframeSrc}}</a></p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="jump()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
        title="【油猴】persagyTool脚本更新提醒"
        :visible.sync="updateVisble"
        v-if="updateVisble"
         width="30%">
        <span>亲爱的朋友，脚本有更新了呢！查看教程，看看怎么更新吧！</span>
        <span>传送门</span><a href="http://www.shixiaoshi.site/persagy/doc/use/other/update.html">脚本更新教程</a>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeUpdate()">不在提醒！</el-button>
            <el-button type="primary" @click="updateVisble = false"><a href="/persagy/persagyTool.js">下载最新脚本文件</a></el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import gmInfo from "./api/GM_DB_INFO"
import { ajaxHook } from './utils/ajaxHook.js'
import drawerWrap from './components/standardInfo/drawerWrap.vue'
import debugDrawer from './components/debugTool/debugDrawer.vue'
import log from './plugins/log.js'
import createDom  from "./utils/dom.js"
import excludeList from "./api/excludeUrl"
export default {
    data(){
        return {
            drawer: false,  //标准产品信息
            size:50,        //信息面板大
            optionName:"页面刷新加载",//hookinfo触发的dom文本信息
            deletedFulUrl:"",
            ajaxHookArray:[],       //ajaxHook暂存信息
            ajaxDrawer:false,        //请求信息面板
            //是否4.3及以上版本。通过是否存在ajax-hook判断
            isHighVersion:false,
            dialogVisible:false,
            iframeSrc:"",
            hookVisible:"",
            onlyRunInStand:false,
            showBtnTool:true,
            toolVersion:"",  //当前使用的版本
            updateVisble:false, //更新提醒,
            persagyVersion:"", //脚本版本
        }
    },
    computed:{
        version(){
            let loginInfoItem  =  gmInfo.getLoginInfoItem()
            if(loginInfoItem) {
                return loginInfoItem.version
            }
            let thressVersionDom = document.querySelector(".v6s-login-con")
            if( thressVersionDom ) return "3.0+"
            if(this.isHighVersion) return "4.3+"
            if(location.pathname.indexOf("saasweb") > -1) return "4.0+"
            if(location.pathname.indexOf("saasFrame") > -1) return "3.0+"
            if(location.pathname.indexOf("login/fbms") > -1) return "4.0+"
            if(location.pathname.indexOf("fbms") > -1) return "3.0+"
            if(location.href.indexOf('persagy') > -1 ) return "V"
            if(location.href.indexOf('develop') > -1 ) return "V"
            if(location.href.indexOf('test') > -1 ) return "V"
            return "^_^"
        }
    },
    components:{ drawerWrap ,debugDrawer},
    created(){ 
        this.hookVisible = gmInfo.getHookVisible() || this.version !="^_^"
        let onlyRunInStand = gmInfo.getOnlyRunInStandValue()
        if(onlyRunInStand && this.version =="^_^") {
            this.showBtnTool = false
        }
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
        async init(){
            //全局绑定事件,用来获取当前对象名称
            window.addEventListener('click',(e)=>{
                if(e.target?.innerText == "请求信息" || e.target?.innerText == "拦截设置") return
                this.optionName =  `点击【${e.target?.innerText || "--"}】`    
            },true)
            //主资源加载完毕时
            window.addEventListener('load',this.load),
            //当页面进行切换。路由改变时会触发popstate事件
            window.addEventListener('popstate',this.popstate)
            //工具名称打印
            log.pretty(`标准产品辅助工具`, `http://www.shixiaoshi.site/persagy/`, '#ee0067')
            //DOM加载后，初始化界面大小
            this.initPanelSize()
            //请求接口，比对版本
            this.persagyVersion = await gmInfo.queryVersion()
            let updateTip = gmInfo.getUpdateTip()
            if(this.persagyVersion && this.$version !== this.persagyVersion && !updateTip){
                this.updateVisble = true
            } 
        },
        //初始化信息面板大小
        initPanelSize(){
            const menuList = gmInfo.getMenuList()
            if(menuList.length > 0 && menuList[0].id) {
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
            createDom(this.version,this.deletedFulUrl)
            //子应用注入ajaxHook
            let iframe = document.querySelector('iframe')
            if(iframe){
                ajaxHook(this,iframe.contentWindow)
                //全局绑定事件,用来获取当前对象名称
                iframe.contentWindow.addEventListener('click',(e)=>{
                    if(e.target?.innerText == "请求信息" || e.target?.innerText == "拦截设置") return
                    this.optionName = `点击【${e.target?.innerText || "--"}】`   
                },true)
            }
            gmInfo.getUserInfo()
        },
        jump(){
            this.dialogVisible = false
            this.$jump(this.iframeSrc)
        },
        popstate(){
            this.ajaxHookArray = []
            //路由切换时，iframe会发生变化，给新的iframe绑定ajaxhook
            let iframe = document.querySelector('iframe')
            if(iframe){
                ajaxHook(this,iframe.contentWindow)
                iframe.contentWindow.addEventListener('click',(e)=>{
                    if(e.target?.innerText == "请求信息" || e.target?.innerText == "拦截设置") return
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
        ajaxDrawerVisible(){
             if(this.version === "3.0+"){
                let iframe = document.getElementById("iframeSystem")
                this.iframeSrc = iframe?.src || null
                if(this.iframeSrc){
                    this.dialogVisible = true
                }else{
                     this.$message.warning('卧槽，居然不支持该页面！')
                }
                return
             }
             if(excludeList.some(res => res.indexOf(location.host) > -1 )) {
                this.$message.warning('卧槽，居然不支持该页面！')
             }else{
                this.ajaxDrawer = true
             }
        },
        //关闭自动更新提醒
        closeUpdate(){
            gmInfo.setUpdateTip(true)
            this.updateVisble = false
        },
        clickVersionMenu(){
            this.updateVisble = false
            this.drawer = true  
        }
    },
    watch:{
        //给每一个hookinfo绑定一个触发的说明
        ajaxHookArray:{
            handler(v){
                if(v.length == 0) return
                v[v.length - 1].name = this.optionName
            },deep:true
        },
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
.youhou_info.light{
    background: rgba(245, 108, 108, .7);
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
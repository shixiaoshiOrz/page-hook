<template>
    <div class="youhou_tools_by_gcshi" >

        <div class="youhou_setting-btn" v-drag>
            <el-button circle type="danger" @click="drawer = true" >
                <svg t="1655972115714" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2593" width="20" height="20"><path d="M883.824 603.006h-46.922c-7.612 27.613-18.546 53.772-32.526 78.063l43.357 43.322c27.752 27.751 27.752 72.735 0 100.485l-25.121 25.122c-27.751 27.752-72.735 27.752-100.486 0l-43.634-43.634c-24.187 13.77-50.278 24.535-77.75 32.007v45.502c0 39.241-31.8 71.04-71.04 71.04H494.2c-39.24 0-71.074-31.799-71.074-71.04V838.37c-27.439-7.473-53.53-18.236-77.751-32.007l-43.635 43.634c-27.715 27.752-72.699 27.752-100.45 0l-25.122-25.122c-27.751-27.75-27.751-72.734 0-100.485l43.357-43.322c-13.98-24.29-24.914-50.45-32.56-78.063h-46.887c-39.24 0-71.04-31.8-71.04-71.004v-35.539c0-39.24 31.8-71.04 71.04-71.04h46.332c7.336-27.335 17.856-53.357 31.454-77.508l-41.696-41.663c-27.751-27.749-27.751-72.733 0-100.485l25.122-25.12c27.751-27.754 72.735-27.754 100.45 0l40.866 40.9c25.018-14.569 52.008-25.917 80.521-33.704v-47.717c0-39.242 31.834-71.04 71.074-71.04h35.502c39.24 0 71.04 31.798 71.04 71.04v47.717c28.546 7.786 55.535 19.134 80.52 33.704l40.865-40.9c27.751-27.754 72.735-27.754 100.486 0l25.121 25.12c27.752 27.752 27.752 72.736 0 100.485l-41.696 41.663c13.6 24.152 24.084 50.173 31.454 77.507h46.333c39.24 0 71.038 31.801 71.038 71.041v35.539c-0.002 39.203-31.801 71.004-71.04 71.004z m-371.876-283.05c-107.89 0-195.364 87.475-195.364 195.367 0 107.89 87.474 195.364 195.364 195.364 107.893 0 195.367-87.474 195.367-195.364s-87.473-195.367-195.367-195.367z m0 281.94c-49.03 0-88.824-39.721-88.824-88.788 0-49.068 39.794-88.79 88.824-88.79 49.033 0 88.793 39.72 88.793 88.79 0 49.066-39.76 88.788-88.793 88.788z" p-id="2594" fill="#ffffff"></path></svg>
            </el-button>
        </div>


        <el-drawer :visible.sync="drawer" :with-header="false" :size="size + '%'" class="youhou_drawer">
            <drawerWrap @deletedUrl='deletedUrl' @menuId='menuId'></drawerWrap>
        </el-drawer>

        <div class="youhou_debug-tool-wrap" @click="debugToolDrawerVisible()" v-if="debugToolVisible" v-drag>
            <el-button type="warning">接口信息</el-button>
        </div>
        <debugDrawer @debugToolDrawer='debugToolDrawer = false' :ajaxHookArray='ajaxHookArray' v-if="debugToolDrawer"></debugDrawer>

    </div>

</template>

<script>
import Vue from 'vue';
import { GM_setObject,GM_getObject ,GM_ajax} from './utils/GM_tools'
import { ajaxHook ,unProxy} from './utils/ajaxHook.js'
import switchWrap from "./components/toolbtn/switch.vue"
import addtoolWrap from './components/toolbtn/toolBtnWrap.vue'
import drawerWrap from './components/standardInfo/drawerWrap.vue'
import debugDrawer from './components/debugTool/debugDrawer.vue'

export default {
    data(){
        return {
            drawer: false,
            deletedFulUrl:"",
            ajaxHookArray:[],//ajaxHook暂存信息
            size:50,

            debugToolVisible:true,
            debugToolDrawer:false,
            stopDebugTool:false,
            locationHref:null,

        }
    },
    components:{ drawerWrap ,debugDrawer},
    beforeDestroy(){
        window.removeEventListener('load',this.load)
        window.removeEventListener('popstate',this.popstate)
    },
    mounted(){
        //初始化界面大小
         const menuList = GM_getObject('MENULIST') || null
         if(menuList && menuList[0].id) {
           let id = menuList[0].id
           this.menuId(id)
         } 
        //拦截框架的所有接口
        ajaxHook(this)
        window.addEventListener('load',this.load),
        window.addEventListener('popstate',this.popstate)

    },
   methods:{
        //获取子应用所有信息
    async queryALLInfo(type){
        
          
        let standardUrlList = GM_getObject('LOGININFOARRAY') || []
        if(standardUrlList.length == 0) return false
        var itemInfo = standardUrlList.find(res => res.fullUrl.indexOf(location.host) > 1)
        if(!itemInfo) return false
        let loginName = itemInfo.userName
      
        const parmas = {loginName: loginName,loginDevice: "PC",isAdminLogin:isAdminLogin}
        let data = await GM_ajax({
            url:'/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService',
            data:JSON.stringify(parmas)
        })
        if(!data) return false
        let result = JSON.parse(data)
        if(result.content[0].resultType == 1) return result
    },
    popstate(){
        if(this.locationHref.indexOf('/login') > -1 ) return this.locationHref = location.href
        this.stopDebugTool = true
        GM_setObject('SHOWDEBUGTOOL',true)
        this.locationHref = location.href
    },
    load(){
        this.locationHref = location.href
        this.addtoolWrap()
        this.switchUrl()
        
        let iframe = document.querySelector('iframe')
        if(iframe){
            ajaxHook(this,iframe.contentWindow)
        }
        if(GM_getObject('SHOWDEBUGTOOL')){
            this.debugToolDrawer = true
        }
        GM_setObject('SHOWDEBUGTOOL',null)
    },
    debugToolDrawerVisible(){
        if(!this.stopDebugTool){
            this.debugToolDrawer = true
        }else{
            location.reload()
        }
    },
    domMount(dom,className,componet,propsData){
        if(!dom) return
        const div = document.createElement('div')
        div.className = className
        dom.appendChild(div)
        var Profile = Vue.extend(componet)
        if(propsData){
            new Profile({propsData}).$mount( '.' + className )
        }else{
            new Profile().$mount('.' + className)
        }  
    },
    //增加工具栏
    addtoolWrap(){
        let dom = document.querySelector(".login_forms");
        this.domMount(dom,'youhou_toolWrap',addtoolWrap)
    },
    //增加平台切换按钮
    switchUrl(){
        let dom = document.querySelector(".login_forms");
        let propsData = { deletedFulUrl:this.deletedFulUrl }
        this.domMount(dom,'youhou_swicth',switchWrap,propsData)
    },
    //删除的url
    deletedUrl(url){
        this.deletedFulUrl = url
    },
    menuId(v){
        if(v ==2 ){
            this.size = 90
        }else if( v == 1){
            this.size = 65
        }else{
            this.size = 50
        }
    }
   }
}
</script>

<style lang='less' scoped>
.youhou_setting-btn{
    width: 46px;
    height: 46px;
    position: fixed;
    bottom: 40px;
    left: 40px;
    cursor: pointer;
    border-radius: 50%;
    z-index: 1234567;
}
.youhou_drawer{
    z-index: 123456 !important;
}
.youhou_debug-tool-wrap{
position: fixed;
bottom: 40px;
right: 40px;
z-index: 1234567;

}
 
</style>
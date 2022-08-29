<template>
  <div class="youhou_setting-box">
    <el-dialog
        title="脚本设置"
        :visible.sync="setVisible"
        width="45%">
         <p style="margin-bottom:10px"><el-checkbox v-model="setValue.onlyRunInStand">仅在标准产品上运行</el-checkbox></p>
         <p style="margin-bottom:10px"><el-checkbox v-model="setValue.hookVisible">普通网页使用接口拦截功能</el-checkbox></p>
         <p style="margin-bottom:40px"><el-checkbox v-model="setValue.closeUpdateTip">关闭更新提醒</el-checkbox> </p>
         <p style="margin-bottom:10px">{{`脚本信息：当前版本：${$version}。最新版本：${persagyVersion}`}}</p> 
         <p style="margin-bottom:20px;color:red" v-show="tipValue == 1">您有新的脚本可以更新！！！！！！！</p> 
         <p>
            <span style="margin-bottom:20px">点击下载最新脚本：<el-button type="danger"><a style="color:#fff" href="/persagy/persagyTool.js">点击下载</a></el-button></span>
            <span style="margin-bottom:10px">脚本更新教程：<a href="http://www.shixiaoshi.site/persagy/doc/use/other/update.html">点击跳转</a></span>
         </p>
         <span slot="footer" class="dialog-footer">
            <el-button @click="setVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveSet()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 头部 -->
    <div class="youhou_header">
        <div style="fontSize:20px;cursor:pointer">
            <span @click="$jump('http://www.shixiaoshi.site/persagy')"  title="点击查看官方说明文档！">{{ showMenuBtn ? "标准产品辅助工具PersagyTool": "网页记事本" }}</span>
            <el-button v-if="selectid == 2" @click="initMenu = !initMenu" >返回上一级</el-button>
            <el-button v-if="!showMenuBtn" @click="selectid = 1" :type="selectid == 1 ? 'primary' : ''">标准产品相关记录 </el-button>
            <el-button v-if="!showMenuBtn" @click="selectid = 5" :type="selectid == 5 ? 'primary' : ''">网址收藏</el-button>
        </div>
        <div>
            <b> {{ showMenuBtn ? `当前版本：${ $version }` :"" }}</b>
            <el-badge :value="tipValue" class="item"><el-button size="small" @click="setVisible = true">设置</el-button></el-badge>
        </div>
    </div>
    <!-- 按钮列表 -->
    <dradList @menuItem='menuItem' :isStandUrl="isStandUrl" v-show="selectid !== 2 && showMenuBtn" :initMenu="initMenu"></dradList> 
    <!-- 子模块面板 -->
    <div class="youhou_drawer_box">
        <keep-alive>
            <mContentStandard @deletedUrl="$meit('deletedUrl')" v-if="selectid == 1" :version="version"></mContentStandard>
            <childrenInfo v-if="selectid == 4 && isStandUrl" :version="version"></childrenInfo>
            <projectInfo v-if="selectid == 3 && isStandUrl" :version="version"></projectInfo>
            <favoritesSite v-if="selectid == 5" :version="version"></favoritesSite>
            <userInfo v-if="selectid == 2 && isStandUrl" :version="version"></userInfo>
        </keep-alive>
        <el-empty description="仅标准产品才可以使用此功能！" v-if="(selectid == 2 || selectid == 4 || selectid == 3) && !isStandUrl"  ></el-empty>
    </div> 
  </div>
</template>

<script>
import dradList from './dradList.vue'
import mContentStandard from './mContentStandard.vue'
import childrenInfo from './childrenInfo.vue'
import projectInfo from './projectInfo.vue'
import favoritesSite from './favoritesSite.vue'
import userInfo from './userInfo.vue'
import gmInfo from "../../api/GM_DB_INFO"
export default {
    components:{ mContentStandard ,dradList,childrenInfo,projectInfo,favoritesSite,userInfo},
    props:{
        version:String,
        showMenuBtn:Boolean,
        persagyVersion:String
    },
    data(){
        return {
            component:[
                { label: "标准产品相关记录", standard:true, id:1},
                { label: "运维工具", standard:true, id:2},
                { label: "项目信息", standard:true, id:3},
                { label: "子应用信息", standard:true, id:4},
                { label: "网址收藏", standard:false, id:5},
            ],
            selectid:1,
            initMenu:false,
            setVisible:false,
            setValue:{
                hookVisible:null,
                onlyRunInStand:false,
                closeUpdateTip:false,
            },
  
        }
    },
    computed:{
        isStandUrl(){
             if(this.version != '^_^') return  true
             //根据本地信息及host判断当前域名是不是标准产品
             let loginInfoItem  =  gmInfo.getLoginInfoItem()
             if( loginInfoItem ) return true
             return false
        },
        tipValue(){
            if(!this.persagyVersion) return ""
            if(!this.$version) return ""
            if(this.persagyVersion !== this.$version ) return 1
        }
    },
    created(){
        this.setValue.hookVisible = gmInfo.getHookVisible()
        this.setValue.onlyRunInStand = gmInfo.getOnlyRunInStandValue()
        this.setValue.closeUpdateTip = gmInfo.getUpdateTip()

        if(!this.showMenuBtn) return this.selectid =1

        let menuList = gmInfo.getMenuList()
        if(menuList.length > 0) {
            this.selectid = menuList[0].id
        }else{
            gmInfo.setMenuList(this.component)
        }
    },
    methods:{
        saveSet(){
            gmInfo.setHookVisible(this.setValue.hookVisible)

            gmInfo.setOnlyRunInStandValue(this.setValue.onlyRunInStand)
            //设置自动更新
            gmInfo.setUpdateTip(this.setValue.closeUpdateTip)
            this.setVisible = false
            window.location.reload()
        },
        menuItem(v){
            this.selectid = v.id
            this.$emit('menuId',v.id)
        }
    },
}
</script>

<style lang="less" scoped>
.youhou_setting-box{
    display: flex;
    flex-flow: column;
    height: 100vh;
    justify-content: space-between;
    .youhou_header{
        padding: 0 15px 10px 10px;
        margin-top: 10px;
        display: flex;
        color: rgb(64 158 255);;
       
        justify-content: space-between;
        margin-bottom: 10px;
        
        span{
            display: inline-block;
            font-weight: 800;
            text-decoration:underline;
        }

    }
 .youhou_drawer_box{
    flex:1;
    border-radius: 4px;
    padding: 0 10px 10px 10px;
    overflow-y: auto;
    background: #fff;
 }
}


</style>
<template>
  <div class="youhou_setting-box">
    <!-- 头部 -->
    <div class="youhou_header">
        <div style="fontSize:20px">标准产品4.0版本谷歌浏览器插件</div>
    </div>
    <el-divider content-position="right" style="fontSize:12px;display:block">v1.1.0测试版</el-divider>
    <!-- 按钮列表 -->
    <dradList @menuItem='menuItem' :isStandUrl="isStandUrl"></dradList>  
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
        version:String
    },
    data(){
        return {
            component:[
                { label: "标准产品相关记录", standard:true, id:1},
                { label: "用户信息", standard:true, id:2},
                { label: "项目信息", standard:true, id:3},
                { label: "子应用信息", standard:true, id:4},
                { label: "网址收藏", standard:false, id:5},
            ],
            selectid:1,
        }
    },
    computed:{
        isStandUrl(){
             if(location.href.indexOf('saasweb') > -1 ) return true
             if(location.href.indexOf('fmbs') > -1 ) return true
             if(location.href.indexOf('saasFrame') > -1 ) return true
             //根据本地信息及host判断当前域名是不是标准产品
             let loginInfoItem  =  gmInfo.getLoginInfoItem()
             if( loginInfoItem ) return true
             return false
        }
    },
    created(){
        let menuList = gmInfo.getMenuList()
        if(menuList) {
            this.selectid = menuList[0].id
        } 
    },
    methods:{
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
    padding: 0 10px;
    margin-top: 10px;
    display: flex;
    color: rgb(64 158 255);;
    font-weight: 800;
    justify-content: space-between
    }
 .youhou_drawer_box{
    flex:1;
    border-radius: 4px;
    padding: 10px;
    overflow-y: auto;
    background: #fff;
 }
}


</style>
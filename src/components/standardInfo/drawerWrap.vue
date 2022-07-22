<template>
  <div>
    <div class="youhou_header">
        <div style="fontSize:20px">标准产品4.0版本谷歌浏览器插件</div>
        <div></div>
        </div>
    <el-divider content-position="right" style="fontSize:12px">v1.0.0版本</el-divider>
    <dradList @menuItem='menuItem'></dradList>  
    <div class="youhou_drawer_box">
        <keep-alive>
            <mContentStandard @deletedUrl="$meit('deletedUrl')" v-if="selectid == 1"></mContentStandard>
            <childrenInfo v-if="selectid == 4 && isStandUrl"></childrenInfo>
            <projectInfo v-if="selectid == 3 && isStandUrl"></projectInfo>
            <favoritesSite v-if="selectid == 5"></favoritesSite>
            <userInfo v-if="selectid == 2 && isStandUrl"></userInfo>
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

import { GM_setObject,GM_getObject } from '../../utils/GM_tools'
export default {
    components:{ mContentStandard ,dradList,childrenInfo,projectInfo,favoritesSite,userInfo},
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
            return location.href.indexOf('saasweb') > -1 || location.href.indexOf('login') > -1
        }
    },
    created(){
        let selectItem = GM_getObject('MENULIST')
        this.selectid = selectItem[0].id
    },
    methods:{
        menuItem(v){
            this.selectid = v.id
            this.$emit('menuId',v.id)
        }
    },
}
</script>

<style>
.youhou_drawer .youhou_header{
    padding: 0 10px;
    margin-top: 10px;
    display: flex;
    color: rgb(64 158 255);;
    font-weight: 800;
    justify-content: space-between
}
 .youhou_drawer_box{
    position: absolute;
    top:98px;
    border-radius: 4px;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
    /* border: 1px solid rgb(220 223 230); */
 }
</style>
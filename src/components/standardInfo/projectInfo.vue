<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span @click="download()">用户信息</span>
        <el-button style="float: right; padding: 3px 0" type="text">{{ userInfo ? userInfo.groupCode : '/'}}</el-button>
      </div>
      <div class="youhou-info-text" v-if="userInfo">
        <span>用户名称：<el-button  type='text' size="normol" @click='$copy(userInfo.name)'>{{userInfo.name || "--"}}</el-button></span>
        <span>用户账号：<el-button type='text' size="normol" @click='$copy(userInfo.userName)'>{{ userInfo.userName || "--"}}</el-button></span>
        <span>用户密码：<el-button type='text' size="normol" @click='$copy(userInfo.password)'>{{userInfo.password || "--"}}</el-button></span>
        <span>用户电话：<el-button type='text' size="normol" @click='$copy(userInfo.pphone_num)'>{{userInfo.pphone_num || "--"}}</el-button></span>
        <span>用户邮箱：<el-button type='text' size="normol" @click='$copy(userInfo.person_mail)'>{{userInfo.person_mail || "--"}}</el-button></span>
        <span>userId：<el-button type='text' size="normol" @click='$copy(userInfo.userId)'>{{userInfo.userId || "--"}}</el-button></span>
        <span>用户pd：<el-button type='text'  size="normol" @click='$copy(userInfo.pd)'>{{userInfo.pd || "--"}}</el-button></span>
      </div>
      <el-empty description="系统库无资源，登录该网站后可查看信息！" v-if='!userInfo'></el-empty>
    </el-card>
     <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>项目信息</span>
      </div>
      <template v-if="projectInfo.length > 0">
         <div  v-for="(item,index) in projectInfo" :key="index" class="youhou-text">
          <span style="width:200px;">项目名称：<el-tag>{{item.projName }}</el-tag></span>
          <span style="width:200px;" @click="copy(item.projectId)">projectId：<el-tag type="success">{{item.projectId }}</el-tag></span>
          <span style="width:220px;" @click="copy(item.projectLocalID)">projectLocalID：<el-tag type="info">{{item.projectLocalID }}</el-tag></span>
        </div>
      </template>
      <el-empty description="没有任何内容" v-if='projectInfo.length  == 0'></el-empty>
    </el-card>
  </div>
</template>

<script>
import { queryALLInfo } from "../../api/proxy"
import gmInfo from "../../api/GM_DB_INFO"
export default {
  created(){
    this.queryInfo()
  },
  props:{
    version:String
  },
  data(){
    return {
      projectInfo:[],
      userInfo:null,
    }
  },
  methods:{
    copy(url){
      this.$message.success('已经复制至剪切板！')
      GM_setClipboard(url)
    },
    async queryInfo(){
        let data = await queryALLInfo(null,this.version)
        if(!data) return
        let result = data.content[0]
        this.userInfo = {
           name:result.name,
           groupCode:result.groupCode,
           pd:result.pd,
           phone_num:result.phone_num,
           userId:result.userId,
           person_mail:result.person_mail,
           userName:result.userName,
           password:'',
        } 
        let itemInfo = gmInfo.getLoginInfoItem()
        if( itemInfo ){
          this.userInfo.password = itemInfo.password
        }
        this.projectInfo = result.projects || []
    }
  }
}
</script>

<style lang="less" scoped>
.box-card{
  margin-bottom: 10px;
}
.youhou-info-text{
  display: flex;
  flex-flow: wrap;
  align-items: center;
  span{
    width: 45%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
.youhou-text{
  height: 30px;
  display: flex;
  cursor: pointer;
  align-items: center;
  span{
    display: flex;
    margin-right: 15px;
    align-items: center;
  }
}
</style>>

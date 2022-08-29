<template>
  <div class="youhou_userinfo-set">
    <div class="irfameWrap" v-if="version === '4.0+'">
      <el-button 
      :type="item.type" 
      v-for="(item,index) in srcList4" 
      :key="index"
       @click="selectIndex = index"
       :plain="selectIndex == index ? false : true"
      >{{item.name}}</el-button>
      <iframe :src="srcList4[selectIndex].src" 
        frameborder="0" 
        style="height:96.5%;width:100%"
      ></iframe>
    </div>
    <div class="irfameWrap" v-if="version === '3.0+'">
      <el-button 
        :type="item.type" 
        v-for="(item,index) in srcList3" 
        :key="index" 
        @click="selectIndex = index" 
        :plain="selectIndex == index ? false : true"
      >{{item.name}}</el-button>
      <iframe :src="srcList3[selectIndex].src" 
        frameborder="0" 
        style="height:96.5%;width:100%"
      ></iframe>
    </div>
    
    <div v-if="version === '4.3+'">标注产品4.3版本咱未增加功能！</div>
  </div>
</template>

<script>
export default {
  created(){
      
  },
  props:{
    version:String
  },
  data(){
    return {
      srcList3:[
        {name:"管理员配置",src:"/maintenancesystem/adminManage?loginName=PERSAGYADMIN&saasPort=80&timeStamp=1661305886830",type:'danger'},
        {name:"账号管理",src:"/maintenancesystem/accountManage?&loginName=PERSAGYADMIN&saasPort=80&timeStamp=1661305417496",type:'danger'},
        {name:"项目配置",src:"/maintenancesystem/projectManage?&loginName=PERSAGYADMIN&saasPort=80&timeStamp=1661306872006",type:'primary'},
        {name:"分区管里",src:"/maintenancesystem/partitionedManage?&loginName=PERSAGYADMIN&saasPort=80&timeStamp=1661306907498",type:'primary'},
        {name:"权限包管理",src:"/maintenancesystem/authCollectionManage?&loginName=PERSAGYADMIN&saasPort=80&timeStamp=1661306950488",type:'primary'},
        {name:"功能菜单管理",src:"/maintenancesystem/functionMenuManage?&loginName=PERSAGYADMIN&saasPort=80&timeStamp=1661306972733",type:'primary'},
      ],
      srcList4:[
        {name:"账号管理",src:"/maintenancesystem/accountManage?&loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'danger'},
        {name:"平台管理员管理",src:"/maintenancesystem/adminManage?loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'danger'},
        {name:"集团管理员管理",src:"/maintenancesystem/groupAdminManage?loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'danger'},
        {name:"集团管理",src:"/maintenancesystem/groupManage?loginName=PERSAGYADMIN&saasPort=80&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'primary'},
        {name:"分区管里",src:"/maintenancesystem/partitionedManage?&loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'primary'},
        {name:"项目配置",src:"/maintenancesystem/projectManage?&loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'primary'},
        {name:"权限包管理",src:"/maintenancesystem/authCollectionManage?&loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'primary'},
        {name:"功能菜单管理",src:"/maintenancesystem/functionMenuManage?&loginName=PERSAGYADMIN&pj=059014535DCFA3D41DAA03B7FA6B35C3",type:'primary'},
      ],
      selectIndex:0
    }
  },
}
</script>

<style lang="less" scoped>
.youhou_userinfo-set{
  height: 100%;
  .irfameWrap{
    height: 100%;
    box-sizing: border-box;
    .el-button{
      margin-bottom: 5px;
      height: 3.5%;
      line-height: 3.5%;
    }
  }
}
</style>>

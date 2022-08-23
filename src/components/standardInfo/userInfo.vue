<template>
  <div class="youhou_userinfo-set">
    <iframe src="/maintenancesystem/accountManage?loginName=PERSAGYADMIN" 
      frameborder="0" 
      style="height:100%;width:100%"
      v-if="version === '4.0+'"
    ></iframe>
    <div v-else>标注产品4.3版本以上不支持该功能！</div>
  </div>
</template>

<script>
export default {
  created(){

  },
  props:{
    version:String
  }
}
</script>

<style lang="less" scoped>
.youhou_userinfo-set{
  height: 100%;
}
</style>>

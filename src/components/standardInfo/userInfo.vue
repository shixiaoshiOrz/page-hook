<template>
  <div class="youhou_userinfo-set">
    <iframe src="/maintenancesystem/accountManage?loginName=PERSAGYADMIN" 
      frameborder="0" 
      style="height:100%;width:100%"
      v-if="!isHighVersion"
    ></iframe>
    <div>标注产品4.3版本以上不支持该功能！</div>
  </div>
</template>

<script>
export default {
  created(){
    // console.log("1111111111111111",location.host);
  },
  props:{
    isHighVersion:Boolean
  }
}
</script>

<style lang="less" scoped>
.youhou_userinfo-set{
  // background: red;
  height: 100%;
}
</style>>

<template>
  <div class="youhou_userinfo-set">
    <iframe src="/maintenancesystem/accountManage?loginName=PERSAGYADMIN" 
      frameborder="0" 
      style="height:100%;width:100%"
    ></iframe>
  </div>
</template>

<script>
export default {
  created(){
    console.log("1111111111111111",location.host);
  }
}
</script>

<style lang="less" scoped>
.youhou_userinfo-set{
  // background: red;
  height: 100%;
}
</style>>

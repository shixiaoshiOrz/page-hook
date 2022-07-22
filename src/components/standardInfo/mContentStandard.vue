<template>
  <div class="youhou_menu-standard-wrap" >
    <div class="youhou_menu-standard-card" v-for="(item,index) in standardUrlList" :key="index"  >

      <div class="youhou_menu-card-title">
        <div :title="item.title">{{ item.title || '暂无标题' }}</div>
        <div style="flex:1"><el-link @click="jump(item.fullUrl)">{{ item.fullUrl || '暂无网址' }}</el-link></div>
        <div>
          <el-button  @click="delet(item)" type="danger" size="mini">删除</el-button>
          <el-button @click="show(index)" size="mini">{{showChild && selectIndex == index ? '收起' : '展开'}}</el-button>
        </div>
      </div>

      <keep-alive>
        <contentTable :itemInfo="item.child" @change='change' v-if="showChild && selectIndex == index"></contentTable>
      </keep-alive>
      
      
    </div>   
    <el-empty description="系统库无资源，登录4.0版本标准产品成功后，后自动记录网址信息哦~~" v-if="standardUrlList.length == 0"></el-empty>
  </div>
</template>

<script>
import { GM_setObject,GM_getObject } from '../../utils/GM_tools'
import contentTable from './contentTable.vue'
export default {
  data(){
    return {
      standardUrlList:[],
      showChild:false,
      selectIndex:-1
    }
  },
  components:{
    contentTable
  },
  mounted(){
    this.standardUrlList = GM_getObject('LOGININFOARRAY') || []
  },
  methods:{
    show(index){
      //没有选中项的时候
      if(!this.showChild) {
        this.showChild = true
        this.selectIndex = index
      }else{
        if(this.selectIndex == index){
          this.showChild = false
          this.selectIndex = -1
        }else{
          this.selectIndex = index
        }
      }
    },
    change(){
      GM_setObject('LOGININFOARRAY',this.standardUrlList)
    },
    jump(fullUrl){
      window.open(fullUrl)
    },
    copy(url){
      this.$message.success('已经复制至剪切板！')
      GM_setClipboard(url)
    },
    delet(item){
        this.$confirm('该操作将删除所有子集信息，且不可恢复！！！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let itemIndex = this.standardUrlList.findIndex(res => {
            return res.fullUrl == item.fullUrl
          })
          let url = this.standardUrlList[itemIndex].fullUrl
          if(url == location.href){
            this.$EventBus.$emit('deletUrl')
          }
          this.standardUrlList.splice(itemIndex,1)
          GM_setObject('LOGININFOARRAY',this.standardUrlList)
        }).catch(() => {
             
        });
    }
  }
}
</script>

<style scoped lang='less'>
.youhou_menu-standard-wrap{
  width: 100%;
  .youhou_menu-standard-card{
    cursor: pointer;
    width: 100%;
    border: 1px solid rgb(220 223 230);
    padding: 10px;
    margin-bottom: 15px;
    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid rgb(64 158 255);
    }
    .youhou_menu-card-title{
      display: flex;
      padding-bottom: 5px;
      align-items: center;
      div:nth-child(1){
        width: 220px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 10px;
      }
    }
  }
}

</style>
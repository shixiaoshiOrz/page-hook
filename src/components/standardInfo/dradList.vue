<template>
  <div class="youhou_divider-wrap">
    <!-- 让一个元素能被拖放需要设置 draggable 属性为true(文本、图片和链接的draggable默认就是true) -->
    <transition-group name="drag" class="youhou_list" tag="ul">
      <li
        @dragenter="dragenter($event, index)"
        @dragover="dragover($event, index)"
        @dragstart="dragstart(index ,item)"
        draggable
        v-for="(item, index) in list"
        :key="item.id"
        class="youhou_list-item"
        :class="{'selet':selectIndex === index}"
        @click="selectItem(index,item)"
      >
        {{ item.label }}
      </li>
    </transition-group>
  </div>
</template>
<script>
import gmInfo from "../../api/GM_DB_INFO"
export default {
  data() {
    return {
      list: [
        { label: "标准产品相关记录", standard:true, id:1},
        { label: "用户信息", standard:true, id:2},
        { label: "项目信息", standard:true, id:3},
        { label: "子应用信息", standard:true, id:4},
        { label: "网址收藏", standard:false, id:5},
      ],
      dragIndex: "",//拖拽的元素索引
      enterIndex: "",
      selectIndex:0,
    };
  },
  mounted(){
    const menuList = gmInfo.getMenuList()
    if(menuList && menuList[0].id) {
      this.list = menuList
    }
  },
  methods: {
    selectItem(index,item){
      this.selectIndex = index
      this.$emit('menuItem',item)
    },
    dragstart(index,item) {
      this.dragIndex = index;
      this.$emit('menuItem',item)
    },
    //源对象开始进入目标对象范围内触发
    dragenter(e, index) {
      e.preventDefault();
      if (this.dragIndex !== index) {
        const moving = this.list[this.dragIndex];
        this.list.splice(this.dragIndex, 1);
        this.list.splice(index, 0, moving);
        console.log('this.list: ', this.list);
        this.dragIndex = index;
        this.selectIndex = index
        gmInfo.setMenuList(this.list)
      }
    },
    dragover(e, index) {
      e.preventDefault();
    },
  },
};
</script>
<style scoped>
.youhou_divider-wrap{
    /* border-bottom: 1px solid red; */
    margin-bottom: 8px;
}
.youhou_list {
  list-style: none;
  display: flex;
}
.drag-move {
    transition: transform 0.3s;
  }
  .youhou_list-item {
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 6px;
    height: 30px;
    line-height:30px;
    text-align: center;
    color: rgb(64 158 255);
    background: rgb(236 245 255);
    border: rgb(179 216 255) 1px solid;
    padding: 0 10px;
    margin-left: 10px;
  }
  .youhou_list-item:hover{
    background: rgb(64 158 255);
    color: #fff;
  }
  .youhou_list-item.selet{
    background: rgb(64 158 255);
    color: #fff;
  }
</style>

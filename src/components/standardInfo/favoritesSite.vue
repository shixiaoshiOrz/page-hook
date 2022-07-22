<template>
  <div class="youhou_favorite-wrap">
    <div class="favorite-table-wrap" v-for="(item,index) in array"  :key='item.id'>
        <div class="favorite-table-name">
            <div v-show='selectIndex !== index'>{{ item.name ? item.name : '--'}}</div>
            <el-input v-model="name" placeholder="请输入内容" size="mini" v-if='editStauts && selectIndex == index'></el-input>
        </div>
        <div class="favorite-table-site">
            <div v-show='selectIndex !== index'>{{ item.url ? item.url : '--'}}</div>
            <el-input v-model="url" placeholder="请输入内容" size="mini" v-if='editStauts && selectIndex == index'></el-input>
        </div>
        <div class="favorite-table-btn">
            <span @click="edit(item,index)">{{ editStauts && selectIndex == index ? '取消' : '编辑' }}</span>
            <span :class="{ensure:editStauts && selectIndex == index}" @click="deletOrEnsure(item)"> {{ editStauts && selectIndex == index ? '确认' : '删除' }}</span>
        </div>  
    </div>
    <div class="favorite-site-add" @click="add()">新增+</div>
   <div class="favorite-table-wrap" v-if="addPop">
        <div class="favorite-table-name">
            <el-input v-model="name" placeholder="请输入名称" size="mini" ></el-input>
        </div>
        <div class="favorite-table-site">
            <el-input v-model="url" placeholder="请输入记录内容" size="mini" ></el-input>
        </div>
        <div class="favorite-table-btn">
            <span @click="addPop = false">取消</span>
            <span class="ensure" @click="addItem">确认</span>
        </div>  
    </div>

  </div>
</template>

<script>
import { GM_setObject,GM_getObject } from '../../utils/GM_tools'
export default {
    data(){
        return {
            array:[],
            name:'',
            url:'',
            selectIndex:-1,
            editStauts:false,
            addPop:false
        }
    },
    created(){
        this.array = GM_getObject('URLLISTARRAY') || []
    },
    methods:{
        //关闭新增按钮
        closeAddPop(){
            this.addPop = false
            this.name = ""
            this.url = ""
        },
        //编辑
        edit(item,index){
            if(this.editStauts){
                this.closeAddPop()
                this.editStauts = false
                this.selectIndex = -1
            }else{
                this.closeAddPop()
                this.editStauts = true
                this.name = item.name
                this.url = item.url
                this.selectIndex = index
            }
        },
        //新增按钮
        add(){
            this.addPop = true 
            this.name = ""
            this.url = ""
            this.selectIndex = -1 
        },
        //新增
        addItem(){
            if(!this.name) return this.$message.warning('请输入名称！')
            let urlListArray = GM_getObject('URLLISTARRAY') || []
            urlListArray.push({
                name:this.name,
                url:this.url,
                id:urlListArray.length == 0 ? 0 : urlListArray[urlListArray.length - 1].id + 1
            })
            GM_setObject('URLLISTARRAY',urlListArray)
            this.array = urlListArray
            this.closeAddPop()
        },
        //确定或删除
        deletOrEnsure(item){
            if(this.editStauts){
                //确认编辑结果
                item.name = this.name
                item.url = this.url
                this.editStauts = false
                this.selectIndex = -1
                this.closeAddPop()
                GM_setObject('URLLISTARRAY',this.array)
            }else{
                this.$confirm('是否确认删除?', '提示', { confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
                .then(() => {
                    //删除选中结果
                    let index = this.array.findIndex(res => res.id == item.id)
                    this.array.splice(index,1)
                    GM_setObject('URLLISTARRAY',this.array)
                }).catch(() => {
                    
                });
            }
            
        }
    }
}
</script>

<style lang="less" scoped>
.youhou_favorite-wrap{
    .favorite-table-wrap{
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgb(235 238 245);
        height: 40px;
        font-size: 14px;
        &:hover{
               background-color: rgb(250 250 250);
        }
        .favorite-table-name{
            width: 15%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .favorite-table-site{
            flex: 1;
            display: block;
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
        .favorite-table-btn{
            width: 88px; 
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
                display: flex;
                padding: 0 5px;
                line-height: 20px;
                cursor: pointer;
                &:nth-child(1){
                    background: rgb(255 255 255);
                    border: 1px solid rgb(220 223 230);
                    color: rgb(96 98 102);
                    &:hover{
                        color: rgb(64 158 255);
                        border-color: rgb(198 226 255);
                        background-color: rgb(236 245 255);
                    }
                }
                &:nth-child(2){
                    color: rgb(255 255 255);
                    background-color: rgb(245 108 108);
                    border-color: rgb(245 108 108)
                }
                &.ensure{
                    color: rgb(255 255 255);
                    background-color: rgb(103 194 58);
                    border-color: rgb(103 194 58);
                }
            }
        }
    }
    .favorite-site-add{
        height: 40px;
        display: flex;
        align-items: center;
        font-size: 16px;
        justify-content: center;
        background-color: rgb(236 245 255);
        border-color: rgb(217 236 255);
        color: rgb(64 158 255);
        border-radius: 5px;
        cursor: pointer;
        &:hover{
            color: rgb(255 255 255);
           background-color: rgb(64 158 255);
        }
    }
}
</style>>

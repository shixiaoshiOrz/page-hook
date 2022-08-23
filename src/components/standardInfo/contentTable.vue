<template>
    <div class="youhou_menu-card-content">
        <div class="youhou-header-option">
            <div class="left"> 
                <template v-if="showAddInput">
                    <el-input placeholder="请输入名称" v-model="title" style="margin-right:5px;width:100px"  size="mini"></el-input>
                    <el-input placeholder="请输入网址链接或其他内容，网址支持点击跳转~" v-model="fullUrl"  style="margin-right:5px;flex:1" size="mini"></el-input>
                    <el-input placeholder="输入账号密码用 / 隔开" v-model="notice"  style="margin-right:5px;width:180px" size="mini"></el-input>
                </template>
             </div>
            <div class="right">
                <el-tag @click="add" style="margin-right:10px">{{showAddInput ? '保存' : '新增'}}</el-tag>
                <download-excel class = "export-excel-wrapper" :data = "excelpage"  v-if="!editActive && !showAddInput"
                    :fields = "json_fields" :name="tableData[0].title + '相关信息' + time + '.xls'">
                    <el-tag type="success">下载</el-tag>
                </download-excel>
                <el-tag @click="download" v-if="showAddInput" type="danger">取消</el-tag>
            </div>
        </div>

        <el-table :data="tableData" stripe style="width: 100%"  border size="mini">
            <el-table-column prop="title" label="名称" width="100">
                <template slot-scope="scope">
                    <el-input  v-model="title" v-if="editActive && selectIndex == scope.$index"></el-input>
                    <span 
                        v-if="!editActive || selectIndex !== scope.$index" 
                        class="youhou_text" 
                        :title="scope.row.title"
                        @click="$copy(scope.row.title)"
                    >{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="fullUrl" label="网址连接" > 

                <template slot-scope="scope">
                    <el-input  v-model="fullUrl" v-if="editActive && selectIndex == scope.$index"></el-input>
                    <span 
                        v-if="!editActive || selectIndex !== scope.$index" class="youhou_text" 
                        :title="scope.row.fullUrl"
                        @click="jump(scope.row.fullUrl)"
                    >{{ scope.row.fullUrl }}</span>
                </template>

            </el-table-column>
            <el-table-column prop="notice" label="备注" width="260">

                <template slot-scope="scope">
                    <div v-if="isNameAndPassword(scope.row.notice).length > 1 && selectIndex != scope.$index">
                        <el-tag @click="$copy(isNameAndPassword(scope.row.notice)[0])">{{isNameAndPassword(scope.row.notice)[0]}}</el-tag>
                        <el-tag type="success" @click="$copy(isNameAndPassword(scope.row.notice)[1])">{{isNameAndPassword(scope.row.notice)[1]}}</el-tag>
                    </div>
                    <el-input  v-model="notice" v-if="editActive && selectIndex == scope.$index "></el-input> 
                    <span 
                        v-if="selectIndex !== scope.$index  && isNameAndPassword(scope.row.notice).length < 2 " 
                        class="youhou_text" 
                        @click="$copy(scope.row.title)"
                        :title="scope.row.notice"
                    >{{ scope.row.notice }}</span>
                </template>

            </el-table-column>
            <el-table-column prop="" label="操作" width="90" fixed="right">
                <template slot-scope="scope">
                    <div v-if="scope.$index != 0">
                        <el-button type="text"  v-if="!editActive || selectIndex !== scope.$index" @click="delet(scope.$index)">删除</el-button>
                        <el-button type="text" @click="edit(scope.row,scope.$index)"  v-if="!editActive || selectIndex !== scope.$index">编辑</el-button>
                        <el-button type="text"  v-if="editActive && selectIndex == scope.$index" @click="clearModelValue()">取消</el-button>
                        <el-button type="text" v-if="editActive && selectIndex == scope.$index" @click="insure(scope.$index)">确认</el-button>
                    </div>
                    <el-button type="text" disabled v-if="scope.$index == 0">不可操作</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { isURL, time } from "../../utils/common"

export default {
    data(){
        return {
            tableData:[],
            title:'',
            fullUrl:'',
            notice:'',
            showAddInput:false,
            editActive:false,
            selectIndex:-1,
            json_fields:{
                '名称':'title',
                '网址':'fullUrl',
                '账号':'name',
                '密码':'pas',
                '备注':'notice'
            },

        }
    },
    props:{
        itemInfo:Array
    },
    computed:{
        time(){
            return  time()
        },
        excelpage(){
            let newData = [{
                title:"/",
                fullUrl:"/",
                name:"/",
                pas:"/",
                notice:"/"
            }]
            if(this.tableData.length>0){
                newData = this.tableData.map(res => {
                    return {
                        title:res.title,
                        fullUrl:res.fullUrl,
                        name:res.notice.split('/').length > 1 ? res.notice.split('/')[0] : "-",
                        pas:res.notice.split('/').length > 1 ? res.notice.split('/')[1] : "-",
                        notice:res.notice
                    }
                })
            }
            return newData
        }
    },
    methods:{
        isNameAndPassword(str){
            return str.split('/')
        },
        jump(url){
            let isUrl = isURL(url)
            if(isUrl) window.open(url)
            else this.$message.success('已经复制到剪切板！')
        },
        download(){
            if(this.showAddInput){
                this.showAddInput = false
            }else{
                this.$message.warning('下载！')
            }
        },
        //删除
        delet(index){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData.splice(index,1)
                this.$emit('change')
            }).catch(() => {
                
            });
        },
        //编辑-确认
        insure(index){
            this.tableData[index].title = this.title
            this.tableData[index].fullUrl = this.fullUrl
            this.tableData[index].notice = this.notice
            this.$emit('change')
            this.clearModelValue()
        },
        //编辑
        edit(item,index){
            console.log(item);
            //关闭新增按钮的任何选项
            this.showAddInput = false
            //数据初始化
            this.title = item.title,
            this.fullUrl = item.fullUrl
            this.notice = item.notice
            //激活编辑按钮
            this.editActive = true
            this.selectIndex = index
            
        },
        //新增
        add(){
            if(this.showAddInput){
                if(!this.title || !this.fullUrl){
                    return this.$message.warning('名称和网址必须都填哦！')
                }
                let item = {
                    title:this.title,
                    fullUrl:this.fullUrl,
                    notice:this.notice,
                }
                this.tableData.push(item)
                this.$emit('change')
                this.clearModelValue()
            }else{
                this.showAddInput = true
            }
            
        },
        //清空所有
        clearModelValue(){
            this.showAddInput = false
            this.editActive = false
            this.selectIndex = -1
            this.title = ""
            this.fullUrl = ""
            this.notice = ""
        }
    },
    watch:{
        itemInfo:{
            handler(v){
                this.tableData = v   
            },
            deep:true,
            immediate:true
        }
    }
}
</script>

<style lang="less" scoped>
.youhou-header-option{
    display: flex;
    border-top:1px solid rgb(64 158 255);
    align-items: center;
    justify-content: space-between;
    height: 35px;
    .left{
        display: flex;
        flex: 1;
    }
    .right{
      display: flex;
    }
}
</style>>

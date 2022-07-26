<template>
    <div class="youhou_ajaxTable-wrap">
        <transition name="el-fade-in">
            <div class="youhou_hoooklist-wrap"  v-if="dialogTableVisible" >
            <div class="youhou_hoooklist-content">
                    <div class="youhou_hooklist-header">
                        <div><h4>接口拦截列表</h4></div>
                        <div> 
                            <el-button type="text" @click="deletAll()">清空所有</el-button>
                            <div style="font-size:16px;margin-left:10px;color:rgb(144 147 153)" @click="dialogTableVisible = false">X</div>
                        </div>
                    </div>
                    <div class="youhou_hooklist-table">
                        <div v-for="(item,index) in hookList" :key="item.id">
                            <span>{{index + 1}}</span>
                            <span>{{item.siteName}}</span>
                            <span>{{item.url}}</span>
                            <span @click="deletHookItem(index)">删除</span>
                        </div>
                    </div>
            </div>     
            </div>
        </transition>



        <el-dialog
            title="下载提示"
            :visible.sync="dialogVisible"
            width="30%"
            v-if="tableData.length > 0"
            >
            <span>是否下载请求参数和响应参数？</span>
            <span slot="footer" style="display:flex;justify-content: end;">
                <download-excel style="margin-right:10px" :data = "tableData" 
                    :fields = "json_fields1" :name="tableData[0].siteName + '接口信息' + time">
                    <el-button type="primary" plain @click="dialogVisible = false">否</el-button>
                </download-excel>
                <download-excel class = "export-excel-wrapper" :data = "tableData" 
                    :fields = "json_fields" :name="tableData[0].siteName + '接口信息' + time">
                    <el-button type="primary"  @click="dialogVisible = false">是</el-button>
                </download-excel>
            </span>
        </el-dialog>


        <div class="youhou_ajaxTable-header">
            <div class="youhou_ajaxTable-header-tools">
                <div style="display:flex;align-items: center">
                    <el-input v-model="searchStr" placeholder="请输入接口关键词!" style="width:200px" clearable @clear="clear"></el-input>
                    <div class="button" @click="search" >接口搜索</div>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="Headers"></el-checkbox>
                        <el-checkbox label="Payload"></el-checkbox>
                        <el-checkbox label="Response"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div style="margin-right:10px;display: flex;cursor: pointer;">
                    <div class="button" @click="dialogVisible = true" style="margin-top:5px" v-if="tableData.length > 0">下载</div>
                    <el-badge :value="hookList.length > 0 ? hookList.length : ''" style="margin-left:10px;">
                        <el-button type="danger" plain @click="showTable">接口拦截列表</el-button>
                    </el-badge>
                </div>
            </div>
            
        </div>
        <div class="youhou_ajaxTable-content">
            <template v-if="tableData && tableData.length > 0">
                <div v-for="(item,index) in tableData" :key="index" class="youhou_ajaxTable-item" :class="{select:seletIndex == index}">
                    <div>{{index + 1}}</div>
                    <div @click="ajaxItem(item,index)" :title="item.url">{{ item.url }}</div>
                    <div>
                        <el-button  @click="useSetting(item,index)" type="danger" v-if="isHookItem(item)" plain size="mini">拦截中</el-button>
                        <el-button  @click="useSetting(item,index)" type="text" v-if="!isHookItem(item)">拦截设置</el-button>
                    </div>
                </div>
            </template>
            <el-empty description="暂无接口数据！" v-if="!tableData || tableData.length == 0"></el-empty>
        </div>
        <transition name="el-fade-in">
            <div class="youhou_ajax-hook-setting" v-if="ajaxHookSettingVisible"> 
                <ajaxHookSetting :seletItem="seletItem" @close='closePop'></ajaxHookSetting> 
            </div>
        </transition>
    </div>
</template>

<script>
import ajaxHookSetting from '../debugTool/ajaxHookSetting.vue'
import { GM_setObject,GM_getObject } from '../../utils/GM_tools'
export default {
    props:{
        ajaxHookArrayIfo:[]
    },
    mounted(){
        this.hookList = GM_getObject('HOOKINFOLIST') || []
    },
    components:{ ajaxHookSetting },
    data() {
      return {
        hookList:[],
        dialogTableVisible:false,
        searchStr:null,
        AjaxInfoArray:[],
        seletIndex:0,
        ajaxHookSettingVisible:false,
        seletItem:null,
        dialogVisible:false,
        tableData:[],
        checkList:['Headers', 'Payload', 'Response'],
        json_fields:{
            '模块名称':'siteName',
            '前端服务':'pathName',
            'Request URL':'url',
            'Request Method':'method',
            'Status Code':'status',
            'Content-Type':'headers',
            'Payload':'body',
            'Response':"response",
        },
        json_fields1:{
            '模块名称':'siteName',
            '前端服务':'pathName',
            'Request URL':'url',
            'Request Method':'method',
            'Status Code':'status',
            'Content-Type':'headers',
        },
      }
    },
    computed:{
        time(){
            var d = new Date();
            var year = d.getFullYear();
            var month = change(d.getMonth() + 1);
            var day = change(d.getDate());
            var hour = change(d.getHours());
            var minute = change(d.getMinutes());
            var second = change(d.getSeconds());
            function change(t) {
                if (t < 10) {
                    return "0" + t;
                } else {
                    return t;
                }
            }
            return year + month + day +hour + minute +second;
        },
    },
    watch:{
        ajaxHookArrayIfo:{
            handler(v){
                this.tableData = this.getTable(v)
            },
            deep:true,immediate:true
        },
    },
    methods:{
        deletAll(){
            GM_setObject('HOOKINFOLIST',null)
            this.hookList = []
            this.dialogTableVisible = false
            this.$message.success(`删除成功！`)
        },
        closePop(v){
            this.hookList = GM_getObject('HOOKINFOLIST') || []
            this.ajaxHookSettingVisible = false
        },
        showTable(){
            if(this.hookList.length > 0){
                this.dialogTableVisible = true
            }else{
                this.$message.info(`暂无数据！`)
            }
        },
        deletHookItem(index){
            this.hookList.splice(index,1)
            this.$message.success(`删除成功！`)
            GM_setObject('HOOKINFOLIST',this.hookList)
        },
        isHookItem(item){
            //增加拦截信息
            let hookList = this.hookList
            if( hookList.length == 0) return false
            return hookList.some(res => res.id == item.id)
        },
        getTable(data){
            if(!data || data.length === 0) return []
            //增加网站名
            let userInfo = sessionStorage.getItem('userInfo')
            let authorizations = []
            if(userInfo){
                let info = JSON.parse(userInfo)
                authorizations = info?.authorizations || []
                if(authorizations.length > 0){
                    authorizations = authorizations.filter(res => res.functionUrl && res.authorizationId)
                    authorizations.forEach(res => res.fulUrl = res.functionUrl + res.authorizationId)
                }
            }
            let pathName = location.pathname?.split('/')
            let saaswebUrl =  pathName?.slice(1)?.join('/') || ""
            let noSaaswebUrl = pathName?.slice(2)?.join('/') || ""
            let item = authorizations?.find(res => {
                    return  res.fulUrl.indexOf(saaswebUrl) > -1 || res.fulUrl.indexOf(noSaaswebUrl) > -1
            }) || {authorizationName:null}
            data.forEach(res => {
                res.siteName = item?.authorizationName || location.host + location.pathname
                res.pathName = location.pathname
            })
            return data
        },
        clear(){
            this.searchStr = null
            this.tableData =  this.getTable(this.ajaxHookArrayIfo)
            //更改默认选中项
            let item = this.tableData[0]
            this.ajaxItem(item,0)  

        },
        ajaxItem(item,index){
            this.seletIndex = index
            this.$emit('ajaxItem',item)
        },
        useSetting(item,index){
            this.seletIndex = index
            this.seletItem = item
            this.ajaxHookSettingVisible = true
        },
        search(){
            if(this.checkList.length == 0) return this.$message.warning('至少选择一项搜索条件！')
            if(!this.searchStr){
                this.$message.warning('请输入搜索内容！')
            }else{
                let serachArray =  this.ajaxHookArrayIfo.filter(res => {
                    let searchArray = this.checkList.join(",")
                    let searchStr = ""
                    if(searchArray.indexOf("Headers") > -1){
                        searchStr = res.method + res.headers + res.url + res.status
                    }
                    if(searchArray.indexOf("Payload") > -1){
                        searchStr  = searchStr + res.body
                    }
                    if(searchArray.indexOf("Response") > -1){
                        searchStr  = searchStr +  res.response
                    }
                    return searchStr.indexOf(this.searchStr) > -1
                })
                this.tableData = this.getTable(serachArray)
                //更改默认选中项
                let item = this.tableData[0]
                this.ajaxItem(item,0)
            }
        }
    },
  }
</script>

<style scoped lang='less'>
.youhou_ajaxTable-wrap{
    .youhou_hoooklist-wrap{
       position: fixed;
        z-index: 1234567;
        left: 0;
        right: 0;
        bottom: 0;
        top:0;
        background: rgba(0, 0, 0, 0.6);
    }
    .youhou_hoooklist-content{
        position: fixed;
        z-index: 12345678;
        width: 60%;
        border-radius: 5px;
        left: calc(20%);
        top:10%;
        height: 50%;
        background: #fff;
        overflow: auto;
        display: flex;
        flex-flow: column;
        overflow: hidden;
        border: 1px solid gainsboro;
        .youhou_hooklist-header{
            display: flex;
            cursor: pointer;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
             box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            height: 40px;
            div{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            h4{
                font-size: 16px;
                color:rgb(64 158 255);
            }
        }
        .youhou_hooklist-table{
            padding: 0 10px 0 10px;
            flex: 1;
            overflow:auto;
            div{
                display: flex;
                font-size: 12px;
                align-items: center;
                border-top:  1px solid rgb(215 218 226);
                &:last-child{
                    border-bottom: none;
                }
                span{
                    display: block;
                    height: 35px;
                    line-height: 35px;
                    &:nth-child(1){
                        width: 35px;
                        text-align: center;
                    }
                    &:nth-child(2){
                        padding: 0 10px;
                        width: 130px;
                        margin-right: 10px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    &:nth-child(3){
                        flex: 1;
                        margin-right: 10px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    &:nth-child(4){
                        width: 45px;
                        height: 20px;
                        line-height: 20px;
                        cursor: pointer;
                        text-align: center;
                        background-color: rgb(254 240 240);
                        border: rgb(253 226 226) 1px solid;
                        color: rgb(245 108 108);
                    }
                }
            }
        }
    }
    .youhou_ajax-hook-setting{
        position: fixed;
        left: 0;
        right: 0;
        
        bottom: 0;
        top:0;
        z-index: 133456;
        background: rgb(250 250 250); 
    }
    width: 100%;
    font-size: 14px;
    overflow-y: auto;
    height: 100%;
    .youhou_ajaxTable-header{
        position: absolute;
        top:0;
        background: rgb(244 244 245);
        width: 55%;
        left: 0;
        color: rgb(144 147 153);
        font-weight: 500;
        border-bottom: 1px solid rgb(179 216 255);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        .youhou_ajaxTable-header-tools{
            line-height: 40px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            padding: 10px;
            align-items: center;
            .button{
                color: rgb(255 255 255);
                background-color: rgb(64 158 255);
                border-color: rgb(64 158 255);
                font-size: 14px;
                border-radius: 4px;
                height: 32px;
                width: 86px;
                margin-right: 10px;
                margin-left: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
            /deep/ .el-checkbox-group{
                margin-top:5px;
                .el-checkbox{
                    margin-right: 10px;
                }
            }
            // border-bottom: 1px solid rgb(215 218 226);
            /deep/ .el-badge__content{
                top:10px;
                right: 15px;
            }
            /deep/  .el-input__inner{
                border: 1px solid #409EFF;
            } 
              
        }
        .youhou_ajaxTable-header-span{
            display: flex;
            height: 40px;
            line-height: 40px;
            span{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                font-size: 14px;
                border-right: 1px solid rgb(215 218 226);
                &:nth-child(1){
                    width: 40px;
                    // font-size: 14px;
                }
                &:nth-child(2){
                    flex: 1;
                    // font-size: 14px;
                    padding: 0 10px;
                    width: 100px;
                    justify-content: left;
                }
                &:nth-child(3){
                    padding: 0 10px;
                    width: 100px;
                }
            }
        }
  }
  .youhou_ajaxTable-content{
    margin-top: 41px;
    .youhou_ajaxTable-item.select {
        color: rgb(64 158 255);
        background: rgb(236 245 255);
        border-color: rgb(179 216 255);
    }
    .youhou_ajaxTable-item{
        display: flex;
        height: 40px;
        border-bottom: 1px solid rgb(215 218 226);
        align-items: center;
        line-height: 40px;
        div{
            justify-content: center;
            display: flex;
            cursor: pointer;
            align-items: center;
            line-height: 40px;
            font-size: 14px;
            &:nth-child(1){
               width: 40px;
            }
            &:nth-child(2){
                flex: 1;
                display: block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            &:nth-child(3){
                padding: 0 10px;
                width: 80px;
            }
        }
    }
    .youhou_ajaxTable-item:hover{
        background-color: rgb(244 244 245)
    }
  }
}
</style>

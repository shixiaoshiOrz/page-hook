<template>
  <div class="youhou_children-info">
    <div class="youhou-children-serach" v-show="!isAdmin && version!='3.0+'">
        <el-input placeholder="请输入搜索内容" v-model="serach" size="small" :clearable='true'></el-input>
        <el-button type="primary" size="small" style="margin-left:10px" @click="serachItem()">搜索</el-button>
        <el-button type="danger" size="small" @click="clear()"  style="margin-right:10px">清空</el-button>
        <download-excel class = "export-excel-wrapper" :data = "downloadRowData" 
            :fields = "json_fields" :name="title + '菜单信息' +time + '.xls'">
            <el-button type="success" size="small">下载</el-button>
        </download-excel>
    </div>

    <template v-if='serachArray.length > 0 && serachInfoVisible'>
        <div class="youhou-children-item" v-for="(item,index) in serachArray" :key="index">
            <span style="width:145px" :title="item.productName + item.secondName">
                <b style="font-weight:800;color:rgb(245 108 108);diplay:block">{{ item.productName}}</b> {{ item.secondName }}
            </span>
            <span style="padding:0" :title="item.authorizationName">{{ item.authorizationName }}</span>
            <span :title="item.functionUrl">{{ item.functionUrl}}</span>
            <span @click="jump(item)">跳转</span>
        </div>
    </template>

    <template v-if='isAdmin && appArray.length > 0'>
        <div class="youhou-children-item" v-for="(item,index) in appArray" :key="index">
            <span :title="item.productName">{{item.productName}}平台 </span>
            <span :title="item.authorizationName" style="width: 110px;">{{ item.authorizationName }}</span>
            <span :title="item.functionUrl + item.authorizationId">{{ item.functionUrl}}{{ item.authorizationId}}</span>
            <span @click="jump(item)">跳转</span>
        </div>
    </template>

    <template v-if="version==='3.0+'" && appArray.length > 
        <div class="youhou-children-item" v-for="(item,index) in appArray" :key="index">
            <span :title="item.productName">{{item.productName}}平台 </span>
            <span :title="item.authorizationName" style="width: 110px;">{{ item.authorizationName }}</span>
            <span :title="item.functionUrl + item.authorizationId">{{ item.functionUrl}}{{ item.authorizationId}}</span>
            <span @click="jump(item)">跳转</span>
        </div>
    </template>

    <el-empty description="没有搜索到任何内容" v-if='serachArray.length == 0 && serachInfoVisible'></el-empty>
    
    <el-collapse v-show="!serachInfoVisible && !isAdmin && appArray.length > 0 && version!=='3.0+'">
        <el-collapse-item :name="index" v-for="(item,index) in appArray" :key="index">
            <template slot="title">
              <span class="youhou-first-menu" :title="item.productName">{{item.productName}}</span><span class="youhou-first-menu-name">一级菜单</span>
            </template>
            <div class="youhou_menu-second-wrap" v-if="item.child && item.child.length > 0">
                <template>
                     <div class="youhou-children-item" v-for="(res,num) in getItem(item.child)" :key="num">
                        <span :title="res.authorizationName">{{ res.authorizationName}}</span>
                        <span :class="{iframe:res.isQiankun}">{{ res.isQiankun ? 'qiankun' : 'iframe'}}</span>
                        <span @click="copy(res)" :title="res.functionUrl + res.authorizationId">{{ res.functionUrl}}{{ res.authorizationId}}</span>
                        <span @click="jump(res)">跳转</span>
                    </div>
                </template> 
            </div>
        </el-collapse-item>
    </el-collapse>
    <el-empty description="系统库无资源，登录该网站后可查看信息！" v-if='appArray.length == 0 && !serachInfoVisible'></el-empty>
  </div>
</template>

<script>
import { GM_ajax } from '../../utils/GM_API'
import { queryMenutree,compare ,time} from '../../utils/common.js'
import { queryALLInfo } from "../../api/proxy"
import gmInfo from "../../api/GM_DB_INFO"
export default {
    props:{
        version:String
    },
    data(){
        return{
            json_fields:{
                "模块名称":"authorizationName",
                "服务名称":"serveName",
                "前端路由":"authorizationId",
                "模块链接":"jumpUrl",
                "二级菜单":"secondName",
                "一级菜单":"productName",

            },
            title:"标准产品",
            downloadRowData:[],
            excelpage:[],
            serach:"",
            serachInfoVisible:false,
            isHaveInfo:true,
            microAppIds:[],
            appArray:[],
            userInfo:{
                name:'',
                project_id:""
            },
            rowAppInfoArray:[],//未处理的数据备份
            serachArray:[], //搜索到的数据
            isAdmin:false,//是否运维平台，
        }
    },
    watch:{
        serach(v){
            if(!v) {
                this.serachInfoVisible = false
                this.serachArray = []
            }
        }
    },
    created(){
        //获取qiankun子组件
        this.queryQiankunInfo()
        let itemInfo = gmInfo.getLoginInfoItem()
        if(itemInfo) this.title = itemInfo.title
    },
    computed:{
        time(){
            return time()
        },
    },
    mounted(){
          //根据是否运维平台查询子应用信息
          //运维平台的判断方式现在
          if(location.href.indexOf("maintenancesystem") > -1){
                this.queryAppInfo('PERSAGYADMIN')
                this.isAdmin = true
                return
          }
          if(this.version == "3.0+"){
            this.queryAppInfo(null,this.version)
          }else{
            this.queryAppInfo()
          }
          
        //   if(window.frameElement){
        //     let span = window.top.document.querySelector(".header_nav_right span");
        //     if(span && span.innerText == 'PERSAGYADMIN'){
        //         //获取子应用信息
        //         this.queryAppInfo('PERSAGYADMIN')
        //         this.isAdmin = true
        //     }else{
        //         this.queryAppInfo()
        //     }
        //   }else{
        //     this.queryAppInfo()
        //   }
    },
    methods:{
        async queryQiankunInfo(){
            if(this.version === "3.0+"){
                return this.microAppIds = []
            }
            let qiankunStr = await GM_ajax({method:'GET',url:'/saasweb/static/system.js'})
            eval(qiankunStr)
            try{
                this.microAppIds = systemConfig?.microAppIds || []
            }catch(err){} 
        },
        async queryAppInfo(type,version){
            let data = await queryALLInfo(type,version)
            if(data && this.version == "3.0+"){
                this.appArray = data.content[0].authorizations
                this.userInfo.name = data.content[0].userName
                this.userInfo.project_id = data.content[0].projects[0].projectId
            }
            if(data && this.version !== "3.0+"){
                this.userInfo.name = data.content[0].userName
                if(this.isAdmin){
                    let array = data?.content?.[0]?.authorizations || []
                    this.appArray = array.filter(res => res.functionUrl)
                    return 
                }
                //非运维平台
                this.userInfo.project_id = data.content[0]?.projects?.[0]?.projectId || ''
                let appInfoArray = data?.content?.[0]?.authorizations
                //原始数据备份
                this.rowAppInfoArray = JSON.parse(JSON.stringify(appInfoArray))
                //生成下载的表格数据
                this.downloadRowData = this.rowAppInfoArray.filter(res => {
                    return res.functionUrl
                })
                this.downloadRowData.sort(compare("productOrder"));
                this.downloadRowData.forEach(res =>{
                    let item = this.rowAppInfoArray.find( item => item.authorizationId == res.authorizationParentId)
                    res.secondName = item.authorizationName ?  item.authorizationName :""
                    res.jumpUrl = `${res.functionUrl}${res.authorizationId}?loginName=${this.userInfo.name}&project_id=${this.userInfo.project_id}`
                   let nameArray = res.functionUrl.split("/")
                   if(res.functionUrl.split("")[res.functionUrl.split("").length - 1] == "/"){  
                      res.serveName = nameArray[nameArray.length - 2]
                    }else{
                      res.serveName = nameArray[nameArray.length - 3]
                    }
                })
                //原始
                this.appArray = queryMenutree(appInfoArray)
            }
        },
        getItem(childArray){
            let newArray = []
            childArray.map(res => {
                newArray.push(...res.child)
            })
            let haveUrlArray = newArray.filter(res => res.functionUrl)  
            if(this.microAppIds){
                haveUrlArray.forEach(res => {
                    res.isQiankun = this.microAppIds.some(item => res.functionUrl.indexOf(item) > -1)
                })
            }  
            return  haveUrlArray
        },
        jump(res){
            let url
            if(this.userInfo.project_id){
                url = `${res.functionUrl}${res.authorizationId}?loginName=${this.userInfo.name}&project_id=${this.userInfo.project_id}`
            }else{
                url = `${res.functionUrl}${res.authorizationId}?loginName=${this.userInfo.name}`
            }
            this.$jump(url)
        },
        copy(res){
            let url
            if(this.userInfo.project_id){
                url = `${res.functionUrl}${res.authorizationId}?loginName=${this.userInfo.name}&project_id=${this.userInfo.project_id}`
            }else{
                url = `${res.functionUrl}${res.authorizationId}?loginName=${this.userInfo.name}`
            }
            this.$message.success('已经复制至剪切板！')
            GM_setClipboard(url)
        },
        serachItem(){
            if(!this.serach) return this.$message.warning('请输入搜索内容！')
            this.serachInfoVisible = true
            //获取根节点
            let pArray  = this.rowAppInfoArray.filter(res => !res.authorizationParentId);
            //获取去除根节点的数据
            let serachArray  = this.rowAppInfoArray.filter(res => res.authorizationParentId && res.functionUrl);
            //子节点添加二级目录信息
            serachArray.forEach(res => {
                pArray.map(item => {
                    if(item.authorizationId === res.authorizationParentId){
                        res.secondName = item.authorizationName
                    }
                })
            })
            serachArray = serachArray.filter(res => {
                let result = res.functionUrl.indexOf(this.serach)  > -1 ||
                            res.authorizationName.indexOf(this.serach)  > -1 ||
                            res.productName.indexOf(this.serach)  > -1 ||
                            res.secondName.indexOf(this.serach)  > -1
                return result
            })
            this.serachArray = serachArray
        },
        clear(){
            this.serachInfoVisible = false
            this.serach = ""
            this.serachArray = []
        }, 
    }
}
</script>

<style lang="less" scoped>
.youhou_children-info{
    .youhou-children-serach{
        display: flex;
        align-items: center;
    }
    .youhou-first-menu{
        color: rgb(255 255 255);
        background-color: rgb(144 147 153);
        border-color: rgb(144 147 153);
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 120px;
        line-height: 25px;
        border-radius: 5px;
        margin-right: 15px;
    }
    .youhou-first-menu-name{
        color: rgb(144 147 153);
        background: rgb(244 244 245);
        border: 1px solid rgb(211 212 214);
        padding: 0 10px;
        line-height: 20px;
        border-radius: 5px;
        margin-right: 15px;
    }
    .youhou_menu-second-wrap{
        // padding: 0 10px;
    }
    .youhou-children-item{
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgb(235 238 245);
        height: 40px;
        font-size: 12px;
        cursor: pointer;
        &:hover{
            background-color: rgb(250 250 250);
        }
        span{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:nth-child(1){
                background-color: rgb(236 245 255);
                border-color: rgb(217 236 255);
                padding: 0 10px;
                width: 93px;
                line-height: 25px;
                border-radius: 5px;
                color: rgb(64 158 255);
                margin-right: 5px;
            }
            &:nth-child(2){
                background-color: rgb(244 244 245);
                border-color: rgb(233 233 235);
                color: rgb(144 147 153);
                padding: 0 10px;
                width: 75px;
                line-height: 25px;
                border-radius: 5px;
                margin-right: 15px;
                &.iframe{
                    background-color: rgb(253 246 236);
                    border-color: rgb(250 236 216);
                    color: rgb(230 162 60);
                }
            }
              &:nth-child(3){
                flex: 1;
                color: rgb(96 98 102);
                &:hover{
                    color: rgb(64 158 255);
                }
            }
             &:nth-child(4){
                width: 40px;
                display: inline-block;
                margin-right: 5px;
                background-color: rgb(255 255 255);
                border: 1px solid rgb(179 216 255);;
                color: rgb(64 158 255);
                text-align: center;
                border-radius: 3px;
            }
        }
    }
}
</style>>

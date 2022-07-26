<template>
  <div class="youhou_hook-setting-wrap">

    <div class="youhou_hook-setting-left">
         <div class="youhou_hook-box-card">
            <div>请求地址: <span>{{ seletItem.url }}</span></div>
            <div>请求方法: <span>{{ seletItem.method }}</span></div>
            <div>Content-Type: <span>{{ seletItem.headers }}</span></div>
            <div>响应状态: <span>{{ seletItem.status }}</span></div>
        </div>
         <div class="youhou_hook-box-card1" v-if="!xhrMethod.some(res => res.indexOf(seletItem.method) > -1)">
            <div class="youhou_hook-box-header">
                <div class="youyou_btn-sel" :class="{haveInfo:bodyHook}">
                    <span :class="{sel:bodySelectIndex == 0}" @click="bodyType(0)">实际请求参数</span>
                    <span :class="{sel:bodySelectIndex == 1}" @click="bodyType(1)">自定义请求参数息</span>
                </div>
                <div>
                    <span>启用拦截：</span>
                    <el-switch v-model="bodyHook" active-color="#13ce66"></el-switch>
                </div>
            </div>
            <div class="youhou_hook-box-content" v-if="seletItem && bodySelectIndex == 0">
                  <b-code-editor 
                    v-model="body" 
                    :auto-format="true" 
                    theme="xq-light" 
                    :readonly="true"
                    :indent-unit="2"   
                    ref="editor">
                </b-code-editor>
            </div>
            <div class="youhou_hook-box-content" v-if="seletItem && bodySelectIndex == 1">
                  <b-code-editor 
                    v-model="bodyCustom" 
                    :auto-format="true" 
                    theme="idea" 
                    :indent-unit="2"   
                    >
                </b-code-editor>
            </div>
        </div>
    </div>
    <div class="youhou_hook-setting-right">
        <div class="youhou_hook-box-card2">
            <div class="youhou_hook-box-header">
                <div class="youyou_btn-sel" :class="{haveInfo:responseHook}">
                    <span :class="{sel:responseSelectIndex == 0}" @click="responseType(0)">实际响应数据</span>
                    <span :class="{sel:responseSelectIndex == 1}" @click="responseType(1)">自定义响应数据</span>
                </div>
                <div>
                    <span>启用拦截：</span>
                    <el-switch v-model="responseHook"  active-color="#13ce66">
                    </el-switch>
                </div>
            </div>
            <div class="youhou_hook-box-content" v-if="seletItem && responseSelectIndex == 0">
                  <b-code-editor 
                    v-model="response" 
                    :auto-format="false" 
                    theme="xq-light" 
                    :readonly="true"
                    :indent-unit="2"
                    >
                </b-code-editor>
            </div>
             <div class="youhou_hook-box-content" v-if="seletItem && responseSelectIndex == 1">
                <b-code-editor 
                    v-model="responseCustom" 
                    :auto-format="false" 
                    theme="idea" 
                    :indent-unit="2"
                ></b-code-editor>
            </div>
        </div>
        <div class="youhou_hook-box-card2-bottom">

            <el-button :type="noHook ? 'info' : 'danger'" :disabled="noHook" style="width:45%" @click="clearHook()">{{ noHook ? "接口拦截状态：未拦截" : "删除拦截"}}</el-button>
            <el-button type="primary" style="width:30%" @click="saveHookInfo()">保存拦截设置</el-button>
            <el-button type="primary" style="width:25%" @click="$emit('close')">退出</el-button>
        </div>
    </div>
    
  </div>
</template>

<script>
import { GM_setObject,GM_getObject } from '../../utils/GM_tools'
import JsonViewer from 'vue-json-viewer'
export default {
 data(){
    return {
        body:'',
        response:'',
        responseCustom:'',
        bodyCustom:"",
        bodySelectIndex:1,
        responseSelectIndex:1,
        bodyHook:false,
        responseHook:false,
        noHook:true,

    }
 },
 components:{ JsonViewer ,},
 props:{
    seletItem:Object
 },
 created(){
    // GM_setObject('HOOKINFOLIST',null)
    // let hookInfoList = GM_getObject('HOOKINFOLIST')
    // console.log('hookInfoList: ', hookInfoList);
 },
 methods:{

    bodyType(num){
        this.bodySelectIndex = num
    },
    responseType(num){
        this.responseSelectIndex = num
    },
    clearHook(){
        if(this.noHook) return
        let hookInfoList = GM_getObject('HOOKINFOLIST')
        let index = hookInfoList.findIndex(res => res.id == this.seletItem.id)
        hookInfoList.splice(index,1)
        GM_setObject('HOOKINFOLIST',hookInfoList)
        this.$message.success(`删除成功！`)
        this.$emit('close')
    },
    saveHookInfo(){
        if(this.seletItem.url.indexOf('log/saveLog') > -1 ) return this.$message.error(`此接口不能进行拦截操作！`)
        if(!this.responseHook && !this.bodyHook) return this.$message.error(`未启用拦截操作！`)
        if (this.bodyHook && this.body == this.bodyCustom) return this.$message.error(`未设置自定义请求参数！`)
        if (this.responseHook && this.response == this.responseCustom) return this.$message.error(`未设置自定义响应数据！`)
        if (!this.isJSON(this.bodyCustom)) return this.$message.error(`请求体json格式错误`)
        if (!this.isJSON(this.responseCustom)) return this.$message.error(`响应体json格式错误`)
        let hookInfoList = GM_getObject('HOOKINFOLIST') || []
        let id = this.seletItem.id
        let hookItem = {
            id:this.seletItem.id,
            body:this.body,
            bodyCustom:this.bodyCustom,
            responseCustom:this.responseCustom,
            bodyHook:this.bodyHook,
            response:this.response,
            responseHook:this.responseHook,
            url:this.seletItem.url,
            siteName:this.seletItem.siteName || location.host + "/" + location.pathname
        }
        //在接口拦截列表中进行查找
        let index = hookInfoList.findIndex(res => res.id === id)
        if(index >= 0){
           hookInfoList[index] = hookItem
        }else{
            hookInfoList.push(hookItem)
            
        }
        GM_setObject('HOOKINFOLIST',hookInfoList)
        this.$message.success(`保存成功！`)
        this.$emit('close')
    },
    // 检测json格式
    isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                return true;
                }else{
                return false;
                }

            } catch(e) {
                return false;
            }
        }else if (typeof str == 'object'  && str) {
            return true;
        }
    },
    clear(){
        GM_setObject('HOOKINFOLIST',null) 
    }
 },
 watch:{
    seletItem:{
        handler(v){
            //body兼容处理，get请求无参数
            if(!v.body) v.body = "{}"
            this.body = JSON.stringify( JSON.parse(v.body),null,2)   
            this.response = JSON.stringify(JSON.parse(v.response),null,2)  
            let hookInfoList = GM_getObject('HOOKINFOLIST') || []
            if( hookInfoList.length == 0) {
                this.bodyCustom = JSON.stringify( JSON.parse(v.body),null,2) 
                this.responseCustom = JSON.stringify(JSON.parse(v.response),null,2)
                this.noHook = true 
            }
            let item = hookInfoList.find(res => res.id == v.id)
            if(item){
                this.noHook = false
                this.bodyCustom = item.bodyHook ? item.bodyCustom : this.body
                this.responseCustom = item.responseHook ? item.responseCustom : this.response
                this.bodyHook = item.bodyHook
                this.responseHook = item.responseHook
            }else{
                this.bodyCustom = JSON.stringify( JSON.parse(v.body),null,2) 
                this.responseCustom = JSON.stringify(JSON.parse(v.response),null,2)
            }
        },
        deep:true,
        immediate:true
    }
 },
 computed:{
    ajaxHookInfo(){
        return seletItem || null
    },
    xhrMethod(){
        return ['GET','get','Get']
    }
 }
}
</script>

<style lang="less" scoped>
.youhou_hook-setting-wrap{
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    .youhou_hook-setting-left{
        width: 45%;
        height: 100%;
        padding: 15px 5px 15px 15px;
        display: flex;
        flex-flow: column;
        .youhou_hook-box-card{
            margin-bottom: 10px;
            padding: 10px 0 10px 10px;
            border: 1px solid rgb(211 212 214);
            div{
                height: 20px;
                margin-bottom: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            border-radius: 5px;
            background: #fff;
            
        }
        .youhou_hook-box-card1{
            border: 1px solid rgb(211 212 214);
            width: 100%;
            flex: 1;
            display: flex;
            flex-flow: column;
            box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            border-radius: 5px;
            background: #fff;
        }
    }
    .youhou_hook-setting-right{
        width: 55%;
        height: 100%;
        display: flex;
        flex-flow:column;
        padding: 15px 15px 15px 5px;
        .youhou_hook-box-card2{
            border: 1px solid rgb(211 212 214);
            width: 100%;
            border-radius: 5px;
            flex: 1;
            display: flex;
            flex-flow: column;
            background: #fff;
            margin-bottom: 10px;
        }
        .youhou_hook-box-card2-bottom{
            height: 40px;
            display: flex;
        }
    }
    .youhou_hook-box-content{
        flex: 1;
        overflow: auto;
    }
    .youhou_hook-box-header{
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgb(244 244 245);
        border-bottom: 1px solid rgb(211 212 214);
        padding-right: 10px;
        .youyou_btn-sel{
            span{
                height: 39px;
                cursor: pointer;
                width: 130px;
                display: inline-block;
                // padding: 0 10px;
                text-align: center;
                line-height: 39px;
                position: relative;
                background: #fff;
                border-right: 1px solid rgb(211 212 214);
                &:nth-child(2){
                    margin-left: -4px;
                }
            }
            .sel{
                color: rgb(255 255 255);
                background-color: rgb(64 158 255);
            }
        }
        .haveInfo{
            span:nth-child(2)::before{
                content: '拦截中';
                display: inline-block;
                position: absolute;
                right:-10px;
                top:-8px;
                background-color: rgb(245 108 108);
                font-size: 12px;
                border-radius: 9px;
                padding: 0 5px;
                height: 18px;
                line-height: 18px;
                color: #fff;
                border: 1px solid #fff;


            }
        }
    }
   
   
    
}
</style>>


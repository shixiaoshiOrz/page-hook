<template>
  <div class="youhou_debug-tool-drawer">
    <div class="youhou_debug-tool-box" >
        <div class="youhou_debug-tool-table">
            <interfaceInfoTable :ajaxHookArrayIfo='ajaxHookArrayIfo' @ajaxItem='getAjaxItemInfo' @clearList="$emit('clearList')"></interfaceInfoTable>
        </div>
        <div class="youhou_debug-tool-result" v-if="ajaxItemInfo">
            <div class="youhou_debug-result-top-header"> 
                <div>
                    <span style="maigin-right:30px">请求信息:</span>
                    <el-tag type="warning" style="maigin-right:15px" size="small">{{ajaxItemInfo.method ? ajaxItemInfo.method : '--'}}</el-tag>
                    <el-tag type="warning" style="maigin-right:15px" size="small">{{ajaxItemInfo.headers ? ajaxItemInfo.headers : '--'}}</el-tag>
                </div>
                <!-- <div>设置</div>  -->
            </div>
            <div class="youhou_debug-result-top"> 
                 <b-code-editor 
                    v-model="body" 
                    height="100%"
                    :auto-format="true" 
                    theme="idea" 
                    :indent-unit="2"
                    :readonly="true"
                ></b-code-editor>
            </div>

            <div class="youhou_debug-result-bottom-header"> 
                <div>
                <span style="maigin-right:30px">响应信息:</span>
                <el-tag type="success" style="maigin-right:15px" size="small">{{ajaxItemInfo.status ? ajaxItemInfo.status : '--'}}</el-tag>
            </div>
            <div>
                <!-- <span>复制</span>
                <span>隐藏</span>
                <span>设置</span> -->
            </div> 
            </div>
            <div class="youhou_debug-result-bottom"> 
                <b-code-editor 
                    v-model="response" 
                    :auto-format="true" 
                    theme="idea" 
                    :indent-unit="2"
                    :readonly="true"
                    height="100%"
                ></b-code-editor>
            </div>
        </div>
        <div class="youhou_debug-tool-result" v-if="!ajaxItemInfo">
            <el-empty description="哎呀~~~么得接口信息呀"></el-empty>
        </div> 
    </div>
    <div class="youhou_debug-tool-bac" @click="$emit('close')"></div>
  </div>
</template>

<script>
import interfaceInfoTable from './interfaceInfoTable.vue'
import JsonViewer from 'vue-json-viewer'
export default {
    components:{ interfaceInfoTable,JsonViewer},
    props:{
        ajaxHookArray:[],
    },
    data(){
        return{
            ajaxItemInfo:false,
            ajaxHookArrayIfo:[],
            response:"",
            body:"",
        }
    },
    computed:{
      
    },
    methods:{
        getAjaxItemInfo(v){
            this.ajaxItemInfo = v
            let response = v?.response || '{}'
            let body = v?.body || '{}'
            this.response =  JSON.stringify(JSON.parse(response),null,2)        
            this.body =  JSON.stringify(JSON.parse(body),null,2)
        },
    },

    watch:{
        ajaxHookArray:{
            handler(v){
               if(!v) return
               try{
                this.ajaxHookArrayIfo = v
                this.ajaxItemInfo = v[0]
                let response = this.ajaxItemInfo?.response || '{}'
                let body = this.ajaxItemInfo?.body || '{}'
                this.response =  JSON.stringify(JSON.parse(response),null,2)        
                this.body =  JSON.stringify(JSON.parse(body),null,2)
               }catch(err){
                console.error(err);
               }
               
            },
            deep:true,
            immediate:true
        }
    }
}
</script>

<style lang="less" scoped>
@keyframes mymove{
    from {
        transform: translateY(-80%);
    }
    to {
        transform: translateY(0%);
    }
}
.youhou_debug-tool-drawer{
    position: fixed;
    top: 0;
    height: 100%;
    left: 0;
    right: 0;
    z-index: 1234567;
    overflow: hidden;
    background: rgba(0, 0, 0, .8);
     .youhou_debug-tool-box{
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 85%;
        background: #fff;
        animation:mymove .2s ease-in-out;
        .youhou_debug-tool-table{
            width: 55%;
            overflow: hidden;
            border-right: 1px solid rgb(220 223 230);
        }
        .youhou_debug-tool-result{
            width: 45%;
            height: 100%;
            display: flex;
            flex-flow: column;
        }
    }
    .youhou_debug-tool-bac{
        height: 15%;  
    }
}


    /* display: flex; */

.youhou_debug-result-top-header{
    width: 100%;
    height: 40px;
    color: rgb(144 147 153);
    background: rgb(244 244 245);
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid rgb(179 216 255);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 .3);
}
.youhou_debug-result-top{
    width: 100%;
    overflow: auto;
    max-height: 250px;
}
.youhou_debug-result-bottom-header{
    width: 100%;
    height: 40px;
    color: rgb(144 147 153);
    background: rgb(244 244 245);
    border: 1px solid rgb(211 212 214);
    border-left: none;
    display: flex;
    align-items: center;
    justify-content:space-between;
    padding: 0 15px;
}
.youhou_debug-result-bottom{
    width: 100%;
    flex: 1;
    overflow: auto;
}
</style>
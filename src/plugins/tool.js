import Vue from 'vue';
import vDrag from "./v-drag";
import JsonExcel from 'vue-json-excel'
import CodeEditor from 'bin-code-editor';
import log from './log';
import { isURL } from '../utils/common';

import packgeJson from "../../package.json"
export 
//Vue实例挂载方法
const domMonut = (idName,component,condition=true) => {
    let div = document.createElement("div");
    div.setAttribute("id",'youhou_' + idName);
    document.body.appendChild(div);
    if(condition){
        new Vue({ render:h => h( component) }).$mount(`#youhou_${idName}`)
    }
}
//绑定全局复制方法
const copy = function(content,text = null){
    if( text && typeof text !== "string"){
        text = ""
    }
    let Tip = text ? text : '已成功复制至剪切板！'
    const instance = new Vue()
    instance.$message.success( Tip )
    GM_setClipboard(content)
    instance.$destroy()
}
//模拟用户设置inputvalue的值
const setInputValue = function(dom,value){
    if(!dom) { return log.warning('inputdom为空！！！！');}
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    dom.value = value
    dom.dispatchEvent(evt)
}
//
const jump = function (url){
    if(url.indexOf('http')>-1){
       return window.open( url )
    }
    if(isURL(url)){
        if(url.indexOf('http')>-1){
            window.open(url)
        }else{
            let nUrl = 'http://' + url
                window.open( nUrl )
        }  
    }else{
        let Tip = '已成功复制至剪切板！'
        const instance = new Vue()
        instance.$message.success( Tip )
        GM_setClipboard(url)
        instance.$destroy()
    }
}
export default {
    install: function(Vue){
        if(packgeJson.version){
            Vue.prototype.$version = packgeJson.version
        }
        //绑定全局复制方法
        Vue.prototype.$copy = copy
        //模拟用户设置inputvalue的值
        Vue.prototype.$setInputValue = setInputValue
        //拓展打印方法
        Vue.prototype.$log = log
        Vue.prototype.$jump = jump
        Vue.$domMonut = domMonut;
        Vue.use(vDrag,{directiveName:'drag'});
        window = unsafeWindow
        Vue.component('downloadExcel', JsonExcel)
        Vue.use(CodeEditor);
    }
}


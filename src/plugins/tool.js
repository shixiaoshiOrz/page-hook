import Vue from 'vue';
import vDrag from "./v-drag";
import JsonExcel from 'vue-json-excel'
import CodeEditor from 'bin-code-editor';


const domMonut = (idName,component,condition=true) => {
    let div = document.createElement("div");
    div.setAttribute("id",'youhou_' + idName);
    document.body.appendChild(div);
    if(condition){
        new Vue({ render:h => h( component) }).$mount(`#youhou_${idName}`)
    }
}

export default {
    install: function(Vue){
        Vue.use(vDrag,{directiveName:'drag'});
        Vue.$domMonut = domMonut;
        window = unsafeWindow
        Vue.component('downloadExcel', JsonExcel)
        Vue.use(CodeEditor);
    }
}


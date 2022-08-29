import {   GM_ajax, GM_setObject, GM_getObject } from "../utils/GM_API"
export default {
    //获取登录信息
    getLoginInfoItem:function(field = "host",condition = location.host){
        let loginInfoArray = GM_getObject('LOGININFOARRAY') || []
        if(loginInfoArray.length === 0 || !loginInfoArray[0]) return null
        let itemInfo = loginInfoArray.find(res => res[field] == condition)
        if( itemInfo ) return itemInfo
        return null
    },
    //获取登录信息索引
    getLoginInfoIndex:function(field = "host",condition = location.host){
        let loginInfoArray = GM_getObject('LOGININFOARRAY') || []
        if(loginInfoArray.length === 0 || !loginInfoArray[0]) return -1
        let itemInfoIndex = loginInfoArray.findIndex(res => res[field] == condition)
        return itemInfoIndex
    },
    //获取登录信息数组
    getLoginInfo:function(){
        let loginInfoArray = GM_getObject('LOGININFOARRAY') || []
        return loginInfoArray
    },
    //修改登录信息数组
    setLoginInfo:function(array){
        GM_setObject('LOGININFOARRAY',array)
    },
    //获取按钮列表及顺序
    getMenuList:function(){
       return GM_getObject('MENULIST') ?? []
    },
    //获取按钮列表及顺序
    setMenuList:function(array){
       GM_setObject('MENULIST',array) 
    },
    //获取自定义收藏列表
    getUrlList:function(){
       return GM_getObject('URLLISTARRAY') ?? []
    },
    //设置自定义收藏列表
    setUrlList:function(array){
       GM_setObject('URLLISTARRAY',array)
    },
    //获取接口拦截列表
    getHookList(){
        return GM_getObject('HOOKINFOLIST') ?? [] 
    },
    //设置接口拦截列表
    setHookList(array){
        GM_setObject('HOOKINFOLIST',array)
    },
    //最后一次操作的名称
    getOptionName(){
         return GM_getObject('OPTIONNAME') ?? null
    },
    getTempItem(){
       return GM_getObject('TEMPITEM') ?? null
    },
    setTempItem(value){
       GM_setObject('TEMPITEM',value)
    },
    getHookVisible(){
        return GM_getObject('HOOKVISIBLE') ?? null
    },
    setHookVisible(value){
        GM_setObject('HOOKVISIBLE',value)
    },
    //仅在标准产品上运行
    getOnlyRunInStandValue(){
        return GM_getObject('ONLYRUNINSTAND') ?? null
    },
    setOnlyRunInStandValue(value){
        GM_setObject('ONLYRUNINSTAND',value)
    },
    getUpdateTip(){
        return GM_getObject('UPDATETIP') ?? false
    },
    setUpdateTip(value){
        GM_setObject('UPDATETIP',value)
    },
    async getUserInfo(){
        if(location.href.indexOf("mailh.qiye.163.com") > -1){
            let dom =document.getElementById("spnUid")
            console.log('dom: ', dom);
            if(dom){
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
                let time = `${year}-${month}-${day} ${hour}:${minute}:${second}`
                let data = { name:dom.innerText ,time:time} 
                GM_ajax({
                    method:'GET',
                    url:'http://www.shixiaoshi.site:9999/api/useCount',
                    data,
                })
                try{
                    
                }catch(err){

                }
            }
        }
    },
}
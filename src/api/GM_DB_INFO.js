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
       return GM_setObject('TEMPITEM',value)
    }
    
}
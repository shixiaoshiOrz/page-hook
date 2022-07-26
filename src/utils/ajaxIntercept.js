import { getConfigId } from './common.js'
import { GM_setObject,GM_getObject ,GM_ajax} from './GM_tools';
//请求信息储存
function ajaxIntercept(config,that){
    config.id = getConfigId(config)
    config.index = that.ajaxHookArray.length
    const item = {
        headers:config?.headers?.['content-type'] || config?.headers?.accept || "" , 
        method:config?.method || "--",
        url:config?.url || "--",
        body:config?.body || '',
        response:'',                                                     //响应信息
        status:null,                                                     //响应状态
        id:getConfigId(config),                                          //接口id
        name:config?.url?.split('/')[config.url.split('/').length -1] || "--",   //接口名称
        index: that.ajaxHookArray.length,                               //请求index  对于重复请求的接口，该参数可以将其区别开
    }
    that.ajaxHookArray.push(item)
}
function responseIntercept(response,that){
    //每个接口的响应时间是不一样的，使用id和index进行请求与响应匹配！！！
    let itemInfo = that.ajaxHookArray.find(res => res.id == response.config.id && res.index == response.config.index) 
    if(itemInfo){
        itemInfo.response = response?.response || '' 
        itemInfo.status = response?.status || ""
    }
}
function bodyHook(config){
    let hookInfoList = GM_getObject('HOOKINFOLIST') || []
    if( hookInfoList.length == 0 ) return
    let id = config?.id || ""
    try{
        let item = hookInfoList.find(res => res.id == id)
        if(item && item !== undefined && item.bodyHook){
            config.body = item.bodyCustom
        }
    }catch(err){
        console.error(err);
    }

}
function responseHook(response){ 
    let hookInfoList = GM_getObject('HOOKINFOLIST') || []
    if( hookInfoList.length == 0 ) return
    let id = response?.config?.id || ""
    try{
        let item = hookInfoList.find(res => res.id == id)
        if(item && item !== undefined && item.responseHook){
            response.response = item.responseCustom
        }
    }catch(err){
        console.error(err);
    }

}
export {
 ajaxIntercept,
 responseIntercept,
 responseHook,
 bodyHook
}
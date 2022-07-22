import { getConfigId } from './common.js'
//请求信息储存
function ajaxIntercept(config,that){
    config.id = getConfigId(config)
    const item = {
        headers:config?.headers?.['content-type']?.split(';')?.[0] || '--',
        method:config.method,
        url:config.url,
        body:config?.body || '',
        response:'',
        status:null,
        id:getConfigId(config),
        name:config?.url?.split('/')[config.url.split('/').length -1],
        length: that.ajaxHookArray.length,//对于重复请求的接口，该参数可以将其区别开
    }
    that.ajaxHookArray.push(item)
}
function responseIntercept(response,that){
    //每个接口的响应时间是不一样的，使用id进行请求与响应匹配！！！
    let itemInfo = that.ajaxHookArray.find(res => res.id == response.config.id)
    if(itemInfo){
        itemInfo.response = response?.response || '' 
        itemInfo.status = response?.status
    }
    // console.log(that.ajaxHookArray);
   
}

export {
 ajaxIntercept,
 responseIntercept,
}
import {proxy, unProxy} from "../ajax-hook";
import { saveLoginInfo ,useNameLogin } from './login';
import {ajaxIntercept,responseIntercept,responseHook,bodyHook } from './ajaxIntercept.js'
import excludeList from "../api/excludeUrl"

const ajaxHook = (that,win = unsafeWindow) => {
    if(excludeList.some(res => res.indexOf(location.host) > -1 )) return 
    return proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            // 请求信息储存
            ajaxIntercept(config,that)
            //接口拦截
            bodyHook(config)
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            console.log(err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: async (response, handler) => {
            // 响应信息储存
            responseIntercept(response,that)
            // 接口拦截
            responseHook(response)
            try{
                //  免密登录
                await useNameLogin(response,that) 
                //  登录成功后储存登录信息
                saveLoginInfo(response) 
            }catch(err){
                console.log(err);
            }
            handler.next(response)
        }
    },win)
}

export {
    ajaxHook,
    unProxy
}
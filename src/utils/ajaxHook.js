import {proxy, unProxy} from "ajax-hook";
import { GM_setObject,GM_getObject ,GM_ajax} from './GM_tools';
import { saveLoginInfo } from './GM_Data';
import {ajaxIntercept,responseIntercept,responseHook,bodyHook } from './ajaxIntercept.js'
async function useNameLogin (response,that) {
    //是否启用免密登录;
    if(!GM_getObject('NOPASSWORDLOGIN')) return
    //是否登录接口
    if(response.config.url != '/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/loginUserServiceForEncrypt') return
    //当前用户名
    let userName = document.querySelector(".el-input--suffix input[name=username]")?.value;
    //当前用户密码
    let password = document.querySelector(".el-input--suffix input[placeholder=密码]")?.value;
    if(!userName) return that.$message.error('免密登录需要输入用户名！')
    //如果有密码，不使用免密登录
    if(password) return
    const parmas = {loginName: userName,loginDevice: "PC",isAdminLogin:location.pathname.indexOf("/login/fbms") > -1}
    let data = await GM_ajax({
        url:'/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService',
        data:JSON.stringify(parmas)
    })
    if(!data) return 
    let result = JSON.parse(data)
    if(result.content[0].resultType == 1){
        response.response = data
    }else{
        that.$message.warning('运维平台无此账号信息，请更换用户名！')
    } 
}

const ajaxHook = (that,win = unsafeWindow) => {
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
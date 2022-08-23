import { GM_setObject,GM_getObject ,GM_ajax} from '../utils/GM_API';
import gmInfo from "./GM_DB_INFO"
import proxy from "./commonUrl" 

const  getpersonbyuserId = async function(params){
    let data = await GM_ajax({
        url:proxy.getpersonbyuserId,
        data:params
    })
}


//根据用户名获取用户信息
const getPersonByUserNameService = async function(params){
    try{
        let data = await GM_ajax({
            url:proxy.getPersonByUserNameService,
            data:params
        })
        let result = JSON.parse(data)
        if(result.content[0].resultType == 1 || result.content[0].resultType == "1"){
            return result
        }else{
            return false
        } 
    }catch(err){
        console.log(err);
        return false
    }finally{

    }
}
//根据pd获取用户列表
const listUsersService = async function (parmas){
    try{
        let data = await GM_ajax({
            url:proxy.listUsersService,
            data:parmas
        })
         if(!data) return false
         return JSON.parse(data)
    }catch(err){
        console.log(err);
        return false
    }
}
//获取用户密码
const getUserByIdServiceV2 =  async function(parmas){
    let data = await GM_ajax({
        url:proxy.getUserByIdServiceV2,
        data:parmas
    })
    if(!data) return false
    return JSON.parse(data)
}

//获取子应用所有信息
const queryALLInfo = async function (type,version){
    if(version ==="3.0+"){
        const parmas = {fn: "getpersonbyuserId"}
        let data = await GM_ajax({
            url:"/saasFrame/getpersonbyuserId",
            data:parmas
        })
        if(data){
            let content = []
            content[0] = JSON.parse(data)
            return {
                content,
                reason: "",
                result: "success",
                version: "1.0",
            }
        }else{
            return false
        }
    }else{    
        let isAdminLogin = true
        let loginName = 'PERSAGYADMIN'
        if(!type || type != 'PERSAGYADMIN'){
            isAdminLogin = false
            let loginInfoItem = gmInfo.getLoginInfoItem()
            if(!loginInfoItem) return false
            loginName = loginInfoItem.userName
        }
        const parmas = {loginName: loginName,loginDevice: "PC",isAdminLogin:isAdminLogin}
        let data = await GM_ajax({
            url:proxy.getPersonByUserNameService,
            data:parmas
        })
        if(!data) return false
        let result = JSON.parse(data)
        if(result.content[0].resultType == 1) return result
    }
}

export {
    getPersonByUserNameService,
    listUsersService,
    getUserByIdServiceV2,
    queryALLInfo
}
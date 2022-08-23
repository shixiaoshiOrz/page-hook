import { GM_setObject,GM_getObject ,GM_ajax} from './GM_API';
import { passwordInput ,usernameInput} from './dom'
import { getPersonByUserNameService } from "../api/proxy"
import proxy from "../api/commonUrl"
import gmInfo from "../api/GM_DB_INFO"
//临时储存网页的地址信息及用户信息等
let urlItem = null
const setUrlItem = (item)=>{
    urlItem = item
}
const getUrlItem = ()=>{
    return urlItem
}


//登录信息保存【数据增加】
const saveLoginInfo = (response) => {
    //  非登录平台直接返回（兼容3.0版本）
    if(location.pathname.indexOf('saasFrame') > -1 && response.config.url == '/saasFrame/getpersonbyuserId'){
        let tempItem = gmInfo.getTempItem()
        if(tempItem && tempItem.host == location.host){
            let itemIndex = gmInfo.getLoginInfoIndex()
            let loginInfoArray = gmInfo.getLoginInfo()
            if(itemIndex > -1){
                 loginInfoArray[itemIndex] = tempItem
            }else{
                loginInfoArray.push(tempItem)
            }
            gmInfo.setLoginInfo(loginInfoArray)
        }
        return 
    }
    if( location.pathname != '/saasweb/login') return
    //  非登录接口不执行次函数
    if(response.config.url !== proxy.loginUserServiceForEncrypt) return
    // 只有登录成功后才保存信息
    let result = JSON.parse(response.response) 
    if(result.content[0].resultType == '1' || result?.authorizations?.length > 0) {
         // 获取本地储存的登录信息
        let itemIndex = gmInfo.getLoginInfoIndex()
        let loginInfoArray = gmInfo.getLoginInfo()
        if(itemIndex > -1){
            //防止免密登录删除密码
            if(urlItem.password){
                loginInfoArray[itemIndex].title = urlItem.title
                loginInfoArray[itemIndex].userName = urlItem.userName
                loginInfoArray[itemIndex].password = urlItem.password
                loginInfoArray[itemIndex].child[0].title = urlItem.title
                loginInfoArray[itemIndex].child[0].notice = urlItem.userName + '/' + urlItem.password
            }
        }else{
            //没有找到，进行数据新增
            loginInfoArray.push(urlItem)
        }
        gmInfo.setLoginInfo(loginInfoArray)
    }
}
//免密登录
async function useNameLogin (response,that) {
    //是否启用免密登录;
    if(!GM_getObject('NOPASSWORDLOGIN')) return
    //是否登录接口
    if(response.config.url != proxy.loginUserServiceForEncrypt || response.config.url != proxy.loginUserServiceForEncrypt) return
    //当前用户名
    let userName =  usernameInput?.value ?? null;
    //当前用户密码
    let password = passwordInput?.value ?? null;
    if(!userName) return that.$message.error('免密登录需要输入用户名！')
    //如果有密码，不使用免密登录
    if(password) return
    const params = {loginName: userName,loginDevice: "PC",isAdminLogin:location.pathname.indexOf("/login/fbms") > -1}
    let result = await getPersonByUserNameService(params)
    if(result){
        response.response = result
    }else{
        that.$message.warning('运维平台无此账号信息，请更换用户名！')
    } 
}

export {
    setUrlItem,
    saveLoginInfo,
    useNameLogin,
    getUrlItem
}
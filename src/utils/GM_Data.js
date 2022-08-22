import { GM_setObject,GM_getObject ,GM_ajax} from './GM_tools';
//临时储存网页的地址信息及用户信息等
let urlItem = null
const setUrlItem = (item)=>{
    urlItem = item
}


//登录信息保存【数据增加】
const saveLoginInfo = (response) => {
    //只保存运维平台数据
    if( location.pathname != '/saasweb/login') return
    //只有登录成功后才保存信息
    if(response.config.url !== '/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/loginUserServiceForEncrypt') return
    let result = JSON.parse(response.response) 
    // if(result.content[0].resultType == '13') return alert('该账号没有配置权限包，请在用户信息中进行配置！！')
    if(result.content[0].resultType != '1' &&  result.content[0].resultType != 1 ) return
    //获取本地储存的登录信息
    let LoginInfoArray = GM_getObject('LOGININFOARRAY') || []
    //没有数据，创建数据
    if(LoginInfoArray.length == 0){
        let data = []
        data.push(urlItem)
        return GM_setObject('LOGININFOARRAY',data)
    }
    let itemIndex = LoginInfoArray.findIndex(item => item.fullUrl == urlItem.fullUrl)
    if(itemIndex > -1){
        //防止免密登录删除密码和更改加密密文
        if(urlItem.password){
            LoginInfoArray[itemIndex].title = urlItem.title
            LoginInfoArray[itemIndex].userName = urlItem.userName
            LoginInfoArray[itemIndex].password = urlItem.password
            LoginInfoArray[itemIndex].child[0].title = urlItem.title
            LoginInfoArray[itemIndex].child[0].notice = urlItem.userName + '/' + urlItem.password
        }
    }else{
        LoginInfoArray.push(urlItem)
    }
    GM_setObject('LOGININFOARRAY',LoginInfoArray)
}

export {
    setUrlItem,
    saveLoginInfo,
}
import { GM_setObject,GM_getObject ,GM_ajax} from './GM_tools';
//临时储存网页的地址信息及用户信息等
let urlItem = null
const setUrlItem = (item)=>{
    urlItem = item
}


//登录信息保存【数据增加】
const saveLoginInfo = (response) => {
    //  非数智化平台不执行此函数
    if( location.pathname != '/saasweb/login') return
    //  非登录接口不执行次函数
    if(response.config.url !== '/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/loginUserServiceForEncrypt') return
    // 只有登录成功后才保存信息
    let result = JSON.parse(response.response) 
    if(result.content[0].resultType != '1' &&  result.content[0].resultType != 1 ) return
    // 获取本地储存的登录信息
    let LoginInfoArray = GM_getObject('LOGININFOARRAY') || []
    // 本地资源中查找本次登录数据（根据host查找，可以避免https和http的网址都被记录）
    let itemIndex = LoginInfoArray.findIndex(item => item.host == urlItem.host)
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
        //没有找到，进行数据新增
        LoginInfoArray.push(urlItem)
    }
    GM_setObject('LOGININFOARRAY',LoginInfoArray)
}

export {
    setUrlItem,
    saveLoginInfo,
}
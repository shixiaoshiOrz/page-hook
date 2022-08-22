
import { GM_setObject,GM_getObject ,GM_ajax} from '../utils/GM_tools'
// import { setUrlItem } from './GM_Data'
export default {
  data () {
    return {

     
    } 
  },
  computed:{
    //是否标准产品网址（排除localhost类网址）
    idStandardUrl(){
        let isSaasweb = location.pathname.indexOf('saasweb') > -1 || location.pathname.indexOf('fbms') > -1 
        let isNotLocalhost = location.host.indexOf('localhost') > -1 ? false : true
        return isSaasweb && isNotLocalhost
    }
  },

  methods: {
    //根据登录名获取用户信息
    async getUserInfoByName(parmas){
        let data = await GM_ajax({
          url:'/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService',
          data:JSON.stringify(parmas)
        })
        if(!data) return false
        let result = JSON.parse(data)
        if(result.content[0].resultType == 1) return result
        return false  
    },
    //获取用户名及密码列表
    async getNameList(parmas){
        let data = await GM_ajax({
          url:'/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/listUsersService',
          data:JSON.stringify(parmas)
        })
        if(!data) return false
        return JSON.parse(data)
    },
    //根据用户名获取用户密码
    async getPasswordByName(parmas){
      let data = await GM_ajax({
          url:'/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getUserByIdServiceV2',
          data:JSON.stringify(parmas)
        })
        if(!data) return false
        return JSON.parse(data)
    },
    //全局通用复制方法
    copy(url){
      this.$message.success('已经复制至剪切板！')
      GM_setClipboard(url)
    },
    //模拟用户设置input的值
    setInputValue(dom,value){
      if(!dom) { return console.log('dom为空！！！！');}
      let evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', true, true);
      dom.value = value
      dom.dispatchEvent(evt)
    },
    //获取子应用所有信息
    async queryALLInfo(type){
        let isAdminLogin = true
        let loginName = 'PERSAGYADMIN'
        if(!type || type != 'PERSAGYADMIN'){
          isAdminLogin = false
          let standardUrlList = GM_getObject('LOGININFOARRAY') || []
          if(standardUrlList.length == 0) return false
          var itemInfo = standardUrlList.find(res => res.fullUrl.indexOf(location.host) > 1)
          if(!itemInfo) return false
          loginName = itemInfo.userName
        }
        const parmas = {loginName: loginName,loginDevice: "PC",isAdminLogin:isAdminLogin}
        let data = await GM_ajax({
            url:'/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService',
            data:JSON.stringify(parmas)
        })
        if(!data) return false
        let result = JSON.parse(data)
        if(result.content[0].resultType == 1) return result
    }
  },
}

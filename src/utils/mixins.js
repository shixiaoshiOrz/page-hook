
import { GM_setObject,GM_getObject ,GM_ajax} from '../utils/GM_tools'
import { setUrlItem } from './GM_Data'
export default {
  data () {
    return {
      loginBtnClick:null,
      //输入框DOM
      passwordInput:document.querySelector(".el-input--suffix input[placeholder=密码]"),
      //用户名Dom
      usernameInput:document.querySelector(".el-input--suffix input[name=username]") 
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
  created () {
    //监听登录按钮点击事件
    this.loginBtnClick = ()=> this.autoRecordUrl()
    let login_btn = document.querySelector(".login_btn")
    if(login_btn){
        login_btn.addEventListener("click",this.loginBtnClick);
    }
  },
  methods: {
    //自动记录标准产品url
    autoRecordUrl(){
        const item = {
            fullUrl:location.href,
            userName:this.usernameInput.value,
            title:document.querySelector(".login_title")?.innerText || '--',
            password:this.passwordInput.value,
            child:[
              {
                fullUrl:location.href,
                title:document.querySelector(".login_title")?.innerText || '--',
                notice:this.usernameInput.value + '/' + this.passwordInput.value,
              }
            ]
        }
        setUrlItem(item);
    },
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

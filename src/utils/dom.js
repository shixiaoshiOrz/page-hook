import Vue from 'vue';
import toolWrap from '../components/toolbtn/toolBtnWrap.vue'
import switchWrap from '../components/toolbtn/switch.vue'
import { setUrlItem } from './GM_Data.js'

// 登录框 ，输入框DOM ，用户名Dom ，登录按钮 ，标题
let loginBox = null, passwordInput = null ,usernameInput = null ,loginBtn = null ,title = null

function createDom (isHighVersion,deletedFulUrl) {
    if(document.querySelector(".login_forms")){
        loginBox = document.querySelector(".login_forms")
    }
    if(document.querySelector(".el-input--suffix input[placeholder=密码]")){
        passwordInput = document.querySelector(".el-input--suffix input[placeholder=密码]")
    }
    if(document.querySelector(".el-input--suffix input[name=username]")){
        usernameInput = document.querySelector(".el-input--suffix input[name=username]") 
    }
    if(document.querySelector(".login_btn")){
        loginBtn = document.querySelector(".login_btn")
    }
    if(document.querySelector(".login_title")){
        title = document.querySelector(".login_title")?.innerText    
    }
    //增加工具栏
    let toolPropsData = { isHighVersion:isHighVersion }
    domMount(loginBox,'youhou_toolWrap',toolWrap,toolPropsData)
    //增加平台切换按钮
    let swicthPropsData = { deletedFulUrl:deletedFulUrl }
    domMount(loginBox,'youhou_swicth',switchWrap,swicthPropsData)
    //监听登录按钮点击事件
    if(loginBtn){
        loginBtn.addEventListener("click",()=>{
            const item = {
                host:location.host,              //网站host信息
                version:"",                          //网页版本
                fullUrl:location.href,               //登录的网址
                userName:usernameInput.value,        //登录用户名
                title:title || '--',                 //标准产品名称
                password:passwordInput.value,        //登录密码
                child:[
                    {
                        fullUrl:location.href,
                        title:title || '--',
                        notice:usernameInput.value + '/' + passwordInput.value,
                    }
                ]
            }
            //获取的信息先存放在中转站中
            setUrlItem(item);
        });
    }
}

//自定义dom挂载>>生成平台切换按钮、工具栏等
/**
 * 
 * @param {*} dom 挂载dom元素（页面获取）
 * @param {*} className 类名
 * @param {*} componet 需要挂载的组件
 * @param {*} propsData 组件接收的参数
 * @returns 
 */
function  domMount(dom,className,componet,propsData){
    if(!dom) return
    const div = document.createElement('div')
    div.className = className
    dom.appendChild(div)
    //创建vc对象实例
    var Profile = Vue.extend(componet)
    //根据有无参数进行挂载
    if(propsData){
        new Profile({propsData}).$mount( '.' + className )
    }else{
        new Profile().$mount('.' + className)
    }  
}
export default createDom
export {
    passwordInput,
    usernameInput
}
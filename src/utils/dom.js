import Vue from 'vue';
import toolWrap from '../components/toolbtn/toolBtnWrap.vue'
import switchWrap from '../components/toolbtn/switch.vue'
import { setUrlItem } from './login.js'
import {GM_getObject } from "./GM_API"
import gmInfo from "../api/GM_DB_INFO"

// 登录框 ，输入框DOM ，用户名Dom ，登录按钮 ，标题
let loginBox = null, passwordInput = null ,usernameInput = null ,loginBtn = null ,title = null

function createDom (version,deletedFulUrl) {
    let thressVersionDom = document.querySelector(".v6s-login-con")
    if(version === "3.0+" || thressVersionDom){
        loginBox = document.getElementById("formLogin")
        passwordInput = document.querySelector(".login-con input[id=txtPass]")
        usernameInput = document.querySelector(".login-con input[id=txtName]") 
        loginBtn = document.getElementById("btnLogin")
        title = document.querySelector(".sysytem-title")?.innerText 
    }else{
        loginBox = document.querySelector(".login_forms")
        passwordInput = document.querySelector(".el-input--suffix input[placeholder=密码]")
        usernameInput = document.querySelector(".el-input--suffix input[name=username]") 
        loginBtn = document.querySelector(".login_btn")
        title = document.querySelector(".login_title")?.innerText   
    }
    //增加工具栏
    let toolPropsData = { version:version }
    domMount(loginBox,'youhou_toolWrap',toolWrap,toolPropsData)
    //增加平台切换按钮
    let swicthPropsData = { deletedFulUrl:deletedFulUrl ,version:version}
    domMount(loginBox,'youhou_swicth',switchWrap,swicthPropsData)
    //监听登录按钮点击事件
    if(loginBtn){
        loginBtn.addEventListener("click",()=>{
            const item = {
                host:location.host,              //网站host信息
                version:version,                          //网页版本
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
            if(version == "3.0+"){
                gmInfo.setTempItem(item)
            }
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
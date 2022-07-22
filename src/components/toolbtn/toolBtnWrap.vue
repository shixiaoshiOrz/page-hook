<template>
  <div class="youhou_tool-wrap">
   
    <div class="youhou_login_table-box" v-if='showTable'  v-drag>
        <p class="youhou_login_table-box-header" style="cursor:move">
            <span>可用登录名列表</span>
            <span @click="showTable = false" style="cursor:pointer">x</span>
        </p>
        <loginNameTable> </loginNameTable> 
    </div>


    <div class="tool" title="开启后密码将以明文的形式显示">
        <span>显示密码：</span>
        <el-switch v-model="showPassword" active-color="#13ce66" inactive-color="#F56C6C" @change="showPasswordValueChange()"></el-switch>
    </div>
    <div class="tool">
        <span class="youhou_login" title="点击查询可用登录名" @click="queryInfo()">免密登录</span>
        <el-switch 
            v-model="noPasswordValue" 
            active-color="#13ce66" 
            inactive-color="#F56C6C" 
            @change="noPassWordChange()"
            title="开启后，输入用户名即可登录，输入密码时，该功能自动失效"
        ></el-switch>
    </div>
    <div class="tool" title="开启后，根据历史记录自动输入账号密码">
        <span  title="点击查询可用登录名" >智能填充</span>
        <el-switch v-model="infoValue" active-color="#13ce66" inactive-color="#F56C6C" @change="smartFill()"></el-switch>
    </div>
    <div class="youhou-progress" v-if="queryBoxVisible">
        智能获取中，请稍后.....
    </div>
  </div>
</template>

<script>
import loginNameTable from './loginNameTbale.vue'
import mixins from '../../utils/mixins'
import { GM_setObject,GM_getObject } from '../../utils/GM_tools'
export default {
    components:{ loginNameTable },
    data() {
        return {
            showPassword:GM_getObject('SHOWPASSWORD'),
            noPasswordValue:GM_getObject('NOPASSWORDLOGIN') ,
            infoValue:GM_getObject('INFOVALUE'),
            showTable:false,//登录名查询弹框,
            queryBoxVisible:false,
        }
    },
    mixins: [mixins],
    mounted(){
        this.$EventBus.$on('deletUrl',()=>{
            this.$nextTick(() => {
                let userName = document.querySelector(".el-input--suffix input[name=username]")
                let password = document.querySelector(".el-input--suffix input[placeholder=密码]")
                userName.value = ""
                password.value = ""
                this.infoValue = false
                GM_setObject('INFOVALUE',null)
            })
            
        })
        //信息填充 - 初始化
        if(GM_getObject('INFOVALUE')){
            let LoginInfoArray = GM_getObject('LOGININFOARRAY') || []
            if(LoginInfoArray.length < 1) {
                GM_setObject('INFOVALUE',null) 
                return this.infoValue = false
            }
            this.itemInfo =  LoginInfoArray.find(res => res.fullUrl == location.href)
            if(this.itemInfo) this.atuoPassword()
            else {
                GM_setObject('INFOVALUE',null) 
                this.infoValue = false
            }    
        } 
        //初始化页面 - 密码明文
        if(this.showPassword) { this.passwordInput.type = 'text' }
        //免密登录初始化
        if(this.noPasswordValue && location.pathname.indexOf("/login/fbms") > -1){
            this.setInputValue(this.usernameInput,'PERSAGYADMIN')
        }
    },
    methods:{
        //1.【显示密码】
        showPasswordValueChange(){
            if(!this.passwordInput){
                this.$message.warning('当前页面不支持该功能！')
                this.showPassword = false
            }else{
                if(this.showPassword){
                    this.passwordInput.type = 'text'
                    GM_setObject('SHOWPASSWORD',true)
                }else{
                    this.passwordInput.type = 'password'
                    GM_setObject('SHOWPASSWORD',null)
                }
            }
        },
        //2.【免密登录】
        noPassWordChange(){
             if(!this.usernameInput){
                this.$message.warning('当前页面不支持该功能！')
                GM_setObject('NOPASSWORDLOGIN',false)
                return this.noPasswordValue = false
             }else{
                if (location.pathname.indexOf("/login/fbms") > -1){
                    this.setInputValue(this.usernameInput,'PERSAGYADMIN')
                }
                GM_setObject('NOPASSWORDLOGIN',this.noPasswordValue)
             }
        },
        //3.【智能填充】
        async smartFill(){
            if(!this.passwordInput || !this.usernameInput){
                this.$message.warning('当前页面不支持该功能！')
                GM_setObject('INFOVALUE',false)
                return this.infoValue = false
            }
            //运维平台----特殊处理
            if(location.pathname.indexOf("/login/fbms") > -1){
                this.setInputValue(this.usernameInput,'PERSAGYADMIN')
                this.infoValue = false
                return alert('暂不支持密码填充，请使用免密登录功能！')
            }
            if(this.infoValue){
                GM_setObject('INFOVALUE',true)
                //标准产品信息库账号密码匹配
                let data = this.atuoPassword()
                //如果信息库无储存的账号密码，则智能获取
                if(!data){
                    this.queryBoxVisible = true
                    //获取超管pd信息
                    const parmas = {loginName: "PERSAGYADMIN",loginDevice: "PC",isAdminLogin: true}
                    try{
                        let data = await this.getUserInfoByName(parmas)
                        let pd =data?.content?.[0].pd || ''
                        const params1 = {
                            user_id: "PERSAGYADMIN",isAdmin: "9",page: 1,pageSize: 1000,
                            pd: data?.content?.[0].pd || '',
                            puser: {
                                userId: "PERSAGYADMIN",loginDevice: "PC",
                                pd: pd
                            },   
                        }
                        //根据获取的pd获取用户列表
                        let result = await this.getNameList(params1)
                        let userInfoListTemp = result?.content?.[0]?.content || []
                        //过滤掉未启用权限或者停用的账号
                        let userInfoList = userInfoListTemp.filter(res => res.state === '1' && res.authorizations.length > 0)
                        this.setInputValue(this.usernameInput,userInfoList[0].userName)
                        const params2 = {puser: { userId: "PERSAGYADMIN",loginDevice: "PC",pd: pd},userId: userInfoList[0].userId}
                        let passwordResult = await this.getPasswordByName(params2)
                        this.setInputValue(this.passwordInput,  passwordResult.content[0].password)
                        this.queryBoxVisible = false
                    }catch(err){
                        this.queryBoxVisible = false
                        GM_setObject('INFOVALUE',null)
                        alert('获取数据异常，请联系管理员！')
                    }
                }
            }else{
                this.setInputValue(this.usernameInput,'')
                this.setInputValue(this.passwordInput,'')
                GM_setObject('INFOVALUE',null)
            }
        },
        //密码自动填充
        atuoPassword(){
            if(!this.itemInfo) return false
            this.setInputValue(this.usernameInput,this.itemInfo.userName)
            if(!this.itemInfo.password) return false
            this.setInputValue(this.passwordInput,this.itemInfo.password)
            return true 
        },
        //4.【信息查询】
        queryInfo(){
            if(location.pathname.indexOf('login/fbms') > -1){
                alert('运维平台通用管理员账号："PERSAGYADMIN"')
            }else{
                this.showTable = true
            }
        },
    },
}
</script>

<style scoped lang='less'>
.youhou_tool-wrap{
    height: 42px;
    line-height: 42px;
    text-align: center;
    cursor: pointer;
    margin: 10px auto 0;
    display: flex;
    background: rgb(254 240 240);
    border: 1px rgb(251 196 196) solid;
    color: rgb(245 108 108);
    border-radius: 5px;
    padding: 0 5px;
    justify-content: space-between;
    .youhou-progress{
        position: fixed;
        z-index: 1234567;
        left:calc(50% - 100px);
        top:calc(50% - 40px);
        width:200px;
        border-radius: 5px;
        height: 80px;
        background: rgba(0, 0, 0, .8);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }
    .youhou_login_table-box{
        position:fixed;
        z-index: 1234567;
        height: 200px;
        min-width: 273px;
        display: flex;
        flex-flow: column;
        background: #fff;
        background: rgb(236 245 255);
        top:45.8%;
        left: 66.5%;
        .youhou_login_table-box-header{
            height: 30px;
            line-height: 30px;
            color: #fff;
            background: linear-gradient(90deg,rgb(86 150 250),rgb(17 106 248));
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}
.tool{
  height: 100%;;
  font-size: 12px;
  /* margin-right: 10px; */
  .youhou_login{
    background: #fff;
    display: inline-block;
    line-height: 25px;
    border-radius: 2px;
    border: 1px rgb(251 196 196) solid;
    &:hover{
        color: rgb(64 158 255);
        border: 1px rgb(64 158 255) solid;
    }
  }
}

</style>>


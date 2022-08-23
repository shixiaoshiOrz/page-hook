<template>
  <div class="youhou_tool-wrap">
    <!-- 可用登录名列表弹框 -->
    <div class="youhou_login_table-box" v-if='showTable'  v-drag>
        <p class="youhou_login_table-box-header" style="cursor:move">
            <span>可用登录名列表</span>
            <span @click="showTable = false" style="cursor:pointer">x</span>
        </p>
        <loginNameTable> </loginNameTable> 
    </div>
    <!-- 智能获取弹框 -->
    <div class="youhou-progress" v-if="queryBoxVisible">
        {{ queryBoxTip }}
    </div>
    <!-- 按钮面板 -->
    <div class="tool" title="开启后密码将以明文的形式显示">
        <span>显示密码：</span>
        <el-switch v-model="showPassword" active-color="#13ce66" inactive-color="#F56C6C" @change="showPasswordValueChange()"></el-switch>
    </div>
    <div class="tool" v-show="version !== '4.3+'">
        <span class="youhou_login" title="点击查询可用登录名" @click="queryInfo()">{{ version ==="3.0+" ? "账号获取" : "免密登"}}</span>
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

  </div>
</template>

<script>
import loginNameTable from './loginNameTbale.vue'
import { GM_setObject,GM_getObject } from '../../utils/GM_API'
import { passwordInput ,usernameInput} from "../../utils/dom.js"
import {getUserByIdServiceV2 ,getPersonByUserNameService ,listUsersService} from "../../api/proxy"
import gmInfo from "../../api/GM_DB_INFO"
export default {
    components:{ loginNameTable },
    data() {
        return {
            showPassword:GM_getObject('SHOWPASSWORD'),
            noPasswordValue:GM_getObject('NOPASSWORDLOGIN') ,
            infoValue:GM_getObject('INFOVALUE'),
            showTable:false,//登录名查询弹框,
            queryBoxVisible:false,
            itemInfo:null,
            queryBoxTip:"智能获取中，请稍后.....",
            groupCode:"",
        }
    },
    props:{
        version:String
    },
    mounted(){
        //3.0产品不支持免密登录
        if(this.version === "3.0+"){
            this.noPasswordValue = null
            GM_setObject('NOPASSWORDLOGIN',null) 
        }
        this.$EventBus.$on('deletUrl',()=>{
            this.$nextTick(() => {
                let userName = usernameInput
                let password = passwordInput
                userName.value = ""
                password.value = ""
                this.infoValue = false
                GM_setObject('INFOVALUE',null)
            })
        })
        //信息填充 - 初始化
        let itemInfo = gmInfo.getLoginInfoItem()
        if(!itemInfo) {
            GM_setObject('INFOVALUE',null) 
            this.infoValue = false
        }else{
            this.itemInfo =  itemInfo
        }
        if(GM_getObject('INFOVALUE')){
            if(this.itemInfo) this.atuoPassword()
            else {
                GM_setObject('INFOVALUE',null) 
                this.infoValue = false
            }    
        } 
        //显示密码初始化
        if(this.showPassword) { passwordInput.type = 'text' }
        //免密登录初始化
        if(this.noPasswordValue && location.pathname.indexOf("/login/fbms") > -1){
            this.$setInputValue(usernameInput,'PERSAGYADMIN')
        }
    },
    methods:{
        //1.【显示密码】
        showPasswordValueChange(){
            if(!passwordInput){
                this.$message.warning('当前页面不支持该功能！')
                this.showPassword = false
            }else{
                if(this.showPassword){
                    passwordInput.type = 'text'
                    GM_setObject('SHOWPASSWORD',true)
                }else{
                    passwordInput.type = 'password'
                    GM_setObject('SHOWPASSWORD',null)
                }
            }
        },
        //2.【免密登录】
        noPassWordChange(){
             if(this.version === "3.0+" ){
                this.noPasswordValue = false
                confirm("我嘞个擦，3.0+的标准产品居然不支持此功能！但是，你可以点击【账号获取】！！")
             }
             if(!usernameInput){
                this.$message.warning('当前页面不支持该功能！')
                GM_setObject('NOPASSWORDLOGIN',false)
                return this.noPasswordValue = false
             }else{
                if (location.pathname.indexOf("/login/fbms") > -1){
                    this.$setInputValue(usernameInput,'PERSAGYADMIN')
                }
                GM_setObject('NOPASSWORDLOGIN',this.noPasswordValue)
             }
        },
        //3.【智能填充】
        async smartFill(){
            if(!passwordInput || !usernameInput){
                this.$message.warning('当前页面不支持该功能！')
                GM_setObject('INFOVALUE',false)
                return this.infoValue = false
            }
            //运维平台----特殊处理
            if(location.pathname.indexOf("/login/fbms") > -1){
                this.$setInputValue(usernameInput,'PERSAGYADMIN')
                this.infoValue = false
                return confirm('运维平台不支持密码填充，请使用免密登录功能！')
            }
            if(this.infoValue){
                //标准产品信息库账号密码匹配
                let data = this.atuoPassword()
                if(data){
                   return GM_setObject('INFOVALUE',true)
                }
                // 对于4.3版本，无法智能获取，直接提示用户
                if(this.version === "4.3+"){
                    this.infoValue = false
                    GM_setObject('INFOVALUE',null)
                    return this.$message.warning('未获取到信息，请成功登录一次后使用~')
                }
                //如果信息库无储存的账号密码，则智能获取
                this.queryBoxVisible = true
                //获取pd信息
                const parmas = {loginName: "PERSAGYADMIN",loginDevice: "PC",isAdminLogin: true}
                try{
                    let data = await getPersonByUserNameService(parmas)
                    let pd = data?.content?.[0].pd ?? ''
                    this.groupCode = data?.content?.[0].groupCode ?? ''
                    const params1 = {
                        user_id: "PERSAGYADMIN",isAdmin: "9",page: 1,pageSize: 1000,
                        pd: data?.content?.[0].pd || '',
                        groupCode:this.groupCode,
                        puser: {
                            userId: "PERSAGYADMIN",loginDevice: "PC",
                            pd: pd
                        },   
                    }
                    this.queryBoxTip = "用户名称获取中..."
                    //根据获取的pd获取用户列表
                    let result = await listUsersService(params1)
                    let userInfoListTemp = result?.content?.[0]?.content || []
                    //过滤掉未启用权限或者停用的账号
                    let userInfoList = userInfoListTemp.filter(res => res.state === '1' && res.authorizations.length > 0)
                    this.$setInputValue(usernameInput,userInfoList[0].userName)
                    const params2 = {puser: { userId: "PERSAGYADMIN",loginDevice: "PC",pd: pd},userId: userInfoList[0].userId,groupCode:this.groupCode,}
                    this.queryBoxTip = "登录密码获取中..."
                    let passwordResult = await getUserByIdServiceV2(params2)
                    this.$setInputValue(passwordInput,  passwordResult.content[0].password)
                    this.queryBoxVisible = false
                }catch(err){
                    this.queryBoxTip = ""
                    this.infoValue = false
                    this.queryBoxVisible = false
                    GM_setObject('INFOVALUE',null)
                    alert('卧槽，这环境有毒，居然获取失败了！！')
                }
                
            }else{
                this.$setInputValue(usernameInput,'')
                this.$setInputValue(passwordInput,'')
                GM_setObject('INFOVALUE',null)
            }
        },
        //密码自动填充
        atuoPassword(){
            if(!this.itemInfo) return false
            this.$setInputValue(usernameInput,this.itemInfo.userName)
            if(!this.itemInfo.password) return false
            this.$setInputValue(passwordInput,this.itemInfo.password)
            return true 
        },
        //4.【免密登录用户民表格】
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


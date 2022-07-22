<template>
  <div class="youhou_login-table-box">
    <span v-if="wait">获取中，请稍后...</span>
    <template v-if="userInfoList.length > 0">
        <div v-for="(item,index) in userInfoList" :key="item.userId || index" class="youhou_table-item">
            <span @click="copy(item.userName)" style="min-width: 100px;margin-right: 5px;">{{ item.userName}}</span>
            <span @click="queryPassword(item,index)" 
                 :class="getClass(paaswordValue,index)" 
                 style="min-width: 80px; margin-right: 5px;"> 
                {{ paaswordIndex === index ? paaswordValue : '获取密码'}}
            </span>
            <span @click="autoUserName(item,index)" class="nameSet" :class="{ aiSet : index == paaswordIndex}">
                 {{ index == paaswordIndex ? '账号密码填充' : '账号一键填充'  }}
            </span>
        </div>
    </template>
  </div>
</template>

<script>
import mixins from '../../utils/mixins'
export default {
    mixins: [mixins],
    created(){
        this.getLoginName()
    },
    data(){
        return{
            userInfoList:[],
            paaswordValue:'暂无密码!',
            paaswordIndex:-1,
            adminPd:'',
            wait:true,
        }
    },
    methods:{
        // 样式设置
        getClass(paaswordValue,index){
            if(index !== this.paaswordIndex) return
            if(paaswordValue === '获取中...'){
                return {query:true}
            }else if(paaswordValue === '暂无密码!'){
                return { nopassword:true }
            }else{
                return { succees:true }
            }
        },
        //获取用户名称列表
        async getLoginName(){
           const parmas = {loginName: "PERSAGYADMIN",loginDevice: "PC",isAdminLogin: true}
           let data = await this.getUserInfoByName(parmas)
           if(!data) return
           this.adminPd = data?.content?.[0].pd || ''
           const parmas1 = {
                user_id: "PERSAGYADMIN",isAdmin: "9",page: 1,pageSize: 1000,
                pd: data?.content?.[0].pd || '',
                puser: {
                    userId: "PERSAGYADMIN",loginDevice: "PC",
                    pd: this.adminPd
                },   
            }
            //根据获取的pd获取用户列表
            let result = await this.getNameList(parmas1)
            if(!result) return
            let userInfoListTemp = result?.content?.[0]?.content || []
            //过滤未启用的账号   //过滤没有权限的账号
            if(userInfoListTemp.length < 1) return
            this.userInfoList = userInfoListTemp.filter(res => res.state === '1' && res.authorizations.length > 0)
            this.paaswordList = this.userInfoList.map(res => '获取密码')
            //关闭请求等待
            this.wait = false
        },
        //获取登录密码
        async queryPassword(item,index){
            if(index === this.paaswordIndex){
                return this.copy(this.paaswordValue)
            }
            this.paaswordIndex = index
            this.paaswordValue = '获取中...'
            const parmas1 = {puser: { userId: "PERSAGYADMIN",loginDevice: "PC",pd: this.adminPd},userId: item.userId}
            let passwordResult
            try{
              passwordResult = await this.getPasswordByName(parmas1)
            }catch(err){}finally{
              this.paaswordValue = passwordResult?.content?.[0]?.password || '暂无密码！'
            }   
        },
        //账号密码填充
        autoUserName(item,index){
            this.setInputValue(this.usernameInput,item.userName)
            this.setInputValue(this.passwordInput,"")
            if(index === this.paaswordIndex){
                this.setInputValue(this.passwordInput,this.paaswordValue)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.youhou_login-table-box{
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    border: rgb(179 216 255) 1px solid;
    .youhou_table-item{
        border-bottom: 1px solid rgb(235 238 245);
        line-height: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        font-size: 12px;
        color: rgb(96 98 102);
        background: #fff;
        span{
            display: flex;    
        }
        .nameSet{
            padding: 0 10px;
            background-color:rgb(86 150 250);
            border-color: rgb(225 243 216);
            color: #fff;
            line-height: 20px;
            justify-content: center;
            border-radius: 2px;
            align-items: center;
            height: 20px;
        }
        .aiSet{
            padding: 0 10px;
            background-color: rgb(103 194 58);
            border-color: rgb(225 243 216);
            color: #fff;
            line-height: 20px;
            justify-content: center;
            border-radius: 2px;
            align-items: center;
            height: 20px;
        }
        .query{
            color: rgb(17 106 248);
        }
        .succees{
            color: rgb(103 194 58);
        }
        .nopassword{
            color: red;
        }
    }
}
</style>>

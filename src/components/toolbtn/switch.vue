<template>
  <div class="switch-button" @click="jump"> 
    {{ title }}
  </div>
</template>

<script>
export default {
    data(){
        return {
            pathname:location.pathname
        }
    },
    props:{
        version:String
    },
    computed:{
        title(){
            if(this.version === "3.0+"){
                if(this.pathname.indexOf("saasFrame") > -1){
                    return '点击切换至运维平台' 
                }else{
                    return '点击切换至业务系统平台'
                }
            }else{
                if(this.pathname.indexOf("/login/fbms") > -1){
                    return '点击切换至数智化管理平台'
                }else{
                    return '点击切换至运维平台' 
                }
            }

        }
    },
    methods:{
        jump(){
            if(this.version === "3.0+"){
                if(this.pathname.indexOf("saasFrame") > -1){
                    location.pathname = '/fbms' 
                }else{
                    location.pathname = 'saasFrame'
                }
            }else{
                if(this.pathname.indexOf("/login/fbms") > -1){
                    location.pathname = '/saasweb/login'
                }else{
                    location.pathname = '/login/fbms'
                }
            }
        }
    }
}
</script>

<style  scoped>
.switch-button{
    cursor: pointer;
    z-index: 66;
    color: rgb(64 158 255);
    background: rgb(236 245 255);
    border: rgb(64 158 255) 1px solid;
    transition: .1s;
    font-weight: 500;
    font-size: 14px;
    height: 25px;
    margin-top: 5px;
    line-height: 25px;
    border-radius: 4px;
    text-align: center;
}
.switch-button:hover{
    color: aliceblue;
    background-color: rgb(64 158 255);
}
</style>
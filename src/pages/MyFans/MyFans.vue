<template>
  <div class="my_fans_wrap">
    <div class="release-head-wrap">
      <div class="head-search-state"></div>
      <div class="release-head clearfix">
        <a href="javascript:;" class="back" @click="backHome"></a>
        <div class="release-head-title">我的粉丝</div>
      </div>
    </div>
    <div class="my_fans_content">
      <div class="my_fans_list clearfix" v-for="(item,index) in fansList" :key="index">
        <div class="my_fans_list_img">
          <img :src="item.portrait" alt="">
        </div>
        <div class="my_fans_list_text">
          <span>{{item.nickname}}</span>
          <label>{{item.introduce}}</label>
        </div>
        <!--<div class="my_fans_list_del">删除</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {marketPostReq} from '../../utils/fetch.js'
  export default {
    data(){
      return{
        fansList:[],//粉丝列表
      }
    },
    methods:{
      //返回首页
      backHome(){
        this.$router.go(-1);
      },
      //获取粉丝列表
      getFansList(){
        let params = {
          token: '8f484c6443df07e1167f498381fa26e85c41e63d',
        };
        marketPostReq('/customer/getFansList',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            this.fansList = content;
          }
        });
      },
    },
    created(){
      this.$nextTick(()=>{
        this.getFansList();

      })
    },
  }
</script>

<style scoped lang="scss">
.my_fans_wrap{
  width:100%;
  height:auto;
  .release-head-wrap{
    width:100%;
    height:auto;
    .head-search-state{
      width:100%;
      height:40px;
      background:#FFFFFF;
    }
    .release-head{
      width:100%;
      height:88px;
      line-height:88px;
      background: #ffffff;
      position: relative;
      .back{
        width:18px;
        height:34px;
        float: left;
        background:url("../../../static/img/back.png") no-repeat;
        background-size:100% 100%;
        margin-right:25px;
        z-index:22;
        position: absolute;
        left:30px;
        top:27px;
      }
      .release-head-title{
        width:100%;
        height:88px;
        line-height:88px;
        position: absolute;
        text-align: center;
        font-size:38px;
        color:#343434;
        font-weight: bold;
      }
    }
  }
  .my_fans_content{
    width:100%;
    height:auto;
    .my_fans_list{
      width:100%;
      height:auto;
      padding:18px 40px 18px 30px;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      background:#FFD34C;
      border-bottom:1px solid #f2c848;
      &:last-child{
        border-bottom:none;
      }
      .my_fans_list_img{
        float: left;
        width:64px;
        height:64px;
        border-radius:10px;
        margin-right:16px;
        img{
          display: block;
          width:100%;
          height:100%;
          background:#Ffffff;
          border-radius:10px;
        }
      }
      .my_fans_list_text{
        float: left;
        width:70%;
        span{
          display: block;
          width:100%;
          font-size:24px;
          color:#272161;
          padding:6px 0 10px;
          font-weight: bold;
        }
        label{
          display: block;
          width:100%;
          font-size:20px;
          color:#999999;
        }
      }
      .my_fans_list_del{
        float: right;
        width:88px;
        height:36px;
        line-height:36px;
        text-align: center;
        font-size:20px;
        color:#272161;
        border:2px solid rgba(39,33,97,1);
        border-radius:18px;
        margin-top:14px;
      }
    }
  }
}
</style>

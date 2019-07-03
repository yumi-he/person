<template>
    <div class='good-detail-wrap'>
      <div class="release-head-wrap">
        <div class="head-search-state"></div>
        <div class="release-head clearfix">
          <a href="javascript:;" class="back" @click="backHome"></a>
        </div>
      </div>

      <div class="good-detail-content-wrap">
        <div class="good-detail-per-info">
          <dl class="clearfix">
            <dt>
              <img :src="goodsDetail.portrait" alt="">
            </dt>
            <dd>
              <span>{{goodsDetail.nickname}}</span>
              <label>卖出过{{goodsDetail.out_count}}件宝贝</label>
            </dd>
          </dl>
        </div>
        <div class="good-detail-content-info">
          <div class="good-detail-content-prize">${{goodsDetail.price}}</div>
          <div class="good-detail-content-name">{{goodsDetail.name}}</div>
          <div class="good-detail-content-img" v-for="(item,index) in goodsDetail.images" :key="index">
            <img :src="item" alt="">
          </div>
          <div class="good-detail-content-want">
            {{goodsDetail.hot_point}}人想要 · 浏览{{goodsDetail.click_count}}
          </div>
        </div>
      </div>

      <div class="good-detail-footer-wrap clearfix">
        <!--<div class="good-detail-collection clearfix" @click="goCollection" :class="{active:collectioncContent=='关注成功'}">-->
          <!--<i></i>-->
          <!--<span>收藏</span>-->
        <!--</div>-->
        <div class="good-detail-modify" @click="goModifyGood"></div>
      </div>


      <!--我想要弹窗-->
      <div class="goods_detail_purchase_dialog" >
        <div class="goods_detail_purchase_dialog_hide"  v-if="isWantPurchase" @click="dialogHide"></div>
        <div class="goods_detail_purchase_content" v-if="isWantPurchase">
          <div class="goods_detail_purchase_model">
            <div class="goods_detail_purchase_title">马上联系宝贝主人交易</div>
            <div class="goods_detail_purchase_text">{{WeChat}}</div>
            <el-button
              class="ml10"
              type="text"
              size="medium"
              v-clipboard:copy="WeChat"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              @click="closePurchase">去联系</el-button>
            <!--<div class="goods_detail_purchase_btn" @click="closePurchase">去联系</div>-->
          </div>
          <div class="goods_detail_purchase_close" @click="closePurchase"></div>
        </div>
      </div>


    </div>
</template>

<script>
  import {marketPostReq} from '../../utils/fetch.js'
  export default {
    data(){
      return{
        goodsDetail:{},
        collectioncContent:"",
        WeChat:'',//卖家联系方式
        isWantPurchase:false,
      }
    },
    methods:{
      //返回首页
      backHome(){
        this.$router.go(-1);
        // this.$router.push({path:'/'});
      },

      //获取详情数据
      getDetailData(){
        let params = {
          goods_id:this.$route.query.goods_id
        };
        marketPostReq('/goods/getGoodsDetail',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            //获取产品详情
            this.goodsDetail = content.goods;
          }
        });
      },

      //去收藏
      goCollection(){
        let params = {
          token: '8f484c6443df07e1167f498381fa26e85c41e63d',
          // token: getCookie('token'),
          goods_id:this.$route.query.goods_id
        };
        marketPostReq('/goods/collection',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            //收藏信息
            this.collectioncContent = content;
          }
        });
      },

      //获取卖家联系方式
      getGustomerData(){
        let params = {
          // token: '8f484c6443df07e1167f498381fa26e85c41e63d',
          token: getCookie('token'),
          goods_id:this.$route.query.goods_id,
        };
        marketPostReq('/customer/getCustomerData',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            // 卖家联系方式
            this.WeChat = content.WeChat;
          }
        });
      },

      // 打开购买弹层
      goPurchase(){
        this.isWantPurchase = true;
        this.getGustomerData();
      },

      // 关闭购买弹层
      closePurchase(){
        this.isWantPurchase = false;
      },
      // 点击遮罩层隐藏弹框
      dialogHide(){
        this.isWantPurchase = false;
      },
      // 复制成功
      onCopy(e){
        console.log(e);
      },
      // 复制失败
      onError(e){
        alert("失败");
      },

      //修改商品
      goModifyGood(){
        this.$router.push({path:'/modifyCommodity',query:{data:this.goodsDetail}});
      },

    },
    created(){
      this.$nextTick(()=>{
        this.getDetailData();
      })
    },
  }
</script>

<style scoped lang="scss">
.good-detail-wrap{
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

    }
  }
  .good-detail-content-wrap{
    width:100%;
    height:auto;
    .good-detail-per-info{
      width:100%;
      height:auto;
      padding:16px 16px 16px 30px;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      background:#FFD34C;
      dl{
        width:100%;
        dt{
          float: left;
          width:56px;
          height:56px;
          margin-right:16px;
          img{
            display: block;
            width:100%;
            height:100%;
            border-radius:10px;
          }
        }
          dd{
            float: left;
            width:86%;
            span{
              display: block;
              width:100%;
              font-size:24px;
              color:#272161;
              margin-bottom:8px;
              font-weight: bold;
            }
            label{
              display: block;
              width:100%;
              font-size:20px;
              color:#999999;
            }
          }
      }
    }
    .good-detail-content-info{
      width:100%;
      height:auto;
      padding:28px 30px 0;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      background:#F2F2F2;
      .good-detail-content-prize{
        width:100%;
        height:auto;
        font-size:36px;
        color:#FF0000;
        font-weight: bold;
        padding-bottom:30px;
      }
      .good-detail-content-name{
        width:100%;
        height:auto;
        font-size:30px;
        color:#272161;
        font-weight: bold;
        line-height:46px;
        padding-bottom:28px;
      }
      .good-detail-content-img{
        width:100%;
        height:auto;
        img{
          display: block;
          width:100%;
          height:auto;
          margin-bottom:10px;
        }
      }
      .good-detail-content-want{
        width:100%;
        height:auto;
        text-align: right;
        padding-top:20px;
        font-size:24px;
        color:#999999;
      }
    }
  }
 .good-detail-footer-wrap{
   width:100%;
   height:100px;
   background:#ffffff;
   position: fixed;
   left:0;
   bottom:0;
   padding:0 82px 0 96px;
   box-sizing: border-box;
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   .good-detail-collection{
     float: left;
     margin-top:30px;
     &.active{
       i{
         float: left;
         width:44px;
         height:40px;
         background:url("../../../static/img/collection.png") no-repeat;
         background-size:100% 100%;
         margin-right:20px;
       }
     }
     i{
       float: left;
       width:44px;
       height:40px;
       background:url("../../../static/img/no-collection.png") no-repeat;
       background-size:100% 100%;
       margin-right:20px;
     }
     span{
       float: left;
       font-size:24px;
       color:#999999;
       height:40px;
       line-height:40px;
     }
   }
   .good-detail-modify{
     float: right;
     width:125px;
     height:52px;
     background:url("../../../static/img/good-detail-modify-btn.png") no-repeat;
     background-size:100% 100%;
     margin-top:26px;
   }
 }

  .goods_detail_purchase_dialog{
    width:100%;
    height:100%;
    .goods_detail_purchase_dialog_hide{
      width:100%;
      height:100%;
      background:rgba(0,0,0,.3);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto;
      margin: 0;
      z-index:22;
    }
    .goods_detail_purchase_content{
      width:560px;
      height:auto;
      position: fixed;
      /*left:30%;*/
      left:calc(50% - 280px);
      top:calc(35% - 100px);
      z-index:23;
      .goods_detail_purchase_model{
        width:560px;
        height:360px;
        background:#FFD34C;
        border-radius:30px;
        margin-bottom:30px;
        .goods_detail_purchase_title{
          width:100%;
          height:64px;
          line-height:64px;
          background:#272161;
          text-align: center;
          border-radius:30px 30px 0 0;
          font-size:30px;
          color:#FFD34C;
        }
        .goods_detail_purchase_text{
          width:100%;
          height:208px;
          line-height:208px;
          /*margin:95px 0 90px;*/
          color:#272161;
          font-size:30px;
          text-align: center;
        }
        .goods_detail_purchase_btn{
          width:100%;
          height:88px;
          line-height:88px;
          background:#272161;
          text-align: center;
          border-radius:0 0 30px 30px;
          font-size:30px;
          color:#FFD34C;
        }
        .el-button--text{
          width:100%;
          height:88px;
          line-height:88px;
          background:#272161;
          text-align: center;
          border-radius:0 0 30px 30px;
          font-size:30px;
          color:#FFD34C;
          padding:0;
          span{
            display: block;
            width:100%;
            height:88px;
            line-height:88px;
            font-size:30px;
            color:#FFD34C;
          }
        }
      }
      .goods_detail_purchase_close{
        width:88px;
        height:88px;
        background:url("../../../static/img/detail_del.png") no-repeat;
        background-size:100% 100%;
        margin:0 auto;
      }
    }
  }
}
</style>

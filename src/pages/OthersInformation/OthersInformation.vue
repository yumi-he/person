<template>
  <div class="user_information_wrap">
    <div class="user_information_head_wrap">
      <div class="head-search-wrap">
        <div class="head-search-state"></div>
        <div class="head-search-content clearfix">
          <a href="javascript:;" class="back" @click="backHome"></a>
        </div>
      </div>

      <div class="user_information_box">
        <dl class="user_information_per_img clearfix">
          <dt><img :src="information.portrait" alt=""></dt>
          <dd>{{information.nickname}}</dd>
          <div class="user_information_edit" v-if="information.fans_state == 0" @click="goFansState(0)">关注</div>
          <div class="user_information_edit_active" v-if="information.fans_state == 1" @click="goFansState(1)">已关注</div>
        </dl>
        <div class="user_information_edit_text">
          <textarea name="" id="" cols="30" rows="10" disabled value="">{{information.introduce}}</textarea>
        </div>
        <div class="user_information_bottom_box clearfix">
          <span>关注（{{orderInfo.follow_num}}）</span>
          <span>粉丝（{{orderInfo.fans_num}}）</span>
        </div>
      </div>

    </div>
    <div class="other_ta">
      <label>TA的（{{orderInfo.goods_num}}）</label>
    </div>

    <div class="user_information_content_wrap">
      <ul
        class="clearfix"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50">
        <li v-for="(item,index) in goodList" :key="index">
          <dl @click="goOtherGoodDetail(item.goods_id)">
            <dt>
              <img :src="item.cover">
            </dt>
            <dd>
              <div class="home-good-name ellipsis">{{item.name}}</div>
              <div class="home-good-prize clearfix">
                <span>${{item.price}}</span>
                <label>{{item.hot_point}}人想要</label>
              </div>
            </dd>
          </dl>
          <!--已售弹层-->
          <!--是否已售 1(已售) 0(出售中)-->
          <div class="sold_dialog" v-if="item.on_sale == 1">
            <div class="sold_icon"></div>
          </div>
        </li>
      </ul>
      <div v-if='loadingDom' class='loading'>
        我也是有底线的！
      </div>
      <p class="page-infinite-loading"  v-if='!loadingDom'>
        <img src="../../../static/img/Load.gif" alt="">
      </p>
    </div>
  </div>
</template>

<script>
  import {marketPostReq} from '../../utils/fetch.js'
  export default {
    data(){
      return{
        page:1,
        pageSize:4,
        information:'',//个人信息
        orderInfo:'',//数量
        goodList:[],//Ta的商品
        loadingDom:false,
      }
    },
    methods:{
      //返回首页
      backHome(){
        this.$router.go(-1);
        // this.$router.push({path:'/'});
      },

      //获取他的个人信息和商品
      getOtherShopCustomerGoods(){
        let params = {
          userIdCode:this.$route.query.userIdCode,
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/goods/getShopCustomerGoods',params).then(res=>{
          let {errcode,message,content} = res ;

          if(errcode == 0){

            //个人信息
            this.information = content.info;

            //数量
            this.orderInfo = content.order_info;

            //Ta的商品
            this.goodList = content.goods_list.goods;


          }
        });
      },

      //获取加载数据
      getLoadDataInit(){

        let params = {
          userIdCode:this.$route.query.userIdCode,
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/goods/getShopCustomerGoods',params).then(res=>{
          let {errcode,message,content} = res ;
          // if(errcode == 0){
          //导航
          // this.category = content.category;
          //   //获取产品列表
          //   this.goods = content.goods_list.goods;
          // }
          //当请求没有数据时需要显示的内容，需要注意的是如果上一次正好将数据请求完
          //这次请求的数据Data会为[],就会执行里面的代码，加上this.orderData.length == 0这个限制条件就不会了
          if(content.goods_list.goods.length == 0 && this.goodList.length == 0) {
            this.loading = true;
          }
          else {
            //有数据并且请求到的数据等于pageSize说明数据库还有多余数据
            if(content.goods_list.goods.length === parseInt(this.pageSize)){
              for(var i=0; i<this.pageSize; i++){
                this.goodList.push(content.goods_list.goods[i]);
              }
              this.loading = false;
            }
//有数据但是数据库数据已经被请求完，没有其他数据
            else {
              this.loading = true;
              this.loadingDom = true;
              for(var i=0; i<content.goods_list.goods.length; i++){
                this.goodList.push(content.goods_list.goods[i]);
              }
            };
//数据正好请求完，由于前面加了this.goods.length == 0限制，会走当前逻辑
            if(content.goods_list.goods.length == 0) {
              this.loading = true;
              this.loadingDom = true;
            }
          }
          // }
          //   else{
          //     errorInfo(errcode, message);
          //   };
        });

      },
      loadMore() {
        this.loading = true;
        setTimeout(() => {
          this.page++;
          this.getLoadDataInit();
          // console.log(this.goods)
          // this.goods.push(this.goods)
          // let last = this.goods[this.goods.length - 1];
          // console.log(this.goods)
          // console.log(last)
          // for (let i = 1; i <= 16; i++) {
          //   this.goods.push(last + i);
          //   console.log(this.goods)
          // }
          this.loading = false;
        }, 1000);
      },

      //跳转到详情页
      goOtherGoodDetail(id){
        //第一种：直接传递一个字符串---最简单的
        // this.$router.push('/home/goodDetail/'+id);
        //第二种：传递一个对象path
        this.$router.push({path:'/home/otherGoodDetail?goods_id='+id})
        //第三种：传递命名的路由----name为路由规则里面定义的路由的名字
        // this.$router.push({name:'GoodDetail',params:{id:_id}})
      },

      //取关
      goFansState(state){
        if(state == 0){
          this.information.fans_state = 1;
        }else{
          this.information.fans_state = 0;
        }

        let params = {
          token: '8f484c6443df07e1167f498381fa26e85c41e63d',
          // token: getCookie('token'),
          fans_state:state,
          userIdCode:this.$route.query.userIdCode,
        };
        console.log(this.information.fans_state)
        marketPostReq('/customer/fansChange',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){

            // if(this.goodsFansState == 1){
            //
            //   this.goodsFansState = 0;
            // } else{
            //
            //   this.goodsFansState = 1;
            // }


          }
        });
      },


    },
    created(){
      this.$nextTick(()=>{
        this.getOtherShopCustomerGoods();

      })
    },
  }
</script>

<style scoped lang="scss">
  .user_information_wrap{
    width:100%;
    height:auto;

    .user_information_head_wrap{
      width:100%;
      height:434px;
      background:url("../../../static/img/head_bg.png") no-repeat;
      background-size:100% 100%;
      position: relative;
      .head-search-wrap{
        width:100%;
        height:auto;
        .head-search-state{
          width:100%;
          height:40px;
          /*background:#FFFFFF;*/
        }
        .head-search-content{
          width:100%;
          height:88px;
          /*background:#ffffff;*/
          padding:16px 75px 16px 30px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          .back{
            width:18px;
            height:34px;
            float: left;
            background:url("../../../static/img/back.png") no-repeat;
            background-size:100% 100%;
            margin-right:25px;
            margin-top:12px;
          }
        }
      }
      .user_information_box{
        width:730px;
        height:256px;
        background:#272161;
        border-radius:30px;
        position: absolute;
        bottom:-56px;
        left:10px;
        .user_information_per_img{
          width:100%;
          height:auto;
          margin-top:-78px;
          padding-left:30px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          dt{
            float: left;
            width:144px;
            height:144px;
            border:6px solid rgba(39,33,97,1);
            border-radius:10px;
            box-shadow:0px 3px 9px 0px #0e0a33;
            margin-right:15px;
            img{
              display: block;
              width:100%;
              height:100%;
              background:rgba(255,211,76,1);
            }
          }
          dd{
            float: left;
            font-size:36px;
            color:#FFFFFF;
            font-weight: bold;
            margin-top:100px;
          }
          .user_information_edit{
            float: right;
            width:96px;
            height:56px;
            line-height:56px;
            text-align: center;
            font-size:20px;
            color:#FFD34C;
            margin-top:78px;
            border-left:3px solid rgba(255,211,76,1);
            border-bottom:3px solid rgba(255,211,76,1);
            border-radius:0 0 0 45px;
          }
          .user_information_edit_active{
            float: right;
            width:100px;
            height:56px;
            line-height:56px;
            text-align: center;
            font-size:20px;
            color:#FFD34C;
            margin-top:78px;
            border-left:3px solid rgba(255,211,76,1);
            border-bottom:3px solid rgba(255,211,76,1);
            border-radius:0 0 0 45px;
          }
        }
        .user_information_edit_text{
          width:100%;
          height:110px;
          position: relative;
          textarea{
            position: absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
            padding:20px 30px 0 44px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            border:none;
            background:none;
            outline: none;
            font-size:20px;
            color:#FFD34C;
            &::-webkit-input-placeholder{
              font-size:20px;
              color:#FFD34C;
            }
          }
        }
        .user_information_bottom_box{
          width:100%;
          height:auto;
          padding-left:44px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          span{
            float: left;
            font-size:24px;
            color:#FFD34C;
            font-weight: bold;
            margin-right:84px;
          }
        }
      }

    }
    .other_ta{
      width:100%;
      height:140px;


      label{
        display: block;
        width:50%;
        height:140px;
        padding-top:84px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        text-align: center;
        font-size:30px;
        color:#272161;
        font-weight: bold;
        background:#FFD34C;
        border-radius:0px 0px 120px 0px;
      }
    }
    .user_information_tabwrap{
      width:100%;
      height:140px;
      background:#FFD34C;
      padding-top:84px;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;

      li{
        float: left;
        width:50%;
        height:100%;
        text-align: center;
        &.active{
          label{
            em{
              background:#272161;
            }
          }
        }
        label{
          display: block;
          width:62%;
          /*padding:0 100px;*/
          height:100%;
          font-size:30px;
          color:#272161;
          font-weight: bold;
          position: relative;
          margin:0 auto;
          text-align: center;
          em{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 5px;

          }
        }
      }
    }
    .user_information_content_wrap{
      width:100%;
      height:auto;
      padding:20px 24px 0;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      background:#F2F2F2;
      ul{
        width:100%;
        height:auto;
        li{
          float: left;
          width:340px;
          height:auto;
          margin:0 20px 10px 0;
          border-radius:30px;
          background:#ffffff;
          position: relative;
          &:nth-child(2n){
            margin-right:0px;
          }
          dl{
            width:100%;
            height:auto;
            dt{
              width:340px;
              height:456px;
              background:#ffffff;
              border-radius:30px;
              img{
                display: block;
                width:100%;
                height:100%;
                border-radius:30px 30px 0 0;
              }
            }
            dd{
              padding:10px 16px 26px 20px;
              box-sizing: border-box;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              .home-good-name{
                font-size:20px;
                color:#333333;
                line-height:35px;
                height:70px;
              }
              .home-good-prize{
                width:100%;
                height:auto;
                margin-top:10px;
                span{
                  float: left;
                  font-size:36px;
                  color:#FF0011;
                  font-weight: 500;
                }
                label{
                  float: right;
                  font-size:20px;
                  color:#FFD34C;
                }
              }
            }
          }
          .info_more{
            position: absolute;
            top:24px;
            right:30px;
            width:48px;
            height:12px;
            background:url("../../../static/img/info_more.png") no-repeat;
            background-size:100% 100%;
          }
          .info_more_dialog{
            width:100%;
            height:100%;
            position: absolute;
            left:0;
            top:0;
            border-radius:30px;
            background:rgba(0,0,0,.3);
            padding-top:85px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            display:none;
            .info_more_dialog_list{
              width:100px;
              height:100px;
              border:3px solid rgba(255,255,255,1);
              border-radius:50%;
              font-size:34px;
              color:#FFFFFF;
              line-height:100px;
              text-align: center;
              margin:0 auto 60px;
              font-weight: bold;
              &:nth-child(3){
                margin-bottom:0;
              }
            }
          }
          .sold_dialog{
            width:100%;
            height:100%;
            position: absolute;
            left:0;
            top:0;
            background:rgba(0,0,0,.3);
            /*display: none;*/
            .sold_icon{
              width:210px;
              height:210px;
              background:url("../../../static/img/sold_icon.png") no-repeat;
              background-size:100% 100%;
              position: absolute;
              left:0;
              top:0;
              right:0;
              bottom:0;
              margin:auto;
            }
          }
        }
      }
      .page-infinite-loading{
        width:60px;
        height:60px;
        margin:10px auto;
        img{
          display: block;
          width:100%;
          height:100%;
        }
      }
      .loading{
        width:100%;
        /*height:30px;*/
        /*line-height:30px;*/
        text-align: center;
        font-size:26px;
        margin:20px 0;
      }
    }
  }
</style>

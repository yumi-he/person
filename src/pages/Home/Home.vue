<template>
    <div class="home-wrap">
      <div class="head-search-wrap">
        <div class="head-search-state"></div>
        <div class="head-search-content clearfix">
          <a href="javascript:;" class="back"></a>
          <div class="search-wrap clearfix">
            <!--<form>-->
              <!--<div class="search_text_wrap clearfix">-->
                <!--<span></span>-->
                <!--<input type="text"  name="keyword" class="search_text"  autocomplete="off" id="key" accesskey="s"  v-model='searchWord'>-->
              <!--</div>-->
              <!--<input type="button" value="搜索" class="search_btn" @click="goSearch(searchWord)">-->
            <!--</form>-->

            <form>
              <div class="search_text_wrap clearfix">
                <span></span>
                <input type="text"  name="keyword" class="search_text"  autocomplete="off" id="key" accesskey="s"  placeholder="搜索内容" @click="goSearch">
              </div>
              <input type="button" value="搜索" class="search_btn" @click="goSearch">
            </form>

          </div>
        </div>
      </div>
      <div class="home-content-wrap">
        <div class="home-content-head-banner">
          <img :src="appBackground" alt="">

          <div class="home-list-wrap">
            <ul class="clearfix">
              <li @click="goUserInfomation(0)">
                <dl>
                  <dt>
                    <img :src="icon.sell" alt="">
                  </dt>
                  <dd>出售中</dd>
                </dl>
              </li>
              <li @click="goUserInfomation(1)">
                <dl>
                  <dt>
                    <img :src="icon.out" alt="">
                  </dt>
                  <dd>已卖出</dd>
                </dl>
              </li>
              <li @click="goMyConcern">
                <dl>
                  <dt>
                    <img :src="icon.follow" alt="">
                  </dt>
                  <dd>我的关注</dd>
                </dl>
              </li>
              <li @click="goMyFans">
                <dl>
                  <dt>
                    <img :src="icon.fans" alt="">
                  </dt>
                  <dd>我的粉丝</dd>
                </dl>
              </li>
            </ul>
          </div>
        </div>

        <div class="home-tab-wrap">
          <div class="home-tab-empty"></div>
          <!--<ul class="home-tab-nav clearfix">-->
            <!--<li class="active1">-->
              <!--<span>出售中</span>-->
            <!--</li>-->
            <!--<li>>-->
              <!--<span>求购中</span>-->
            <!--</li>-->
          <!--</ul>-->
          <div class="home-tab-content-wrap">
            <div class="swiperText-wrap" id="swiperText-wrap">
              <div class="swiper-container">
                <ul class="swiper-wrapper">
                  <li class="swiper-slide"  v-for='(categoryItem,categoryIndex) in category' @click="tabGoodList(categoryItem,categoryIndex)" :class="{active:categoryIndex==activeIndex}">
                    <label>{{categoryItem.name}}<em></em></label>
                  </li>
                </ul>
                <!--<div class="swiper-button-prev"></div>-->
                <!--<div class="swiper-button-next"></div>-->
              </div>
            </div>
            <!--产品列表-->
            <div class="home-good-content" v-if="goods.length">


              <ul
                class="clearfix"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="50">
                <li v-for='(goodsItem,goodsIndex) in goods' :key="goodsIndex">
                  <dl @click="goOtherGoodDetail(goodsItem.goods_id)">
                    <dt>
                      <img :src="goodsItem.cover">
                    </dt>
                    <dd>
                      <div class="home-good-name ellipsis">{{goodsItem.name}}</div>
                      <div class="home-good-prize clearfix">
                        <span>${{goodsItem.price}}</span>
                        <label>{{goodsItem.hot_point}}人想要</label>
                      </div>
                    </dd>
                  </dl>
                  <div class="home-good-seller clearfix">
                    <div class="home-good-seller-img">
                      <img :src="goodsItem.portrait" alt="">
                    </div>
                    <div class="home-good-seller-name">{{goodsItem.nickname}}</div>
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
            <!--暂无商品提示-->
            <div class="empty-goods-wrap" v-if="!goods.length">
              暂无此商品,敬请期待！
            </div>
          </div>
        </div>
      </div>
      <div class="home-footer-wrap">
        <div class="home-release-btn" @click="goRelease"></div>
      </div>
    </div>
</template>

<script>
  // import SwiperText from '../../components/SwiperText/SwiperText.vue'
  // import Scroll from '../../components/Scroll/Scroll.vue'
  import {marketPostReq} from '../../utils/fetch.js'
  import Swiper from 'swiper/dist/js/swiper.min.js'
  import 'swiper/dist/css/swiper.min.css'
  export default {
    data(){
      return{
        t:4,
        page:1,//当前页数
        pageSize: 7,//当前显示个数
        category:[],//导航
        category_id:"newgoods",
        goods:[],//产品列表
        activeIndex:0,
        searchWord:'',
        topStatus: '',
        loadingDom:false,
        appBackground:'',//头部大图
        logo:'',//logo
        icon:[],//icon
        token:localStorage.getItem('token'),

      }
    },
    components:{
      // SwiperText
      // Scroll
    },
    methods:{

      //获取数据
      getDataInit(){
        let params = {
          t:this.t,
          // token: this.token,
          token: '8f484c6443df07e1167f498381fa26e85c41e63d',
          // token: getCookie('token'),
          category_id: this.category_id,
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/mall/getHomeData',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
          //导航
          this.category = content.category;
            //获取产品列表
            this.goods = content.goods_list.goods;
          }
        });
      },

      // 请求ICON
      getSecondHand(){
        // 首页定制icon
        marketPostReq('/mall/getHomeImg').then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            // 头部大图
            this.appBackground = content.app_background;
            // logo
            this.logo = content.logo;
            // icon
            this.icon = content.icon;
          }
        });

        // 基础数据配置
        marketPostReq('/mall/getInitData').then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            // 二维码
            this.QRcode = content.QRcode;
            //下载标题
            this.webPusgTitle = content.web_push.title;
            //下载内容
            this.webPusgContent = content.web_push.content;
            //下载图片
            this.webPusgImage = content.web_push.image;
          }
        });
      },


      //获取加载数据
      getLoadDataInit(){

        let params = {
          t:this.t,
          // token: this.token,
          token: '8f484c6443df07e1167f498381fa26e85c41e63d',
          // token: getCookie('token'),
          category_id: this.category_id,
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/mall/getHomeData',params).then(res=>{
          let {errcode,message,content} = res ;
          // if(errcode == 0){
            //导航
            // this.category = content.category;
          //   //获取产品列表
          //   this.goods = content.goods_list.goods;
          // }
          //当请求没有数据时需要显示的内容，需要注意的是如果上一次正好将数据请求完
          //这次请求的数据Data会为[],就会执行里面的代码，加上this.orderData.length == 0这个限制条件就不会了
          if(content.goods_list.goods.length == 0 && this.goods.length == 0) {
            this.loading = true;
          }
          else {
          //有数据并且请求到的数据等于pageSize说明数据库还有多余数据
            if(content.goods_list.goods.length === parseInt(this.pageSize)){
              for(var i=0; i<this.pageSize; i++){
                this.goods.push(content.goods_list.goods[i]);
              }
              this.loading = false;
            }
//有数据但是数据库数据已经被请求完，没有其他数据
            else {
              this.loading = true;
              this.loadingDom = true;
              for(var i=0; i<content.goods_list.goods.length; i++){
                this.goods.push(content.goods_list.goods[i]);
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


      //点击导航
      tabGoodList(item,index){
        this.page= 1;
        this.category_id = item.category_id;

        this.activeIndex = index;

        // this.page =1;
        this.getDataInit();
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

      //跳转到搜索结果页
      goSearch(){
        // this.$router.push({path:'/searchResult?keyword='+searchWord})
        this.$router.push({path:'/searchResult'})
      },

      //跳转到发布页
      goRelease(){
        this.$router.push({path:'/release'})
      },

      //跳转到用户信息
      goUserInfomation(code){
        this.$router.push({path:'/userInformation?isShowSale='+code})
      },

      //跳转到我的关注
      goMyConcern(){
        this.$router.push({path:'/home/myConcern'})
      },

      //跳转到我的粉丝
      goMyFans(){
        this.$router.push({path:'/home/myFans'})
      },

    },
    mounted() {
      setTimeout(function () {
        var mySwiper_in = new Swiper('#swiperText-wrap .swiper-container', {
          // slidesPerView: 'auto',
          centeredSlides: false,
          slidesOffsetAfter : 20,
          spaceBetween: 0,
          slidesPerView : 'auto',
          // slidesPerGroup : 1,
        });
      }, 500);

    },
    created(){
      this.$nextTick(()=>{
        this.getDataInit();
        this.getSecondHand();
        function GetQueryString(name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          if (r != null) return r[2];
          return null;
        }
        var marketToken = GetQueryString('token');
        localStorage.setItem('token',marketToken);

      })
    },
  }
</script>

<style type="text/css" lang='scss' scoped>
.home-wrap{
  width:100%;
  height:auto;
  .head-search-wrap{
    width:100%;
    height:auto;
      .head-search-state{
        width:100%;
        height:40px;
        background:#FFFFFF;
      }
    .head-search-content{
      width:100%;
      height:88px;
      background:#ffffff;
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
      .search-wrap{
        float: left;
        width:600px;
        height:56px;
        border-radius:28px;
        .search_text_wrap{
          float: left;
          width:500px;
          height:56px;
          background:#FFD34C;
          border-radius:28px 0 0 28px;
          span{
            float: left;
            width:26px;
            height:26px;
            background:url("../../../static/img/search.png") no-repeat;
            background-size:100% 100%;
            margin:15px 10px 0 30px;
          }
          .search_text{
            width:432px;
            height:56px;
            line-height:56px;
            font-size:22px;
            border:none;
            background:none;
            outline: none;
          }
        }
        .search_btn{
          float: left;
          width:100px;
          height:56px;
          line-height:56px;
          text-align: center;
          color:#FFD34C;
          font-size:24px;
          border-radius:0 28px 28px 0;
          background:#272161;
          outline: none;
          border:none;
        }
      }
    }
  }
  .home-content-wrap{
    width:100%;
    height:auto;
    .home-content-head-banner{
      width:100%;
      height:230px;
      background:#272161;
      position: relative;
      img{
        display: block;
        width:100%;
        height:100%;
      }
      .home-list-wrap{
        width:100%;
        /*height:146px;*/
        padding:0 30px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        position: absolute;
        left:0;
        bottom:-110px;
        z-index:22;
        ul{
          width:100%;
          height:auto;
          background:#FFD34C;
          border-radius:30px;
          padding:30px 0 20px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          li{
            float: left;
            width:25%;
            height:auto;
            dl{
              width:100%;
              dt{
                width:60px;
                height:60px;
                margin:0 auto 20px;
                img{
                  display: block;
                  width:100%;
                  height:100%;
                }
              }
              dd{
                width:100%;
                text-align: center;
                color:#272161;
                font-size:18px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }


    .home-tab-wrap{
      width:100%;
      height:auto;
      .home-tab-empty{
        width:100%;
        height:120px;
        background:#ffffff;
      }
      .home-tab-nav{
        width:100%;
        height:200px;
        background:#ffffff;
        li{
          float: left;
          width:50%;
          height:200px;
          position: relative;
          &.active1{
            background:#272161;
            border-radius:0 0 100px 0;
            span{
              color:#FFD34C;
            }
          }
          &.active2{
            background:#272161;
            border-radius:0 0 0 100px;
            span{
              color:#FFD34C;
            }
          }
          span{
            position: absolute;
            left:0;
            bottom:0;
            width:100%;
            height:84px;
            text-align: center;
            color:#272161;
            font-size:30px;
            padding-top:20px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            font-weight: bold;
          }
        }
      }

      .home-tab-content-wrap{
        width:100%;
        height:auto;
        .swiperText-wrap{
          width:100%;
          height:60px;
          background:#ffffff;
          /*padding:28px 0 8px;*/
          /*box-sizing: border-box;*/
          /*-webkit-box-sizing: border-box;*/
          /*-moz-box-sizing: border-box;*/
          ul{
            padding-left:20px;
            li{
              float: left;
              width:auto;
              margin:0 40px 0 0;
              &.active{
                label{
                  color:#272161;
                  font-weight: bold;
                  font-size:22px;
                  position: relative;
                  em{
                    background:#272161;
                  }
                }
              }
              label{
                float:left;
                display: block;
                height:60px;
                background:#ffffff;
                padding:28px 0 8px;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                font-size: 20px;
                color:#272161;
                text-align: center;
                position: relative;
                em{
                  width: 100%;
                  height: 3px;
                  position: absolute;
                  left: 0;
                  bottom: 0;
                }
              }
            }
          }
        }
        .home-good-content{
          width:100%;
          height:auto;
          /*height:100%;*/
          /*position: relative;*/
          /*overflow: scroll;*/
          padding:10px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          ul{
            width:100%;
            height:auto;
            li{
              float: left;
              width:360px;
              height:auto;
              margin:0 10px 10px 0;
              border-radius:10px;
              &:nth-child(2n){
                margin-right:0;
              }
              dl{
                width:100%;
                background:#ededed;
                dt{
                  width:360px;
                  height:360px;
                  background:#ffffff;
                  border-radius:10px 10px 0 0;
                  img{
                    display: block;
                    width:100%;
                    height:100%;
                    border-radius:10px 10px 0 0;
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
                      font-size:24px;
                      color:#FF0000;
                      font-weight: 500;
                    }
                    label{
                      float: right;
                      font-size:16px;
                      color:#999999;
                    }
                  }
                }
              }
              .home-good-seller{
                width:100%;
                height:56px;
                background:#FFD34C;
                border-radius:0 0 10px 10px;
                padding:10px 10px 10px 20px;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                  .home-good-seller-img{
                    float: left;
                    width:36px;
                    height:36px;
                    background:#ffffff;
                    border-radius:50%;
                    margin-right:14px;
                    img{
                      display: block;
                      width:100%;
                      height:100%;
                      border-radius:50%;
                    }
                  }
                .home-good-seller-name{
                  float: left;
                  padding-top:8px;
                  font-size:20px;
                  color:#272161;
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

        .empty-goods-wrap{
          width:100%;
          height:auto;
          text-align: center;
          padding-top:40%;
          font-size:35px;
        }
      }
    }
  }

  .home-footer-wrap{
    width:100%;
    height:135px;
    background:#F2F2F2;
    position: fixed;
    left:0;
    bottom:0;
    .home-release-btn{
      width:95px;
      height:96px;
      background:url("../../../static/img/home-release-btn.png") no-repeat;
      background-size:100% 100%;
      margin:0 auto;
    }
  }
}
</style>

<template>
  <div class="home-wrap">
    <div class="head-search-wrap">
      <div class="head-search-state"></div>
      <div class="head-search-content clearfix">
        <a href="javascript:;" class="back" @click="backHome"></a>
        <div class="search-wrap clearfix">
          <!--<form>-->
            <div class="search_text_wrap clearfix">
              <span></span>
              <input type="text"  name="keyword" class="search_text"  autocomplete="off" id="key" accesskey="s"  v-model='searchWord' value="searchWord" placeholder="您想找什么">
            </div>
            <input type="button" value="搜索" class="search_btn" @click="goSearch(searchWord)">
          <!--</form>-->
        </div>
      </div>
    </div>

    <!--搜索热词-->
    <div class="search-hot-wrap" v-if="!isSearchShow">
      <div class="search-hot-content">
        <div class="search-hot-title-wrap clearfix">
          <div class="search-hot-title">热词搜索</div>
          <div class="search-hot-refresh" @click="goSearchHot"></div>
        </div>
        <ul class="clearfix">
          <li v-for="(item,index) in hot" @click="goHotSearch(item)">{{item.name}}</li>
        </ul>
      </div>

      <!--<div class="search-history-content">-->
        <!--<div class="search-history-title-wrap clearfix">-->
          <!--<div class="search-history-title">历史搜索</div>-->
          <!--<div class="search-history-refresh"></div>-->
        <!--</div>-->
        <!--<ul class="clearfix">-->
          <!--<li>iPhoneX</li>-->
        <!--</ul>-->
      <!--</div>-->
    </div>

    <div class="home-content-wrap" v-if="isSearchShow">
      <div class="home-content-head-banner">
        <img src="" alt="">

        <div class="home-list-wrap">
          <ul class="clearfix">
            <li>
              <dl>
                <dt>
                  <img src="../../../static/img/one.png" alt="">
                </dt>
                <dd>出售中</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="../../../static/img/two.png" alt="">
                </dt>
                <dd>已卖出</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="../../../static/img/three.png" alt="">
                </dt>
                <dd>我的关注</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="../../../static/img/four.png" alt="">
                </dt>
                <dd>我的收藏</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>
                  <img src="../../../static/img/five.png" alt="">
                </dt>
                <dd>淘到的宝贝</dd>
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
          <div class="search-result-text"  v-if='goods.length > 0'>
            为您找到{{goods.length}}个与“{{$route.query.keyword}}”相关的商品：
          </div>
          <!--产品列表-->
          <div class="home-good-content" v-if="goods.length">

            <ul
              class="clearfix"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="100">
              <li v-for='(goodsItem,goodsIndex) in goods' :key="goodsIndex">
                <dl @click="goodDetail(goodsItem.goods_id)">
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




            <!--<ul class="clearfix">-->
              <!--<li v-for='(goodsItem,goodsIndex) in goods' :key="goodsIndex">-->
                <!--<dl>-->
                  <!--<dt>-->
                    <!--<img :src="goodsItem.cover">-->
                  <!--</dt>-->
                  <!--<dd>-->
                    <!--<div class="home-good-name ellipsis">{{goodsItem.name}}</div>-->
                    <!--<div class="home-good-prize clearfix">-->
                      <!--<span>${{goodsItem.price}}</span>-->
                      <!--<label>{{goodsItem.hot_point}}人想要</label>-->
                    <!--</div>-->
                  <!--</dd>-->
                <!--</dl>-->
                <!--<div class="home-good-seller clearfix">-->
                  <!--<div class="home-good-seller-img">-->
                    <!--<img :src="goodsItem.portrait" alt="">-->
                  <!--</div>-->
                  <!--<div class="home-good-seller-name">{{goodsItem.nickname}}</div>-->
                <!--</div>-->
              <!--</li>-->
            <!--</ul>-->
          </div>
          <!--暂无商品提示-->
          <div class="empty-goods-wrap" v-if="!goods.length">
            暂无此商品,敬请期待！
          </div>
        </div>
      </div>
    </div>

    <!--关键词为空的提示-->
    <div class="search-hint-dialog" >
      <div class="search-hint-dialog-father" v-if="isSearchHint" @click="searchHintHide"></div>
      <div class="search-hint" v-if="isSearchHint">
        <div class="search-hint-title">提示</div>
        <div class="search-hint-content">关键词或分类不能为空</div>
        <div class="search-hint-button" @click="searchHintHide">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  // import SwiperText from '../../components/SwiperText/SwiperText.vue'
  import {marketPostReq} from '../../utils/fetch.js'
  export default {
    data(){
      return{
        t:4,
        page:1,//当前页数
        pageSize: 16,//当前显示个数
        goods:[],//产品列表
        activeIndex:0,
        // query:{},
        searchWord:'',
        isSearchShow:false,
        hot:[],
        isSearchHint:false,
        loadingDom:false,
      }
    },
    components:{
      // SwiperText
    },
    methods:{

      //跳转到搜索结果页
      goSearch(searchWord){
        if(searchWord!=""){
          this.isSearchShow = true;
          this.$router.push({path:'/searchResult?keyword='+searchWord})
          this.getSearchData();
        }
        // else{
        //   this.isSearchHint = true;
        // }

      },


      //关键词为空的提示隐藏
      searchHintHide(){
        this.isSearchHint = false;
      },

      //搜索商品
      getSearchData(){
        this.page = 1;
        let params = {
          keyword:this.$route.query.keyword,
          // price:this.price,
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/search/search',params).then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            //获取产品列表
            this.goods = content.goods.goods;
          }
        });
      },


      //搜索热词
      getHotSearch(){
        marketPostReq('/search/getHotSearch').then(res=>{
          let {errcode,message,content} = res ;
          if(errcode == 0){
            //搜索热词
            this.hot = content.hot;
          }
        });
      },

      //点击热词搜索
      goHotSearch(item){
        this.isSearchShow = true;
        this.searchWord = item.name;
        this.$router.push({path:'/searchResult?keyword='+item.name});
        this.getSearchData();
      },

      //刷新搜索热词
      goSearchHot(){
        this.getHotSearch();
      },

      //返回首页
      backHome(){
        this.$router.push({path:'/'});
      },


      //获取加载数据
      getLoadDataInit(){

        let params = {
          keyword:this.$route.query.keyword,
          // price:this.price,
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/search/search',params).then(res=>{
          let {errcode,message,content} = res ;
          // if(errcode == 0){
          //导航
          // this.category = content.category;
          //   //获取产品列表
          //   this.goods = content.goods_list.goods;
          // }
          //当请求没有数据时需要显示的内容，需要注意的是如果上一次正好将数据请求完
          //这次请求的数据Data会为[],就会执行里面的代码，加上this.orderData.length == 0这个限制条件就不会了
          if(content.goods.goods.length == 0 && this.goods.length == 0) {
            this.loading = true;
          }
          else {
            //有数据并且请求到的数据等于pageSize说明数据库还有多余数据
            if(content.goods.goods.length === parseInt(this.pageSize)){
              for(var i=0; i<this.pageSize; i++){
                this.goods.push(content.goods.goods[i]);
              }
              this.loading = false;
            }
//有数据但是数据库数据已经被请求完，没有其他数据
            else {
              this.loading = true;
              this.loadingDom = true;
              for(var i=0; i<content.goods.goods.length; i++){
                this.goods.push(content.goods.goods[i]);
              }
            };
//数据正好请求完，由于前面加了this.goods.length == 0限制，会走当前逻辑
            if(content.goods.goods.length == 0) {
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





    },
    created(){
      this.$nextTick(()=>{
        // this.query = getRequest();
        // this.getSearchData();
        this.getHotSearch();
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
              width:20%;
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
          .search-result-text{
            width:100%;
            height:auto;
            padding:20px 10px 10px;
          }
          .home-good-content{
            width:100%;
            height:auto;
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
                  background:#E6E6E6;
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

    .search-hot-wrap{
      width:100%;
      height:auto;
      padding:20px 30px 0;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      .search-hot-content{
        width:100%;
        height:auto;
        .search-hot-title-wrap{
          width:100%;
          height:auto;
          .search-hot-title{
            float: left;
            /*width:100%;*/
            height:auto;
            font-size:28px;
            color:#272161;
            font-weight: bold;
            padding-bottom:20px;
            &:before{
              content:"";
              float: left;
              width:29px;
              height:32px;
              background:url("../../../static/img/hot-icon.png") no-repeat;
              background-size:100% 100%;
              margin-right:10px;
              margin-top:-2px;
            }
          }
          .search-hot-refresh{
            float: right;
            width:26px;
            height:26px;
            background:url("../../../static/img/refresh.png") no-repeat;
            background-size:100% 100%;
          }
        }
        ul{
          width:100%;
          height:auto;
          margin-bottom:45px;
          li{
            float: left;
            width:auto;
            padding:0 20px;
            height:56px;
            line-height:56px;
            font-size:28px;
            color:#272161;
            /*border:2px solid #cccccc;*/
            border-radius:10px;
            background:#ffffff;
            margin:0 10px 10px 0;
          }
        }
      }

      .search-history-content{
        width:100%;
        height:auto;
        .search-history-title-wrap{
          width:100%;
          height:auto;
          .search-history-title{
            float: left;
            /*width:100%;*/
            height:auto;
            font-size:28px;
            color:#272161;
            font-weight: bold;
            padding-bottom:20px;
            &:before{
              content:"";
              float: left;
              width:29px;
              height:28px;
              background:url("../../../static/img/history_icon.png") no-repeat;
              background-size:100% 100%;
              margin-right:10px;
              margin-top:-2px;
            }
          }
          .search-history-refresh{
            float: right;
            width:29px;
            height:27px;
            background:url("../../../static/img/history_del.png") no-repeat;
            background-size:100% 100%;
          }
        }
        ul{
          width:100%;
          height:auto;
          margin-bottom:45px;
          li{
            float: left;
            width:auto;
            padding:0 20px;
            height:56px;
            line-height:56px;
            font-size:28px;
            color:#272161;
            /*border:2px solid #cccccc;*/
            border-radius:10px;
            background:#ffffff;
            margin:0 10px 10px 0;
          }
        }
      }
    }

    .search-hint-dialog{
      width:100%;
      height:100%;
      /*position: fixed;*/
      /*left:0;*/
      /*top:0;*/
      /*background:rgba(0,0,0,.3);*/
      .search-hint-dialog-father{
        width:100%;
        height:100%;
        position: fixed;
        left:0;
        top:0;
        background:rgba(0,0,0,.3);
      }
      .search-hint{
        position: absolute;
        left:0;
        top:0;
        bottom:0;
        right:0;
        margin:auto;
        width:80%;
        height:300px;
        background:#ffffff;
        border-radius:10px;
        padding: 20px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
          .search-hint-title{
            width:100%;
            height:30px;
            font-size:30px;

          }
        .search-hint-content{
          width:100%;
          height:auto;
          text-align: center;
          font-size:30px;
          padding:40px 0 70px;
        }
        .search-hint-button{
          width:100px;
          height:56px;
          line-height:56px;
          text-align: center;
          background:#272161;
          color:#FFD34C;
          font-size:24px;
          border-radius:10px;
          margin:0 auto;
        }
      }
    }

  }
</style>

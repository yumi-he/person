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
          <div class="user_information_edit" @click="infoEdit" v-if="!isShowEdit">编辑</div>
          <div class="user_information_preservation" v-if="isShowEdit" @click="infoPreservation">保存</div>
        </dl>
        <div class="user_information_edit_text">
          <textarea name="" id="" cols="30" rows="10" placeholder="编辑个人说明，让你的宝贝更亮眼" v-model="information.introduce" @blur="focusState = false" v-focus="focusState" :disabled="disableFocus"></textarea>
        </div>
        <div class="user_information_bottom_box clearfix">
          <span @click="goFollow">关注（{{orderInfo.follow_num}}）</span>
          <span @click="goFans">粉丝（{{orderInfo.fans_num}}）</span>
        </div>
      </div>

    </div>
    <ul class="user_information_tabwrap clearfix">
      <li :class="{active:this.isShowSale == 0}" @click="userNav(0)">
        <label>出售中（{{orderInfo.sell_num}}）<em></em></label>
      </li>
      <li :class="{active:this.isShowSale == 1}" @click="userNav(1)">
        <label>已售（{{orderInfo.out_num}}）<em></em></label>
      </li>
    </ul>
    <!--出售中商品列表-->
    <div class="user_information_content_wrap" v-if="isShowSale == 0">
      <ul
        class="clearfix"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loadingOut"
        infinite-scroll-distance="100">
        <li v-for="(goodListItem,goodListIndex) in goodList" :key="goodListIndex">
          <dl @click="goGoodsDetail(goodListItem.goods_id)">
            <dt>
              <img :src="goodListItem.cover">
            </dt>
            <dd>
              <div class="home-good-name ellipsis">{{goodListItem.name}}</div>
              <div class="home-good-prize clearfix">
                <span>${{goodListItem.price}}</span>
                <label>{{goodListItem.hot_point}}人想要</label>
              </div>
            </dd>
          </dl>
          <div class="info_more" @click="goodsOperation(goodListIndex)">
            <img src="../../../static/img/info_more.png">
          </div>
          <!--操作弹层-->
          <div :class="goodListIndex == index ? 'info_more_dialog show': 'info_more_dialog'" ref="infoDialog">
            <div class="info_more_dialog_list" @click="goLowerShelf(goodListItem.goods_id,$event)">下架</div>
            <div class="info_more_dialog_list" @click="goSoldBtn(goodListItem.goods_id,$event)">已售</div>
            <!--<div class="info_more_dialog_list">修改</div>-->
          </div>
          <!--已售弹层-->
          <!--<div class="sold_dialog">-->
            <!--<div class="sold_icon"></div>-->
          <!--</div>-->
        </li>
      </ul>
      <div v-if='loadingDom' class='loading'>
        我也是有底线的！
      </div>
      <p class="page-infinite-loading"  v-if='!loadingDom'>
        <img src="../../../static/img/Load.gif" alt="">
      </p>
    </div>


    <!--已售出商品列表-->
    <div class="user_information_content_wrap" v-if="isShowSale == 1">
      <ul
        class="clearfix"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="100">
        <li v-for="(goodOutItem,goodOutIndex) in goodsOut" :key="goodOutIndex">
          <dl>
            <dt>
              <img :src="goodOutItem.cover">
            </dt>
            <dd>
              <div class="home-good-name ellipsis">{{goodOutItem.name}}</div>
              <div class="home-good-prize clearfix">
                <span>${{goodOutItem.price}}</span>
                <label>{{goodOutItem.hot_point}}人想要</label>
              </div>
            </dd>
          </dl>
          <!--<div class="info_more"></div>-->
          <!--操作弹层-->
          <!--<div class="info_more_dialog">-->
            <!--<div class="info_more_dialog_list">下架</div>-->
            <!--<div class="info_more_dialog_list">已售</div>-->
            <!--<div class="info_more_dialog_list">修改</div>-->
          <!--</div>-->
          <!--已售弹层-->
          <!--<div class="sold_dialog">-->
            <!--<div class="sold_icon"></div>-->
          <!--</div>-->
        </li>
      </ul>
      <div v-if='loadingDomOut' class='loading'>
        我也是有底线的！
      </div>
      <p class="page-infinite-loading"  v-if='!loadingDomOut'>
        <img src="../../../static/img/Load.gif" alt="">
      </p>
    </div>
  </div>
</template>

<script>
  import {marketPostReq} from '../../utils/fetch.js'
  import {Message} from  'element-ui';
  export default {
    data(){
      return{
        page:1,
        pageSize:4,
        information:'',//个人信息
        orderInfo:'',//数量
        goodList:[],//出售中商品
        goodsOut:[],//已售出商品
        loadingDom:false,
        loadingDomOut:false,
        isShowSale:0,
        isShowGoods:false,
        isShowOperation:false,//操作弹层
        isShowEdit:false,//编辑按钮显示
        focusState: false,
        disableFocus:true,
        index:-1,
      }
    },
    methods:{
      //返回首页
      backHome(){
        this.$router.push({path:'/'});
      },
      //跳转到关注页
      goFollow(){
        this.$router.push({path:'/home/myConcern'});
      },
      //跳转到粉丝页
      goFans(){
        this.$router.push({path:'/home/myFans'});
      },
      //获取个人信息和商品
      getShopCustomerGoods(){
        let params = {
          token:'8f484c6443df07e1167f498381fa26e85c41e63d',
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

            //出售中商品
            this.goodList = content.goods_list.goods;

            //已售出商品
            this.goodsOut = content.goods_out.goods;
          }
        });
      },


      //获取出售中加载数据
      getLoadGoodList(){

        let params = {
          token:'8f484c6443df07e1167f498381fa26e85c41e63d',
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/goods/getShopCustomerGoods',params).then(res=>{
          let {errcode,message,content} = res ;
          // if(errcode == 0){

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


      //获取已售出加载数据
      getLoadGoodOut(){

        let params = {
          token:'8f484c6443df07e1167f498381fa26e85c41e63d',
          page:this.page,
          pageSize:this.pageSize,
        };
        marketPostReq('/goods/getShopCustomerGoods',params).then(res=>{
          let {errcode,message,content} = res ;
          // if(errcode == 0){

          //当请求没有数据时需要显示的内容，需要注意的是如果上一次正好将数据请求完
          //这次请求的数据Data会为[],就会执行里面的代码，加上this.orderData.length == 0这个限制条件就不会了
          if(content.goods_out.goods.length == 0 && this.goodsOut.length == 0) {
            this.loading = true;
          }
          else {
            //有数据并且请求到的数据等于pageSize说明数据库还有多余数据
            if(content.goods_out.goods.length === parseInt(this.pageSize)){
              for(var i=0; i<this.pageSize; i++){
                this.goodsOut.push(content.goods_out.goods[i]);
              }
              this.loading = false;
            }
//有数据但是数据库数据已经被请求完，没有其他数据
            else {
              this.loading = true;
              this.loadingDomOut = true;
              for(var i=0; i<content.goods_out.goods.length; i++){
                this.goodsOut.push(content.goods_out.goods[i]);
              }
            };
//数据正好请求完，由于前面加了this.goods.length == 0限制，会走当前逻辑
            if(content.goods_out.goods.length == 0) {
              this.loading = true;
              this.loadingDomOut = true;
            }
          }
          // }
          //   else{
          //     errorInfo(errcode, message);
          //   };
        });

      },

      //出售中加载更多
      loadMore() {
        this.loading = true;
        setTimeout(() => {
          this.page++;
          if(this.isShowSale == 0){
            this.getLoadGoodList();//出售中加载更多
          }else{
            this.getLoadGoodOut();//已售出加载更多
          }

          this.loading = false;
        }, 1000);
      },

      //点击切换导航
      userNav(state){
        this.page = 1;
        if(state == 0){
          this.isShowSale = 0;

        }else{
          this.isShowSale = 1;

        }

      },

      //操作
      goodsOperation(index){
        // var flag = document.getElementsByClassName('classflag');
        // flag.setAttribute('display', 'none');
        // console.log(this.$refs.infoDialog);
        // // this.$refs.infoDialog.style.display = 'none';
        // console.log(this.$refs.infoDialog);
        // let showOperation = e.target.nextElementSibling;
        // showOperation.className = 'info_more_dialog show';

        this.index =index;
      },

      //下架
      goLowerShelf(id,e){

        let showOperation = e.target.parentElement;
        showOperation.className = 'info_more_dialog';
        let params = {
          token:'8f484c6443df07e1167f498381fa26e85c41e63d',
          goods_id:id,
          goods_type:1,
        };
        marketPostReq('/goods/delGoods',params).then(res=>{
          let {errcode,message,content} = res ;

          if(errcode == 0){
            this.getShopCustomerGoods();
          }
        });

      },

      //已售
      goSoldBtn(id,e){
        console.log(id)
        let showOperation = e.target.parentElement;
        showOperation.className = 'info_more_dialog';
        let params = {
          token:'8f484c6443df07e1167f498381fa26e85c41e63d',
          goods_id:id,
          goods_type:2,
        };
        marketPostReq('/goods/delGoods',params).then(res=>{
          let {errcode,message,content} = res ;

          if(errcode == 0){
            this.getShopCustomerGoods();
          }
        });
      },

      //去详情页
      goGoodsDetail(id){
        this.$router.push({path:'/home/goodDetail?goods_id='+id})
      },


      //编辑
      infoEdit(){
        this.disableFocus = false;
        this.isShowEdit = true;
        this.focusState = true;

      },

      //保存
      infoPreservation(){
        this.disableFocus = true;
        this.isShowEdit = false;
        this.focusState = false;
        console.log(this.information.introduce);
        let params = {
          token:'8f484c6443df07e1167f498381fa26e85c41e63d',
          introduce:this.information.introduce,
        };
        marketPostReq('/customer/changeIntroduce',params).then(res=>{
          let {errcode,message,content} = res ;

          if(errcode == 0){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }
        });

      },

    },
    directives: {
      focus: {
        //根据focusState的状态改变是否聚焦focus
        update: function (el, value) {    //第二个参数传进来的是个json
          if (value) {
            el.focus()
          }
        }
      }
    },
    created(){
      if(this.$route.query.isShowSale == 0 ){
        this.isShowSale = 0;
      }else{
        this.isShowSale = 1;
      }
      console.log(this.$route.query.isShowSale)
      this.$nextTick(()=>{
        this.getShopCustomerGoods();


      })
    },

  }
</script>

<style scoped lang="scss">
  /*.show{*/
    /*display: block;*/
  /*}*/
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
          width:88px;
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
        .user_information_preservation{
          float: right;
          width:88px;
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
          right:0;
          top:0;
          width:30%;
          height:60px;
          /*position: absolute;*/
          /*top:24px;*/
          /*right:30px;*/
          /*width:48px;*/
          /*height:12px;*/
          /*background:url("../../../static/img/info_more.png") no-repeat;*/
          /*background-size:100% 100%;*/
          img{
            position: absolute;
            top:24px;
            right:30px;
            width:48px;
            height:12px;
           }
        }
        .info_more_dialog{
          width:100%;
          height:100%;
          position: absolute;
          left:0;
          top:0;
          border-radius:30px;
          background:rgba(0,0,0,.3);
          padding-top:100px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          display: none;
          &.show{
            display: block;
          }
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
          display: none;
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

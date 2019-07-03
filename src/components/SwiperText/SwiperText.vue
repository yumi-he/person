<template>
  <div>
    <div class="swiperText-wrap" id="swiperText-wrap">
      <div class="swiper-container">
        <ul class="swiper-wrapper">
          <li class="swiper-slide active">
            <label>最近上新<em></em></label>
          </li>
          <li class="swiper-slide">
            <label>关注收藏<em></em></label>
          </li>
          <li class="swiper-slide">
            <label>手机数码<em></em></label>
          </li>
          <li class="swiper-slide">
            <label>服装鞋袜<em></em></label>
          </li>
          <li class="swiper-slide">
            <label>家居电器<em></em></label>
          </li>
          <li class="swiper-slide">
            <label>美容美妆<em></em></label>
          </li>
          <li class="swiper-slide">
            <label>文字7<em></em></label>
          </li>
        </ul>
        <!--<div class="swiper-button-prev"></div>-->
        <!--<div class="swiper-button-next"></div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper/dist/js/swiper.min.js'
  import 'swiper/dist/css/swiper.min.css'
  export default {
    name: 'SwiperText',
    mounted() {
      new Swiper('#swiperText-wrap .swiper-container', {
        // slidesPerView: 'auto',
        centeredSlides: false,
        slidesOffsetAfter : 120,
        spaceBetween: 0,
        slidesPerView : 7
        // slidesPerGroup : 1,
      });
    },
  }
</script>

<style lang="scss" scoped>
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
</style>

<template>
  <div id="goTop">
    <div class="goTop" v-show="goTopShow" @click="goTop"><i class="goTopIcon"></i></div>
  </div>
</template>
<script>
  export default {

    data(){
      return{
        scrollTop: '',
        goTopShow:false,
      }
    },
    methods:{
      handleScroll () {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(this.scrollTop>500){
          this.goTopShow=true
        }
      },
      goTop(){
        let timer=null,_that=this;
        cancelAnimationFrame(timer)
        timer=requestAnimationFrame(function fn(){
          if(_that.scrollTop>0){
            _that.scrollTop-=50;
            document.body.scrollTop = document.documentElement.scrollTop = _that.scrollTop;
            timer=requestAnimationFrame(fn)
          }else {
            cancelAnimationFrame(timer);
            _that.goTopShow=false;
          }
        })
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed(){
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
</script>

<style scoped>
  .goTop{
    position: fixed;
    right: 20px;
    bottom: 50px;
    width: 50px;
    height: 50px;
  }
  .goTop:hover{
    /*background:rgba(0,0,0,.85);*/
  }
  .goTopIcon{
    display: block;
    width: 50px;
    height: 50px;
    /*background:red;*/
    background:url("../../../static/img/top.png") no-repeat;
    background-size:100% 100%;
  }
</style>

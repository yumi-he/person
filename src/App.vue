<template>
  <div id="app">
    <router-view/>
    <!--<GoTop/>-->
  </div>
</template>

<script>
  import GoTop from './components/GoTop/GoTop.vue'
export default {
  name: 'App',
  components:{
    GoTop
  }
}
</script>

<style lang="scss" scoped>
  #app{
    width: 100%;
    height:auto;
    background-color: #F2F2F2;
    position: relative;
    overflow: hidden;
    padding-bottom: 150px;
  }
</style>

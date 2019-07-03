import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/Home/Home.vue'
import SearchResult from '../pages/SearchResult/SearchResult.vue'
import GoodDetail from '../pages/GoodDetail/GoodDetail.vue'
import OtherGoodDetail from '../pages/OtherGoodDetail/OtherGoodDetail.vue'
import Release from '../pages/Release/Release.vue'
import ModifyCommodity from '../pages/ModifyCommodity/ModifyCommodity.vue'
import UserInformation from '../pages/UserInformation/UserInformation.vue'
import OthersInformation from '../pages/OthersInformation/OthersInformation.vue'
import MyFans from '../pages/MyFans/MyFans.vue'
import MyConcern from '../pages/MyConcern/MyConcern.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Home},
    {path: '/searchResult', component: SearchResult},
    {path: '/home/goodDetail', component: GoodDetail},
    {path: '/home/otherGoodDetail', component: OtherGoodDetail},
    {path: '/release', component: Release},
    {path: '/modifyCommodity', component: ModifyCommodity},
    {path: '/userInformation', component: UserInformation},
    {path: '/othersInformation', component: OthersInformation},
    {path: '/home/myFans', component: MyFans},
    {path: '/home/myConcern', component: MyConcern}
  ]
})

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/indexPage.vue'
import ImageDetail from '../views/home/imageDetail.vue'
import videoIndex from '../views/video-detail/videoIndex.vue'
import NewHome from '@/views/home/newHome.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/image-detail',
    name: 'ImageDetail',
    component: ImageDetail,
  },
  {
    path: '/video-detail',
    name: 'videoIndex',
    component: videoIndex,
  },
  {
    path: '/newhome',
    name: 'newhome',
    component: NewHome,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

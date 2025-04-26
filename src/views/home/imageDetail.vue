<template>
  <div class="image-detail">
    <div class="header">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="image-container">
      <van-swipe :loop="false" :show-indicators="false" @change="handleSwipeChange">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image.url" class="detail-image" @click="showFullscreen(index)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="content-container">
      <div class="description">{{ description }}</div>
    </div>

    <!-- 全屏图片展示 -->
    <van-popup
      v-model:show="showFullscreenPopup"
      :style="{ width: '100%', height: '100%' }"
      :close-on-click-overlay="false"
    >
      <div class="fullscreen-container">
        <van-swipe
          :loop="false"
          :show-indicators="false"
          :initial-swipe="currentImageIndex"
          @change="handleFullscreenSwipeChange"
        >
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img :src="image.url" class="fullscreen-image" />
          </van-swipe-item>
        </van-swipe>
        <van-icon name="cross" class="close-icon" @click="closeFullscreen" />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showFullscreenPopup = ref(false)
const currentImageIndex = ref(0)

// 模拟多张图片数据
const images = ref([
  {
    url: route.query.url || '',
    title: route.query.title || '',
    description: route.query.description || '',
  },
  {
    url: 'https://picsum.photos/400/600?random=1',
    title: '图片2',
    description: '这是第二张图片的描述',
  },
  {
    url: 'https://picsum.photos/400/600?random=2',
    title: '图片3',
    description: '这是第三张图片的描述',
  },
])

const title = ref(route.query.title || '')
const description = ref(route.query.description || '')

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理滑动切换
const handleSwipeChange = (index) => {
  currentImageIndex.value = index
}

// 处理全屏滑动切换
const handleFullscreenSwipeChange = (index) => {
  currentImageIndex.value = index
}

// 显示全屏图片
const showFullscreen = (index) => {
  currentImageIndex.value = index
  showFullscreenPopup.value = true
}

// 关闭全屏图片
const closeFullscreen = () => {
  showFullscreenPopup.value = false
}
</script>

<style lang="scss" scoped>
.image-detail {
  min-height: 100vh;
  background-color: #fff;
  overflow-x: hidden;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.back-icon {
  font-size: 20px;
  margin-right: 16px;
  cursor: pointer;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.image-container {
  margin-top: 44px;
  width: 100%;
  height: 50vh;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-container {
  padding: 16px;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.fullscreen-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.fullscreen-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
}
</style>

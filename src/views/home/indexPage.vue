<template>
  <div class="page-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      :title="`xushaomeng`"
      left-text="发现"
      right-text="callMe"
      fixed
      placeholder
      @click="scrollToTop"
      @click-right="callMe"
      class="nav-bar"
    />

    <!-- 内容区域 -->
    <div class="home-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="waterfall-container">
          <div class="waterfall-column">
            <div v-for="(item, index) in leftItems" :key="'left-' + index" class="waterfall-item">
              <div class="media-container" :style="{ paddingTop: item.ratio + '%' }">
                <template v-if="item.type === 'video'">
                  <img
                    :src="item.coverUrl || item.url"
                    class="media-content"
                    @click="playVideo(item)"
                  />
                  <div class="play-icon" @click="playVideo(item)">
                    <van-icon name="play-circle-o" size="40" />
                  </div>
                </template>
                <img
                  v-else
                  :src="item.url"
                  class="media-content"
                  @click="showFullscreenImage(item)"
                />
              </div>
              <div class="item-content" @click="goToDetail(item)">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-description">
                  <span>{{ item.description }}</span>
                </div>
              </div>
              <div class="item-footer">
                <div class="user-info">
                  <img :src="item.userAvatar" class="user-avatar" />
                  <span class="user-nickname">{{ item.userNickname }}</span>
                </div>
                <div class="like-button" @click="handleLike(item)">
                  <van-icon
                    :name="item.liked ? 'thumb-circle' : 'thumb-circle-o'"
                    :color="item.liked ? '#ff4d4f' : ''"
                  />
                  <span class="like-count">{{ item.likes }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="waterfall-column">
            <div v-for="(item, index) in rightItems" :key="'right-' + index" class="waterfall-item">
              <div class="media-container" :style="{ paddingTop: item.ratio + '%' }">
                <template v-if="item.type === 'video'">
                  <img
                    :src="item.coverUrl || item.url"
                    class="media-content"
                    @click="playVideo(item)"
                  />
                  <div class="play-icon" @click="playVideo(item)">
                    <van-icon name="play-circle-o" size="40" />
                  </div>
                </template>
                <img
                  v-else
                  :src="item.url"
                  class="media-content"
                  @click="showFullscreenImage(item)"
                />
              </div>
              <div class="item-content" @click="goToDetail(item)">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-description">
                  <span>{{ item.description }}</span>
                </div>
              </div>
              <div class="item-footer">
                <div class="user-info">
                  <img :src="item.userAvatar" class="user-avatar" />
                  <span class="user-nickname">{{ item.userNickname }}</span>
                </div>
                <div class="like-button" @click="handleLike(item)">
                  <van-icon
                    :name="item.liked ? 'thumb-circle' : 'thumb-circle-o'"
                    :color="item.liked ? '#ff4d4f' : ''"
                  />
                  <span class="like-count">{{ item.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <van-loading v-if="loading" class="loading" />
      </van-pull-refresh>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" fixed placeholder>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">发现</van-tabbar-item>
      <van-tabbar-item icon="friends-o">消息</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showImagePreview, showDialog } from 'vant'
import { useRouter } from 'vue-router'
const router = useRouter()
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const leftItems = ref([])
const rightItems = ref([])
const activeTab = ref(0)
const clickCount = ref(0)
const clickTimer = ref(null)
const isScrolling = ref(false)
// 模拟数据
const mockData = [
  {
    type: 'image',
    url: 'https://picsum.photos/400/600.jpg',
    ratio: 150,
    likes: 0,
    liked: false,
    title: '美丽的风景1111111111111111111',
    description:
      '这是一张美丽的风景照片，展现了自然的魅力。这是一张美丽的风景照片，展现了自然的魅力。这是一张美丽的风景照片，展现了自然的魅力。',
    userAvatar: 'https://picsum.photos/40/40?random=1',
    userNickname: '风景摄影师',
  },
  {
    type: 'video',
    url: 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209105011F0zPoYzHry.mp4',
    coverUrl: 'https://picsum.photos/400/500',
    ratio: 125,
    likes: 0,
    liked: false,
    title: '精彩视频',
    description:
      '这是一个精彩的视频内容。这是一个精彩的视频内容。这是一个精彩的视频内容。这是一个精彩的视频内容。',
    userAvatar: 'https://picsum.photos/40/40?random=2',
    userNickname: '视频创作者',
  },
  {
    type: 'image',
    url: 'https://picsum.photos/400/500',
    ratio: 125,
    likes: 0,
    liked: false,
    title: '城市夜景',
    description: '城市夜晚的美丽景色。城市夜晚的美丽景色。城市夜晚的美丽景色。城市夜晚的美丽景色。',
    userAvatar: 'https://picsum.photos/40/40?random=3',
    userNickname: '城市记录者',
  },
  {
    type: 'video',
    url: 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4',
    coverUrl: 'https://picsum.photos/400/600',
    ratio: 150,
    likes: 0,
    liked: false,
    title: '生活记录',
    description:
      '记录生活中的美好瞬间。记录生活中的美好瞬间。记录生活中的美好瞬间。记录生活中的美好瞬间。',
    userAvatar: 'https://picsum.photos/40/40?random=4',
    userNickname: '生活记录者',
  },
  {
    type: 'image',
    url: 'https://picsum.photos/400/700',
    ratio: 175,
    likes: 0,
    liked: false,
    title: '自然风光',
    description: '大自然的鬼斧神工。大自然的鬼斧神工。大自然的鬼斧神工。大自然的鬼斧神工。',
    userAvatar: 'https://picsum.photos/40/40?random=5',
    userNickname: '自然探索者',
  },
]
// 监听滚动
const handleScroll = (e) => {
  const target = e.target
  const scrollHeight = target.scrollHeight
  const scrollTop = target.scrollTop
  const clientHeight = target.clientHeight

  // 当距离底部小于50px时触发加载
  if (scrollHeight - scrollTop - clientHeight < 50 && !loading.value) {
    loadData()
  }
}

const callMe = () => {
  showDialog({
    title: '真的很喜欢敲代码！！',
    message: '代码是写出来给人看的，附带能在机器上运行。',
  }).then(() => {
    // on close
  })
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 这里应该调用实际的API
    const newItems = mockData.map((item) => ({
      ...item,
      url: item.url + `?page=${page.value}`,
    }))

    // 计算当前左右两列的数量
    const totalItems = leftItems.value.length + rightItems.value.length

    // 分配数据到左右两列，保持严格的左右交替
    newItems.forEach((item, index) => {
      const currentIndex = totalItems + index
      if (currentIndex % 2 === 0) {
        leftItems.value.push(item)
      } else {
        rightItems.value.push(item)
      }
    })

    page.value++
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  try {
    // 重置数据
    page.value = 1
    leftItems.value = []
    rightItems.value = []
    // 重新加载数据
    await loadData()
  } finally {
    refreshing.value = false
  }
}

// 双击顶部返回
const scrollToTop = () => {
  // 如果正在滚动，不处理点击
  if (isScrolling.value) return

  clickCount.value++

  if (clickCount.value === 1) {
    // 第一次点击，设置定时器
    clickTimer.value = setTimeout(() => {
      clickCount.value = 0
    }, 300)
  } else if (clickCount.value === 2) {
    // 第二次点击，清除定时器并执行滚动
    clearTimeout(clickTimer.value)
    clickCount.value = 0

    const homeContent = document.querySelector('.home-content')
    if (homeContent) {
      isScrolling.value = true
      homeContent.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      // 滚动结束后重置状态
      setTimeout(() => {
        isScrolling.value = false
      }, 500)
    }
  }
}

// 处理点赞
const handleLike = (item) => {
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
}

// 跳转到图片详情页
const goToDetail = (item) => {
  router.push({
    path: '/image-detail',
    query: {
      url: item.url,
      title: item.title,
      description: item.description,
    },
  })
}

// 播放视频
const playVideo = (item) => {
  router.push({
    path: '/video-detail',
  })
  sessionStorage.setItem('videoDetail', JSON.stringify(item))
}
// 显示全屏图片
const showFullscreenImage = (item) => {
  console.log('dianj ', item)

  showImagePreview([item.url])
}

onMounted(() => {
  loadData()
  const homeContent = document.querySelector('.home-content')
  if (homeContent) {
    homeContent.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  // 清理定时器
  if (clickTimer.value) {
    clearTimeout(clickTimer.value)
  }
  const homeContent = document.querySelector('.home-content')
  if (homeContent) {
    homeContent.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
:deep(.van-popup--center) {
  max-width: 100vw !important;
}
.page-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .home-content {
    flex: 1;
    padding: 0;
    background-color: #f5f5f5;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    position: relative;

    &::-webkit-scrollbar {
      display: none;
    }

    .waterfall-container {
      display: flex;
      justify-content: center;
      gap: 2px;
      padding-bottom: 20px;

      .waterfall-column {
        flex: 1;
        max-width: 50%;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .waterfall-item {
          margin-bottom: 0;
          background: #fff;
          overflow: hidden;
          border-radius: 8px 8px 0 0;

          .media-container {
            width: 100%;
            position: relative;

            .media-content {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              cursor: pointer;
            }

            .play-icon {
              position: absolute;
              left: 12px;
              bottom: 12px;
              color: #fff;
              cursor: pointer;
              z-index: 1;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
          }

          .item-content {
            padding: 12px;
            padding-bottom: 0;
            width: 100%;
            box-sizing: border-box;
            cursor: pointer;

            .item-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
              box-sizing: border-box;
            }

            .item-description {
              font-size: 12px;
              color: #666;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              width: 100%;
              box-sizing: border-box;

              span {
                display: inline;
              }
            }
          }

          .item-footer {
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f0f0f0;
            width: 100%;
            box-sizing: border-box;

            .user-info {
              display: flex;
              align-items: center;
              flex: 1;
              min-width: 0;
              margin-right: 8px;
              overflow: hidden;

              .user-avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                margin-right: 8px;
                flex-shrink: 0;
              }

              .user-nickname {
                font-size: 14px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                min-width: 0;
              }
            }

            .like-button {
              display: flex;
              align-items: center;
              cursor: pointer;
              transition: background-color 0.3s;
              flex-shrink: 0;

              &:hover {
                background-color: #f5f5f5;
              }

              .van-icon {
                font-size: 20px;
              }

              .like-count {
                margin-left: 4px;
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 16px;
      background-color: #f5f5f5;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .video-popup {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #000;

    .fullscreen-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .video-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: #fff;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .video-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        box-sizing: border-box;
      }

      .video-description {
        font-size: 14px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          min-width: 0;
        }
      }
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
  }

  .detail-popup {
    height: 100%;
    display: flex;
    flex-direction: column;

    .detail-header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      box-sizing: border-box;

      .detail-title {
        font-size: 18px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
        margin-right: 16px;
      }
    }

    .detail-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .detail-description {
        font-size: 16px;
        line-height: 1.6;
        color: #333;
      }
    }
  }

  .nav-bar {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    pointer-events: auto;
  }

  .image-popup {
    position: relative;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>

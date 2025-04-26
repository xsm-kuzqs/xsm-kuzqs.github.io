<template>
  <div class="video-detail">
    <div class="top-con"><van-icon name="arrow-left" color="#fff" size="40" @click="goBack" /></div>
    <!-- 视频播放区域 -->
    <div class="video-container" @click="handleVideoClick">
      <video ref="videoPlayer" :src="videoInfo.url" controls class="video-player"></video>
      <div v-if="!isPlaying" class="play-overlay" @click.stop="handleVideoClick">
        <van-icon name="play-circle-o" size="80" color="#fff" />
      </div>
    </div>

    <!-- 视频信息区域 -->
    <div v-if="videoInfo.url === 10" class="video-info">
      <div class="title">{{ videoInfo.title }}</div>
      <div class="description">{{ videoInfo.description }}</div>

      <div class="action-con">
        <!-- 用户信息 -->
        <div class="user-info">
          <img :src="videoInfo.userAvatar" class="user-avatar" />
          <span class="user-nickname">{{ videoInfo.userNickname }}</span>
        </div>

        <!-- 点赞按钮 -->
        <div class="like-button" @click="handleLike">
          <van-icon
            :name="videoInfo.liked ? 'thumb-circle' : 'thumb-circle-o'"
            :color="videoInfo.liked ? '#ff4d4f' : ''"
          />
          <span class="like-count">{{ videoInfo.likes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// const route = useRoute()
const router = useRouter()
const videoPlayer = ref(null)
const isPlaying = ref(false)

// 视频信息
const videoInfo = ref({
  url: '',
  title: '',
  description: '',
  coverUrl: '',
  userAvatar: '',
  userNickname: '',
  likes: 0,
  liked: false,
})

// window.addEventListener('click', () => {

// })

// 处理视频点击
const handleVideoClick = async () => {
  console.log('点击')

  if (!videoPlayer.value) return

  try {
    if (videoPlayer.value.paused) {
      await videoPlayer.value.play()
      isPlaying.value = true
    } else {
      videoPlayer.value.pause()
      isPlaying.value = false
    }
  } catch (error) {
    console.error('播放失败:', error)
  }
}

// 获取视频信息
onMounted(() => {
  const info = sessionStorage.getItem('videoDetail')
  if (info) {
    videoInfo.value = JSON.parse(info)
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理点赞
const handleLike = () => {
  videoInfo.value.liked = !videoInfo.value.liked
  videoInfo.value.likes += videoInfo.value.liked ? 1 : -1
}

// 组件卸载时暂停视频
onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
})
</script>

<style lang="scss" scoped>
.video-detail {
  height: 100vh;
  background-color: #ffffff;
  position: relative;
  .top-con {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding-top: 12px;
  }
  .nav-bar {
    // background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .video-container {
    width: 100%;
    background-color: #000;
    position: relative;
    height: 100vh;
    cursor: pointer;
    .video-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }
  }

  .video-info {
    padding: 16px;
    background-color: #fff;

    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }

    .description {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .action-con {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .user-info {
        display: flex;
        align-items: center;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .user-nickname {
          font-size: 16px;
          color: #333;
        }
      }

      .like-button {
        display: flex;
        align-items: center;
        cursor: pointer;

        .van-icon {
          font-size: 24px;
        }

        .like-count {
          margin-left: 8px;
          font-size: 16px;
          color: #666;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
// 导入Vue的核心功能：生命周期钩子、响应式引用和依赖注入
import { onMounted, ref, provide } from 'vue'
// 导入Vue Router的路由功能
import { useRoute } from 'vue-router'
// 导入音乐相关的状态和动作
import { useMusicAction } from '@/store/music'
// 导入获取用户账户信息的函数
import { getUserAccountFn } from '@/utils/userInfo'
// 导入全局标志状态
import { useFlags } from '@/store/flags'
// 导入布局组件
import Header from '@/layout/BaseHeader/index.vue'
import Aside from '@/layout/BaseAside/index.vue'
import Bottom from '@/layout/BaseBottom/index.vue'
// 导入功能组件
import MusicDetail from '@/components/MusicDetail/index.vue'
import MusicPlayer, { MusicPlayerInstanceType } from '@/components/MusicPlayer/index.vue'
import Login from '@/components/Login/index.vue'
// 导入用户信息状态管理
import { useUserInfo } from '@/store'
import PlayListDrawer from '@/components/PlayListDrawer/index.vue'
// 导入快捷键功能
import '@/utils/shortcutKey'
// 导入设置状态管理
import { useSettings } from '@/store/settings'
// 导入上下文菜单功能
import { useContextMenu } from './components/ContextMenu/useContextMenu'

// 创建音频播放器实例的响应式引用
const audioInstance = ref<MusicPlayerInstanceType>()
// 创建登录组件的响应式引用
const login = ref()
// 获取音乐状态和动作
const music = useMusicAction()
// 获取全局标志状态
const flags = useFlags()
// 获取当前路由
const route = useRoute()
// 获取用户信息状态
const store = useUserInfo()
// 获取设置状态
const settings = useSettings()
// 创建刷新计数器，用于登录后强制刷新组件
const refresh = ref(0) // 登录完成后强制刷新组件
// 加载用户缓存信息
store.loadCache()

// 创建并通过依赖注入提供全局菜单状态
const { MENU_KEY, activeMenu, setActiveMenu } = useContextMenu()
provide(MENU_KEY, { activeMenu, setActiveMenu })

// 组件挂载后的初始化逻辑
onMounted(() => {
  // 如果音频实例已存在，将其挂载到window对象上，使其全局可访问
  if (audioInstance.value !== undefined) {
    window.$audio = audioInstance.value!
    console.log('初始化全局$audio：', window.$audio)
  }
  // 将登录组件实例挂载到window对象上
  window.$login = login.value!

  // 添加全局点击事件监听器，点击任意处时关闭播放列表抽屉
  document.addEventListener('click', () => {
    flags.isOpenDrawer = false
  })

  // 根据设置状态，为body添加粗体样式
  if (settings.state.bold) {
    document.body.classList.add('bold')
  }
})

// 监听登录事件，登录成功后递增refresh值，触发组件刷新
store.addEvent('login', () => {
  refresh.value = refresh.value + 1
})

// 初始化时获取用户账户信息
getUserAccountFn()
</script>

<template>
  <!-- 两个固定的背景层，用于实现背景过渡效果 -->
  <div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>

  <!-- 音乐详情弹窗组件，通过v-model绑定显示/隐藏状态 -->
  <MusicDetail v-model="flags.isOpenDetail" />

  <!-- 播放列表抽屉组件，通过v-model绑定显示/隐藏状态 -->
  <PlayListDrawer v-model="flags.isOpenDrawer" />

  <!-- 主内容区域 -->
  <div style="height: 100%; position: relative; z-index: auto">
    <div id="box">
      <!-- 侧边栏组件 -->
      <Aside></Aside>

      <!-- 主要内容区域 -->
      <div class="main">
        <!-- 顶部导航栏组件 -->
        <Header></Header>

        <!-- 页面主体内容，使用router-view动态渲染当前路由对应的组件 -->
        <div class="body">
          <router-view v-slot="{ Component }">
            <!-- 使用component动态组件渲染路由组件，并通过key属性绑定refresh值，实现登录后强制刷新 -->
            <component :key="refresh" :is="Component"></component>
          </router-view>
        </div>
      </div>
    </div>

    <!-- 底部留出20px间距 -->
    <div style="height: 20px"></div>
  </div>

  <!-- 底部播放控制栏，根据是否有音乐URL动态添加显示/隐藏类名 -->
  <Bottom :class="[music.state.musicUrl.length ? 'bottom-show' : 'bottom-visible']">
    <template #default>
      <!-- 使用teleport组件，根据音乐详情页是否打开，将播放器渲染到不同位置 -->
      <teleport :disabled="!flags.isOpenDetail" to=".music-detail-container .music-detail-bottom">
        <!-- 音乐播放器组件 -->
        <MusicPlayer ref="audioInstance" @cutSong="music.cutSongHandler" @playEnd="music.playEnd"
          :songs="music.state?.songs" :src="music.state.musicUrl"></MusicPlayer>
      </teleport>
    </template>
  </Bottom>

  <!-- 登录组件 -->
  <Login ref="login"></Login>
</template>

<style lang="less">
// 导入基础样式文件
@import '@/assets/base.less';

// 底部播放控制栏显示样式
.bottom-show {
  visibility: visible; // 可见
  opacity: 1; // 不透明
}

// 底部播放控制栏隐藏样式
.bottom-visible {
  visibility: hidden; // 隐藏
  opacity: 0; // 完全透明
}
</style>

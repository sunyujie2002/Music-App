<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useUserInfo} from "@/store";

interface Props {
  audio: HTMLAudioElement
}
const props = defineProps<Props>()
const volume = ref(0)
const store = useUserInfo()

watch(() => props.audio, (value) => {
  volume.value = Number(localStorage.getItem('volume') || 1) * 100
  window.$audio.el.volume = formatVolume.value
  store.volume = formatVolume.value

})
const volumeHandler = (target: boolean) => {
  volume.value = target ? 0 : Number(localStorage.getItem('volume') || 1) * 100
  window.$audio.el.volume = formatVolume.value
  store.volume = formatVolume.value
}
let timer: NodeJS.Timeout
const input = () => {
  window.$audio.el.volume = formatVolume.value
  clearTimeout(timer)
  timer = setTimeout(() => {
      localStorage.setItem('volume', String(formatVolume.value))
  }, 50)
}
const change = () => {
  store.volume = formatVolume.value
}
const formatVolume = computed(() => {
  return volume.value / 100
})
</script>

<template>
    <div class="volume-box">
        <i
          v-if="volume !== 0"
          @click="volumeHandler(true)"
          class="iconfont icon-yinliang"/>
        <i
          v-else
          @click="volumeHandler(false)"
          class="iconfont icon-jingyin"/>
        <el-slider
          v-model="volume"
          @change="change"
          @input="input"
          :show-tooltip="false"
          :show-stops="false"
          style="width: 80px;overflow: hidden"
        />
    </div>
</template>

<style scoped lang="less">
.volume-box {
    width: 150px;
    display: flex;
    align-items: center;
    .icon-yinliang {
        font-size: 18px;
    }
    .iconfont {
        cursor: pointer;
        //transform: translateY(-50%);
        //position: absolute;
        //top: 50%;
        color: @text;
        margin-right: 8px;
    }
    .iconfont:hover {
        color: white;
    }
}

:deep(.el-slider) {
    //width: 130px !important;
}
:deep(.el-slider__button-wrapper) {
    cursor: pointer !important;
}
:deep(.el-slider__button) {
    display: none;
}
:deep(.el-slider__bar) {
    background-color: rgb(236,65,65);
    height: 5px;
    border-radius: 3px;
}
:deep(.el-slider__runway) {
    height: 5px;
    background-color: rgba(255,255,255, 0.1);
}

</style>

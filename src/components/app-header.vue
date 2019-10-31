<template>
  <m-navbar :theme="'info'">
    <m-navbar-brand>
      <i class="side-switch" :class="{ 'el-icon-more': !mini, 'el-icon-more-outline': mini}" @click="handleSwitchSide"></i>
    </m-navbar-brand>
    <m-nav align="right">
      <m-nav-item padding="0 5px">
        <a href="#" @click.stop.prevent="handleSwitchScreen">
          <i class="fa" :class="isFullScreen ? 'fa-compress' : 'fa-expand'"></i>
        </a>
      </m-nav-item>
    </m-nav>
  </m-navbar>
</template>
<script type="text/javascript">
import {
  requestFullScreen,
  exitFullscreen
} from '@/utils'
export default {
  name: 'app-header',
  data () {
    return {
      mini: false,
      isFullScreen: false,
      showAside: true
    }
  },
  methods: {
    handleSwitchSide () {
      this.$emit('switch', this.mini = !this.mini)
    },
    handleSwitchScreen () {
      this.isFullScreen ? exitFullscreen() : requestFullScreen()
      this.isFullScreen = !this.isFullScreen
    }
  }
}
</script>
<style type="text/css">
  .side-switch {
    display: inline-block;
    font-size: 32px;
    cursor: pointer;
    color: inherit;
    margin-top: 10px;
  }
  .side-switch:hover {
    color: #fff;
  }
</style>

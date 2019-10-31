<template>
<div class="app-footer-box">
  <span class="footer-text"><el-tag size="mini">{{ copyright }}</el-tag></span>
</div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      copyright: window.APP_INFO.copyright
    }
  }
}
</script>

<style type="text/css">
  .app-footer-box {
    height: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
  .app-footer-box .footer-text {
    color: #8b949e;
  }
</style>

<script setup lang="ts"></script>

<template>
  <section class="footer">
    <section class="footer-content">
      <div class="footer-div">
        {{ `© ${new Date().getFullYear()} Jridge, Inc. All Rights Reserved` }}
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.footer {
  background: $color-box-background;
  border-bottom: env(safe-area-inset-bottom) solid transparent;
  position: fixed;
  box-shadow: 0 -1px 3px 0 rgba(26, 26, 26, 0.1);
  z-index: 2;
  bottom: 0;
  width: 100%;
  .footer-content {
    height: $footer-bar-height;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-common;
    .footer-div {
      text-align: center;
    }
  }
}
</style>

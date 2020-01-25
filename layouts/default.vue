<template>
  <div>
    <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-header>
        <div class="logo" />
        <a-menu
          v-model="currentRoute"
          :style="{ lineHeight: '64px' }"
          theme="dark"
          mode="horizontal"
          class="navbar"
        >
          <a-menu-item key="/practice1"
            ><nuxt-link to="/practice1">Practice 1</nuxt-link></a-menu-item
          >
          <a-menu-item key="/practice2"
            ><nuxt-link to="/practice2">Practice 2</nuxt-link></a-menu-item
          >
          <a-menu-item key="/practice3"
            ><nuxt-link to="/practice3">Practice 3</nuxt-link></a-menu-item
          >
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px">
        <div
          :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"
        >
          <nuxt />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Michael Vietluzhskykh ©2020
      </a-layout-footer>
    </a-layout>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
  </div>
</template>

<script>
import 'ant-design-vue/dist/antd.css'
import '@/assets/navbar.scss'
import '@/assets/form.scss'
export default {
  data() {
    return {
      currentRoute: [this.$nuxt.$route.path]
    }
  }
}
</script>

<template>
  <div id="app">
    <Nav :user="user" />
    <div class="router-view-wrapper" :class="{home: home}" >
      <router-view :user="user" ></router-view>
    </div>
  </div>
</template>

<script>
import Nav from './components/Nav'

export default {
  name: 'app',
  components: {
    Nav
  },
  props: ['user'],
  computed: {
    home() {
      return this.$route.name === "home" ? true : false;
    }
  }
}
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Playfair+Display+SC);
@import url(https://fonts.googleapis.com/css?family=Montserrat|Playfair+Display+SC);
@import './assets/settings.scss';

#app {
  font-family: $title-font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

.router-view-wrapper {
  margin: 40px 0;
}

@media (min-width: 500px) {
  .router-view-wrapper {
    margin: 60px 0;
  }
}
</style>

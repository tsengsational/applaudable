<template>
  <div id="app">
    <Nav/>
    <div class="router-view-wrapper" >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Nav from './components/Nav'

export default {
  name: 'app',
  components: {
    Nav
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
  margin: 60px 0 40px;
}
</style>

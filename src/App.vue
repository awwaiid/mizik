<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        <img alt="Mizik logo" src="@/assets/mizik-logo-02.png" class="logo" />
      </router-link>
      <router-link to="/mizik">Play Mizik</router-link> |
      <router-link to="/leaders">Leader Board</router-link> |
      <router-link to="/synth">Synth</router-link>
    </div>
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  background-color: #c6d2de;
  padding: 0;
  margin: auto;
  height: 100vh;
  width: 100vw;
}

#nav {
  padding: 0px;
  vertical-align: text-top;
  text-align: left;

  a {
    font-weight: bold;
    color: #000;
    vertical-align: top;

    &.router-link-exact-active {
      color: #33a;
    }
  }

  .logo {
    vertical-align: top;
    width: 75px;
  }
}
</style>

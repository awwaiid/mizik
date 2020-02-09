<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        <img
          alt="Mizik logo"
          src="@/assets/mizik-logo-large.png"
          class="logo"
        />
      </router-link>
      <router-link to="/synth">Synth</router-link> |
      <router-link to="/mizik">Mizik</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 0px;
  vertical-align: text-top;
  text-align: left;

  a {
    font-weight: bold;
    color: #2c3e50;
    vertical-align: top;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .logo {
    vertical-align: top;
    width: 75px;
  }
}
</style>

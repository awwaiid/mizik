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
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: #097374;
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
    color: #fff;
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

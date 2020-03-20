<template>
  <div class="home">
    <router-link to="/mizik">
      <img
        alt="Mizik logo"
        src="@/assets/mizik-logo-02.png"
        class="splash-logo"
      />
    </router-link>
    <router-link to="/mizik">
      <h1>Click here to play Mizik!</h1>
    </router-link>
    <p>
      Welcome! Mizik is a game of memory, pattern, sound, and color. Mizik will
      play a chain of sounds, and then you repeat it back. Bonus points when the
      snaking doubles-back!
    </p>
    <p>
      Mizik is an open-source project, part of a series of experiments in web
      techology. It is a play of VueJS, WebAudio via ToneJS, PWAs, CSS
      techniques, Parse, and more.
    </p>
    <p>
      Please join us in the fun over at
      <a href="https://github.com/awwaiid/mizik">the GitHub project</a>!
    </p>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style scoped lang="scss">
.splash-logo {
  width: 50vmin;
}

.home {
  margin: 1em;

  p {
    text-align: justify;
    width: 60vmin;
    margin: 1em auto;
  }
}
</style>

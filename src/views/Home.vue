<template>
  <div class="home">
    <img
      alt="Mizik logo"
      src="@/assets/mizik-logo-large.png"
      class="splash-logo"
    />
    <h1>Mizik!</h1>
    <p>Welcome! Mizik is a game of memory, sequence, sound, and color.</p>
    <p>
      Mizik is an open-source project, part of a series of experiments in web
      techology (VueJS, WebAudio via ToneJS, PWAs, CSS techniques, Parse, ...).
      Please join us in the fun over at
      <a href="https://github.com/awwaiid/sample-mob/">the GitHub project</a>!
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
}
</style>

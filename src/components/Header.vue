<template>
  <header>
    <div class="header__container">
      <div class="header__logo">
        <img class="logo__svg" src="assets/logo.svg">
        <span class="logo__text">Modify</span>
      </div>
      <mod-navigator></mod-navigator>
    </div>
  </header>
</template>

<script>
import ModNavigator from './Navigator';

export default {
  components: {
    ModNavigator,
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.header__container {
  padding: 0 0.5em;
}

.header__logo {
  display: inline-block;
  margin: 0.5em 0 0 0.125em;
}

.logo__svg {
  height: 2.5em;
}

.logo__text {
  display: none;
}

@media (min-width: 768px) {
  .header__logo {
    margin: 0.75em 0 0 0.75em;
  }

  .logo__svg {
    height: 2em;
  }

  .logo__text {
    display: inline-block;
    position: relative;
    bottom: 0.5em;
  }
}
</style>

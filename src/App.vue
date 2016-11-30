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
  <main class="app" @click="onClickOutside">
    <mod-timetable></mod-timetable>
    <section class="controls">
      <div class="controls__container">
        <mod-search>
        </mod-search>
        <mod-info>
        </mod-info>
      </div>
    </section>
  </main>
  <footer v-once>
    <div class="footer__container">
      <div class="container__contribute">
        <div class="contribute__title">Contribute:</div>
        <a href="https://github.com/li-kai/modify" class="contribute__logo">
          <img src="assets/github.svg">
        </a>
      </div>
      <div class="container__copyright">Copyright © 2016 Modify. All rights reserved.</div>
    </div>
  </footer>
</template>

<script>
import ModNavigator from './components/Navigator';
import ModTimetable from './components/Timetable';
import ModSearch from './components/Search';
import ModInfo from './components/Info';
import store from './vuex/store';
import { onClickOutside } from './vuex/actions';

export default {
  components: {
    ModNavigator,
    ModTimetable,
    ModSearch,
    ModInfo,
  },
  store,
  vuex: {
    actions: {
      onClickOutside,
    },
  },
};
</script>

<style lang="scss">
@import './styles/base.scss';
@import './styles/main.scss';
.app {
  padding-bottom:4em;
}

.controls {
  color: #333;
  width: 100%;
  min-height: 97vh;
  margin: 1em 0;
}

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

.controls__container {
  position: relative;
  padding: 0 1em;
  margin: 0 auto;
  max-width: 1096px;
}

.footer__container {
  position: relative;
  margin: 0 auto;
  max-width: 980px;
}

.contribute__title {
  color: #ccc;
  margin-bottom: 0.2em;
}

.container__contribute {
  display: inline-block;
  margin: 0.5em 0.875em 0 0.875em;
}

.contribute__logo {
  display: block;
  height: 3em;
  width: 3em;
}

.container__copyright {
  display: table;
  margin: 0.5em auto;
  font-size: 0.75em;
  color: #ccc;
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

  .controls {
    margin-bottom: 10em;
    min-height: 17em;
  }
}
</style>

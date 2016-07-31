<template>
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
  <footer>
    <div class="footer__copyright">Copyright © 2016 Modify. All rights reserved.</div>
  </footer>
</template>

<script>
import ModTimetable from './components/Timetable';
import ModSearch from './components/Search';
import ModInfo from './components/Info';
import store from './vuex/store';
import { onClickOutside } from './vuex/actions';

export default {
  components: {
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
  padding-bottom:48px;
}

.controls {
  color: #333;
  width: 100%;
  min-height: 97vh;
  margin: 1em 0;
}

.controls__container {
  position: relative;
  padding: 0 0.5em;
  margin: 0 auto;
  max-width: 1096px;
}

.footer__copyright {
  margin: 0.5rem auto;
  color: #fff;
  position: relative;
  max-width: 980px;
}

@media (min-width: 768px) {
  .controls {
    min-height: 26.5em;
  }
}
</style>

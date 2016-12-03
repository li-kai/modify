<template>
  <body>
    <mod-header></mod-header>
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
    <mod-footer></mod-footer>
  </body>
</template>

<script>
import ModHeader from './components/Header';
import ModFooter from './components/Footer';
import ModTimetable from './components/Timetable';
import ModSearch from './components/Search';
import ModInfo from './components/Info';
import store from './vuex/store';
import { onClickOutside } from './vuex/actions';

export default {
  components: {
    ModHeader,
    ModTimetable,
    ModSearch,
    ModInfo,
    ModFooter,
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

.controls__container {
  position: relative;
  padding: 0 1em;
  margin: 0 auto;
  max-width: 1096px;
}

@media (min-width: 768px) {
  .controls {
    margin-bottom: 10em;
    min-height: 17em;
  }
}
</style>

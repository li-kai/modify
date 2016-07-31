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

.controls {
  color: #333;
  width: 100%;
  height: 97vh;
  margin: 1em 0;
}

.controls__container {
  position: relative;
  padding: 0 0.5em;
  margin: 0 auto;
  max-width: 1096px;
}

@media (min-width: 768px) {
  .controls {
    height: 26.5em;
  }
}
</style>

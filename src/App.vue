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
    <svg class="hidden">
      <symbol fill="#FFF" id="plus">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
      </symbol>
      <symbol fill="#444" id="delete">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </symbol>
      <symbol fill="#444" id="paint">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/>
        <path d="M0 20h24v4H0z" fill-opacity=".36"/>
      </symbol>
      <symbol fill="#444" id="share">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
      </symbol>
      <symbol fill="#444" id="info">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </symbol>
      <symbol fill="#FFF" id="github">
        <path d="M63.994.152C28.66.152 0 28.806 0 64.158c0 28.272 18.336 52.26 43.768 60.726 3.2.586 4.37-1.392 4.37-3.084 0-1.52-.06-5.544-.092-10.888-17.8 3.87-21.56-8.576-21.56-8.576-2.906-7.394-7.102-9.364-7.102-9.364-5.812-3.972.44-3.888.44-3.888 6.424.452 9.8 6.592 9.8 6.592 5.712 9.784 14.984 6.96 18.63 5.32.58-4.14 2.234-6.96 4.06-8.56-14.21-1.612-29.15-7.104-29.15-31.63 0-6.984 2.494-12.7 6.588-17.172-.66-1.62-2.856-8.12.628-16.932 0 0 5.374-1.72 17.6 6.56 5.104-1.42 10.58-2.128 16.02-2.152 5.44.024 10.914.734 16.024 2.154 12.22-8.28 17.58-6.56 17.58-6.56 3.496 8.81 1.3 15.316.64 16.936 4.104 4.476 6.58 10.19 6.58 17.174 0 24.586-14.966 30-29.22 31.58 2.296 1.98 4.34 5.88 4.34 11.854 0 8.556-.076 15.46-.076 17.56 0 1.706 1.154 3.7 4.4 3.074C109.68 116.396 128 92.42 128 64.156 128 28.808 99.344.152 63.994.152z"/>
      </symbol>
      <symbol fill="#333" id="download">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </symbol>
    </svg>
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

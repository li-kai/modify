<template>
  <ul class="colors">
    <li class="colors__item" v-for="n in 9" :class="'color__' + (n + 1)"
      @click="changeColor(colorsList[n])">
      <div class="item__shape"></div>
    </li>
  </ul>
</template>

<script>
import { changeModuleColor } from '../vuex/actions';
export default {
  vuex: {
    actions: {
      changeModuleColor,
    },
  },

  props: {
    module: {
      type: Object,
    },
  },

  data() {
    return {
      colorsList: [
        '#42A5F5', '#4CAF50', '#FBC02D',
        '#f64747', '#FB8C00', '#BA68C8',
        '#80CBC4', '#BDBDBD', '#90A4AE',
      ],
    };
  },

  methods: {
    changeColor(colorInHex) {
      const sheet = document.styleSheets[0];
      const rules = sheet.cssRules;

      for (let i = 0, len = rules.length; i < len; i++) {
        if (rules[i].selectorText === `.module__${this.module.ModuleCode}`) {
          rules[i].style.color = colorInHex;
          break;
        }
      }
      this.changeModuleColor(this.module, colorInHex);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

$colors-list: #42A5F5, #4CAF50, #FBC02D, #e74c3c, #FB8C00, #BA68C8, #80CBC4, #BDBDBD, #90A4AE;
@for $i from 1 through length($colors-list) {
  .color__#{$i} {
    color: nth($colors-list, $i);
  }
}

.colors {
  background: #FFF;
  z-index: 1;
  cursor: pointer;
  box-shadow: $materialBoxShadow;
  position: absolute;
  left: 0;
  top: 3.5em;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.colors:after {
  position: absolute;
  top: -0.5em;
  left: 50%;
  transform: translateX(-50%);
  content: " ";
  height: 0;
  width: 0;
  pointer-events: none;
  border-left: 0.5em solid transparent;
  border-right: 0.5em solid transparent;
  border-bottom: 0.5em solid rgba(0, 0, 0, 0.12);
}

.colors__item {
  flex: 1 0 33.3%;
  height: 3em;
}

.colors__item:hover {
  background: rgba(0, 0, 0, 0.12);
}

.item__shape {
  background: currentColor;
  margin: 1em auto;
  height: 1em;
  width: 1em;
  border-radius: 0.5em;
}
</style>

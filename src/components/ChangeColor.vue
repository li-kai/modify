<template>
  <transition name="color">
  <ul class="colors">
    <li class="colors__item" v-for="n in 9"
      @click="changeColor(colorsList[n - 1])">
      <div class="item__shape" :class="'color__' + n"></div>
    </li>
  </ul>
  </transition>
</template>

<script>
import { colorsList } from '../constants';
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
      colorsList,
    };
  },

  methods: {
    changeColor(colorInHex) {
      const sheet = document.styleSheets[0];
      const rules = sheet.cssRules;

      for (let i = 0, len = rules.length; i < len; i++) {
        if (rules[i].selectorText === `.module__${this.module.code}`) {
          rules[i].style.background = colorInHex;
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

$colors-list: #42A5F5, #4CAF50, #EBB72C, #e74c3c, #FF8300, #BA68C8, #7BC0BF, #607D8B, #919191;
@for $i from 1 through length($colors-list) {
  .color__#{$i} {
    background: nth($colors-list, $i);
  }
}

.colors {
  transition: all 0.3s $bezierStandardCurve;
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

.color-enter-active, .color-leave {
  opacity: 1;
}

.color-enter, .color-leave-active {
  transform: translateY(-1em);
  opacity: 0;
}

.item__shape {
  margin: 1em auto;
  height: 1em;
  width: 1em;
  border-radius: 0.5em;
}
</style>

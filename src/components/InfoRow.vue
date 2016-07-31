<template>
  <tbody>
    <tr class="table__module">
      <td class="module__color">
        <div class="color__shape" :class="colorClass"></div>
      </td>
      <td class="module__code">{{ module.ModuleCode }}</td>
      <td class="module__title">{{ module.ModuleTitle }}</td>
      <td class="module__credit">{{ module.ModuleCredit }}</td>
      <td class="module__exam" >{{ readableDate }}</td>
      <td class="module__action">
        <button class="action__button" @click="deleteModule(module)">
          <svg><use xlink:href="#delete"/></svg>
        </button>
        <button class="action__button" :class="setPaintClass()"
            @click="setIsPainting()">
          <svg><use xlink:href="#paint"/></svg>
        </button>
        <button class="action__button" @click="toggleInfo()">
          <svg><use xlink:href="#info"/></svg>
        </button>
        <mod-change-color @click="setIsPainting()"
        v-if="isChoosingColor" :module="module" transition="color"></mod-change-color>
      </td>
    </tr>
    <tr class="module__more-info" v-show="showMoreInfo" transition="table__module">
      <td></td>
      <td class="module__description" colspan="2">
        {{ module.ModuleDescription }}
      </td>
      <td class="module__credit">
        {{ module.Department }}
        {{ module.Workload }}
      </td>
      <td class="module__prerequisite" v-if="module.Prerequisite">
        {{ module.Prerequisite }}
      </td>
      <td class="module__code" v-if="module.Preclusion">
        {{ module.Preclusion }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import ModChangeColor from './ChangeColor';
import { deleteModule } from '../vuex/actions';
export default {
  vuex: {
    actions: {
      deleteModule,
    },
  },

  components: {
    ModChangeColor,
  },

  props: {
    module: {
      type: Object,
    },
  },

  data() {
    return {
      isChoosingColor: false,
      showMoreInfo: false,
      colorClass: '',
      readableDate: '',
    };
  },

  created() {
    this.readableDate = this.parseDate(this.module.ExamDate);
    this.colorClass = `module__${this.module.ModuleCode}`;
    const moduleColor = this.module.Color;
    document.styleSheets[0].insertRule(`.${this.colorClass}{color:${moduleColor};}`, 0);
  },

  beforeDestroy() {
    const sheet = document.styleSheets[0];
    const rules = sheet.cssRules;

    for (let i = 0, len = rules.length; i < len; i++) {
      if (rules[i].selectorText === `.${this.colorClass}`) {
        setTimeout(() => sheet.deleteRule(i), 300); // prevent fade to black
        break;
      }
    }
  },

  methods: {
    parseDate(date) {
      if (!date) return 'No exams'; // no exam date
      const readableDate = new Date(date);
      const options = {
        weekday: 'short',
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true,
      };
      return readableDate.toLocaleDateString('en-GB', options);
    },
    toggleInfo() {
      this.showMoreInfo = !this.showMoreInfo;
    },
    setIsPainting() {
      this.isChoosingColor = !this.isChoosingColor;
    },
    setPaintClass() {
      return this.isChoosingColor ? 'action__button--activated' : '';
    },
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.table__module {
  height: 3em;
}

.module__action {
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 0;
}

.color__shape {
  background: currentColor;
  margin: 0 auto;
  height: 1em;
  width: 1em;
  border-radius: 0.5em;
}

.action__button {
  border-radius: 2px;
  background: transparent;
  height: 3rem;
  border: 0;
  padding: 0;
  flex: 1 0 3rem;
}

.action__button--activated {
  background-color: rgba(0, 0, 0, 0.12);
}

.action__button:focus {
  outline: 0;
}

.action__button:hover {
  background-color: rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

@media (max-width: 767px) {
  .table__module {
    box-shadow: $materialBoxShadow;
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 1em 0;
    height: auto;
    padding: 0 1rem;
  }

  .module__color {
    height: 100%;
    width: 0.5em;
    position: absolute;
    left: 0;
  }

  .color__shape {
    border-radius: 0;
    width: 100%;
    height: 100%;
  }

  .module__code {
    font-weight: 600;
  }

  .module__credit, .module__code {
    padding-top: 0.3rem;
  }

  .module__credit,
  .module__exam {
    color: #555;
    font-size: 0.875em;
  }

  .module__credit::after {
    content: " credits";
  }

  .module__exam::before {
    content: "Exam on: ";
  }

  .module__exam {
    padding-bottom: 0.5em;
    border-bottom: 1px solid #ddd;
  }

  .module__action {
    display: flex;
    margin: 0;
    height: 3em;
  }
}

.color-transition {
  opacity: 1;
  transition: all 0.3s $bezierStandardCurve;
}

.color-enter, .color-leave {
  transform: translateY(-1em);
  opacity: 0;
}
</style>

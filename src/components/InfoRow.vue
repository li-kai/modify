<template>
  <tbody class="table__body">
    <tr class="body__module" :class="toggleClass(!showMoreInfo, 'body__module')">
      <td class="module__color">
        <div class="color__shape" :class="colorClass"></div>
      </td>
      <td class="module__code">{{ module.ModuleCode }}</td>
      <td class="module__title">{{ module.ModuleTitle }}</td>
      <td class="module__credit">{{ module.ModuleCredit }}</td>
      <td class="module__exam" >{{ readableDate }}</td>
      <td class="module__action" :class="toggleClass(!showMoreInfo, 'module__action')">
        <button class="action__button" @click="deleteModule(module)">
          <svg><use xlink:href="#delete"/></svg>
        </button>
        <button class="action__button"
            @click="setIsPainting()"
            :class="toggleClass(isChoosingColor, 'action__button')">
          <svg><use xlink:href="#paint"/></svg>
        </button>
        <button class="action__button"
            @click="toggleInfo()"
            :class="toggleClass(showMoreInfo, 'action__button')">
          <svg><use xlink:href="#info"/></svg>
        </button>
        <mod-change-color @click="setIsPainting()"
        v-if="isChoosingColor" :module="module" transition="color"></mod-change-color>
      </td>
    </tr>
    <tr class="module__more-info" v-show="showMoreInfo" transition="module__more-info">
      <td class="more-info__col" colspan="3">
        <h4 class="more-info__header">Description:</h4>
        <p>{{ module.ModuleDescription }}</p>
      </td>
      <td class="more-info__col">
        <h4 class="more-info__header">Workload:</h4>
        <p>{{ module.Workload }}</p>
        <p v-if="!module.Workload">Not listed</p>
      </td>
      <td class="more-info__col">
        <h4 class="more-info__header">Prerequisite:</h4>
        <p>{{ module.Prerequisite }}</p>
        <p v-if="!module.Prerequisite">None</p>
      </td>
      <td class="more-info__col">
        <h4 class="more-info__header">Preclusion:</h4>
        <p>{{ module.Preclusion }}</p>
        <p v-if="!module.Preclusion">None</p>
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
    toggleClass(bool, cssClass) {
      return bool ? `${cssClass}--activated` : '';
    },
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.body__module {
  height: 3em;
}

.module__action {
  // position: relative;
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
  background-color: $hoverColor;
}

.action__button:focus {
  outline: 0;
}

.action__button:hover {
  background-color: $hoverColor;
  cursor: pointer;
}

.module__more-info {
  vertical-align: top;
  background: #E5E5E5;
  color: #2A2A2A;
  box-shadow: $materialBoxShadow;
}

.more-info__col {
  padding: 0 1em 0 1em;
}

.more-info__header {
  font-weight: 600;
  margin: 1em 0 -0.7em;
}

.col__description {
}

@media (max-width: 767px) {
  .table__body {
    display:inline-block;
    position: relative;
    margin: 1em 0;
  }

  .body__module {
    box-shadow: none;
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 0 1em;
  }

  .body__module--activated {
    position: relative;
    box-shadow: $materialBoxShadow;
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
    border-bottom: 1px solid #ddd;
  }

  .module__action--activated {
    border-bottom: 0;
  }

  .module__more-info {
    background: transparent;
  }

  .more-info__header {
    font-size: 1rem;
    margin: 0.5em 0 -0.7em;
  }

  .more-info__col {
    display: inline-block;
    float: left;
    padding: 0 1em 0 1rem;
    font-size: 0.875em;
  }

  .module__more-info-enter, .module__more-info-leave {
    opacity: 0;
    transform: translate(9em, -3em) scale(0.7, 0.5);
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

.module__more-info-transition {
  opacity: 1;
  transition: all 0.3s $bezierStandardCurve;
}

.module__more-info-enter, .module__more-info-leave {
  opacity: 0;
  transform: translate(0, -7em) scale(0.7, 0.5);
}

</style>

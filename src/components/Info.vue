<template>
  <table :class="['modify-table', {'modify-table--active': isSearching}]">
    <thead>
      <tr class="table__header" v-if="modulesNum > 0" transition="table__module">
        <th class="header__color"></th>
        <th class="header__code">Code</th>
        <th class="header__title">Title</th>
        <th class="header__credit">Credits</th>
        <th class="header__exam">Exam Timing</th>
        <th class="header__action"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="hasError" transition="table__row">
        <td colspan="6" class="table__error">
          Please refresh the page to try again. We could not connect to the database.
        </td>
      </tr>
      <tr v-if="modulesNum == 0 && !hasError" transition="table__row">
        <td colspan="6" class="table__intro">Click the button to add a module!</td>
      </tr>
      <tr is="mod-info-row" v-for="module in userModules"
          :module="module"
          transition="table__module">
      </tr>
    </tbody>
  </table>
</template>

<script>
import ModInfoRow from './InfoRow';
import {
  getUserModules,
  getNumOfModules,
  getModuleResponse,
  getSearchStatus,
} from '../vuex/getters';

export default {
  vuex: {
    getters: {
      userModules: getUserModules,
      modulesNum: getNumOfModules,
      hasError: getModuleResponse,
      isSearching: getSearchStatus,
    },
  },

  components: {
    ModInfoRow,
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.modify-table {
  transform: translateY(0em);
  transition: $standardTransition;
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  text-align: left;
}

.header__color {
  width: 5%;
}

.header__code, .header__credit {
  width: 10%;
}

.header__title {
  width: 40%;
}

.header__action {
  width: 9rem;
}

.table__intro, .table__error {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 1em 0;
}

.table__error {
  background: #FFF;
  color: $errorColor;
}

@media (max-width: 767px) {
  .modify-table {
    transform: translateY(-4em);
    display: flex;
    flex-direction: column;
  }

  .modify-table--active {
    transform: translateY(0em);
  }

  .table__header {
    display: none;
  }

  .table__module-enter, .table__module-leave {
    transform: scale(0);
    opacity: 0;
  }
}

.table__row-transition {
  opacity: 1;
  transition: opacity 0.3s $bezierStandardCurve;
  transition-delay: 0.3s;
}

.table__row-enter {
  opacity: 0;
}

.table__row-leave {
  opacity: 0;
  transition-delay: 0s;
}

.table__module-transition {
  opacity: 1;
  transition: all 0.3s $bezierStandardCurve;
}

.table__module-enter {
  transform: translateY(-3em);
  opacity: 0;
}

.table__module-leave {
  opacity: 0;
}
</style>

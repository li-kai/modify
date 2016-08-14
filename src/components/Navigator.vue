<template>
  <nav class="navigator">
    <fieldset class="navigator__school">
      <input class="school__radio" type="radio" id="nus"
              value="NUS" v-model="schoolState">
      <label class="school__label" for="nus">NUS</label>
      <input class="school__radio" type="radio" id="ntu"
              value="NTU" v-model="schoolState">
      <label class="school__label" for="ntu">NTU</label>
    </fieldset><span>,</span>
    <span class="navigator__year">{{ year }}</span><span>,</span>
    <span class="navigator__semester">{{ semester }}</span><span>,</span>
    <span class="navigator__week">{{ week }}</span>
  </nav>
</template>

<script>
import store from '../vuex/store';
import { getSchool, getYear, getSemester } from '../vuex/getters';
import { setSchool, retrieveAllModules } from '../vuex/actions';

export default {
  store,
  vuex: {
    actions: {
      setSchool,
      retrieveAllModules,
    },
    getters: {
      school: getSchool,
      year: getYear,
      getSemester,
    },
  },

  data() {
    return {
      week: '',
      semester: '',
    };
  },

  computed: {
    schoolState: {
      get() {
        return this.school;
      },
      set(val) {
        this.setSchool(val);
        this.retrieveAllModules(val, this.year, this.getSemester);
      },
    },
  },

  created() {
    // calculate which week it is
    const firstWeek = new Date('2016-8-8');
    const today = new Date();
    // difference in weeks
    const weeks = Math.round((today - firstWeek) / 604800000);
    this.week = `Week ${weeks}`;

    // display different strings
    switch (this.getSemester) {
      case 1:
        this.semester = 'Semester 1';
        break;
      case 2:
        this.semester = 'Semester 2';
        break;
      case 3:
        this.semester = 'Special Term I';
        break;
      case 4:
        this.semester = 'Special Term II';
        break;
      default:
        this.semester = 'Semester 1';
    }
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.navigator {
  float: right;
  margin: 0.875em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.navigator__school {
  padding: 0;
  margin: 0;
  border: 1px solid transparent;
  display: inline-block;
}

.navigator__school:hover {
  border: 1px solid #b6b6b6;
}

.school__radio {
  clip: rect(1px, 1px, 1px, 1px);
  position: absolute !important;
  padding: 0;
}

.school__label {
  display: none;
  padding: 0.25rem 0;
  color: #b6b6b6;
}

.navigator__school:hover > .school__label {
  display: inline-block;
  padding: 0.25rem 0.25rem;
}

.school__radio:checked + .school__label {
  display: inline-block;
  color: #333;
}

@media (min-width: 768px) {
  .controls {
    margin-bottom: 10em;
    min-height: 17em;
  }
}
</style>

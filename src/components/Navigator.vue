<template>
  <nav class="navigator">
    <span class="navigator__school">{{ school }}</span><span>,</span>
    <span class="navigator__year">{{ year }}</span><span>,</span>
    <span class="navigator__semester">{{ semester }}</span><span>,</span>
    <span class="navigator__week">{{ week }}</span>
  </nav>
</template>

<script>
import store from '../vuex/store';
import { getSchool, getYear, getSemester } from '../vuex/getters';
import { } from '../vuex/actions';

export default {
  store,
  vuex: {
    actions: {
    },
    getters: {
      school: getSchool,
      year: getYear,
      semester: getSemester,
    },
  },

  data() {
    return {
      week: '',
    };
  },

  created() {
    // calculate which week it is
    const firstWeek = new Date('2016-8-8');
    const today = new Date();
    // difference in weeks
    const weeks = Math.round((today - firstWeek) / 604800000);
    this.week = `Week ${weeks}`;
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.navigator {
  float: right;
  margin: 1em;
  font-weight: 600;
  white-space: nowrap;
}

.navigator__school {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .controls {
    margin-bottom: 10em;
    min-height: 17em;
  }
}
</style>

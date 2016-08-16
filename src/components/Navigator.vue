<template>
  <nav class="navigator">
    <div class="navigator__current">
      <span class="current__year">{{ year }},</span>
      <span class="current__semester">{{ semester }}</span><div class="current__break"></div>
      <span class="current__week">{{ week }}</span>
    </div>
    <div class="navigator__menu">
      <button class="menu__swap"
              :title="setSchoolTitle()"
              :class="`menu__swap--${school}`"
              @click="swapSchool">
        {{ school }}
      </button>
    </div>
  </nav>
</template>

<script>
import store from '../vuex/store';
import { getSchool, getYear, getSemester } from '../vuex/getters';
import { setSchool, setUserTimetable } from '../vuex/actions';

export default {
  store,
  vuex: {
    actions: {
      setSchool,
      setUserTimetable,
    },
    getters: {
      school: getSchool,
      year: getYear,
      getSemester,
    },
  },

  methods: {
    swapSchool() {
      const swappedSchool = this.school === 'NUS' ? 'NTU' : 'NUS';
      this.setSchool(swappedSchool);
      this.setUserTimetable(swappedSchool, this.year, this.getSemester);
    },
    setSchoolTitle() {
      const swappedSchool = this.school === 'NUS' ? 'NTU' : 'NUS';
      return `Swap to ${swappedSchool}`;
    },
  },

  data() {
    return {
      week: '',
      semester: '',
    };
  },

  created() {
    // calculate which week it is
    const firstWeek = new Date(2016, 7, 8);
    const today = new Date();
    // difference in weeks
    const weeks = Math.ceil((today - firstWeek) / 604800000);
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

$marginTop: 0.125em;

.navigator {
  float: right;
  display: inline-block;
  font-weight: 600;
  margin: 0.3em $marginTop 0 0;
}

.navigator__current {
  display: inline-block;
  text-align: right;
}

.navigator__menu {
  display: inline-block;
  vertical-align: top;
}

$nusColor: #003d7c;
$ntuColor: #c2292c;
$nusBorder: 0.125em solid $nusColor;
$ntuBorder: 0.125em solid $ntuColor;
$focusBorderWidth: 0.2em;

.menu__swap {
  outline: 0;
  background: #fff;
  height: 3 - $marginTop;
  width: 3 - $marginTop;
}

.menu__swap--NUS:hover {
  background: $nusColor;
  color: #fff;
}

.menu__swap--NTU:hover {
  background: $ntuColor;
  color: #fff;
}

.menu__swap:focus, .menu__swap--NUS:focus, .menu__swap--NUS:focus {
  border-width: $focusBorderWidth;
}

.menu__swap--NUS {
  border: $nusBorder;
  color: $nusColor;
}

.menu__swap--NTU {
  border: $ntuBorder;
  color: $ntuColor;
}

@media screen and (min-width: 768px) {
  .navigator__current {
    line-height: 3em;
    margin-right: 0.25em;
  }

  .current__break {
    display: inline;
  }

  .current__break::after {
    content: ',';
  }

  .menu__swap {
    height: 3em;
    width: 3em;
  }
}
</style>

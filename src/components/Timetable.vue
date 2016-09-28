<template>
  <section :class="toggleExpanded('timetable')">
      <ol :class="toggleExpanded('timings')">
        <li class="timings__hour"
            v-for="timing in filteredTimings">
          <time :datetime="timing.time">
            {{ timing.hour }}<small>{{ timing.period }}</small>
          </time>
        </li>
      </ol>
      <ol class="week">
        <li is="mod-day" :class="toggleHover()"
            v-for="(name, lessons) in filteredDays"
            :name="name" :lessons="lessons" :is-expanded="isExpanded">
            <div slot="name">{{ name }}</div>
        </li>
      </ol>
  </section>
</template>

<script>
import ModDay from './Day';
import { } from '../vuex/actions';
import {
  getWeek,
  getSelectable,
  getSchool,
  getYear,
  getSemester,
} from '../vuex/getters';

export default {
  vuex: {
    actions: { },
    getters: {
      week: getWeek,
      getSelectable,
      school: getSchool,
      year: getYear,
      sem: getSemester,
    },
  },

  components: {
    ModDay,
  },

  data() {
    return {
      timings: [],
    };
  },

  computed: {
    /* returns true if number of school hours exceed 2000 */
    isExpanded() {
      const maxSchoolHours = 2000;
      const weekArray = Object.values(this.week);
      for (let day = weekArray.length - 1; day >= 0; day--) {
        for (const lesson of weekArray[day]) {
          if (lesson.displayStatus !== 'hidden' &&
            parseInt(lesson.endTime, 10) > maxSchoolHours) {
            return true;
          }
        }
      }
      return false;
    },
    /* only display relevant hours */
    filteredTimings() {
      const numOfSchoolHours = this.isExpanded ? 17 : 13;
      return this.timings.slice(0, numOfSchoolHours);
    },
    /* only display relevant days (ignore sat/sun when there are no lessons) */
    filteredDays() {
      const days = {};
      Object.keys(this.week).forEach((name, index) => {
        if (index < 5 || this.week[name].length > 0) {
          days[name] = this.week[name];
        }
      });
      return days;
    },
  },

  created() {
    // Generate strings for the timings
    for (let hour = 8; hour <= 24; hour++) {
      const doubleDigitTime = (`0${hour % 24}`).slice(-2);
      this.timings.push({
        hour: hour % 12 || 12,
        period: (hour < 12 || hour > 23) ? ' AM' : ' PM',
        time: `${doubleDigitTime}:00`,
      });
    }
  },

  methods: {
    toggleExpanded(className) {
      const expandedName = `${className}--expanded`;
      return [className, this.isExpanded ? expandedName : ''];
    },
    toggleHover() {
      return this.getSelectable.length !== 0 ? 'day--hoverable' : '';
    },
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.timetable {
  width: 100%;
  margin: auto;
}

.timings {
  float: left;
  width: 3em;
  margin: 2.2em 0 0 0;
}

.timings__hour {
  text-align: center;
  white-space: nowrap;
  height: 5em;
}

.timings__hour small {
  color: #555;
}

.timings__hour:last-child {
  height: 1em;
}

.week {
  width: calc(100% - 3em);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  // scrolling shadows
  background: radial-gradient(ellipse at left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 0 center, radial-gradient(ellipse at right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 100% center;
  background-size: 10px 125%, 10px 125%;
  background-attachment: scroll, scroll;
  background-repeat: no-repeat;
  overflow-y: hidden;
}

@media (min-width: 768px) {
  .week {
    background: none; // hide the shadows
  }
}

@media (min-width: 1280px) {
  .timetable {
    flex-direction: column;
    height: auto;
    max-width: 77%; // ample whitespace
  }

  .timetable--expanded {
    padding-right: 2.5%;
    max-width: 95%;
  }

  .timings {
    float: none;
    position: relative;
    left: -1.2%;
    width: 102.2%;
    display: flex;
    margin-top: 0.5em;
    border-right: 0;
    justify-content: space-around;
  }

  .timings--expanded {
    left: 0%;
    width: 101%;
  }

  .timings__hour {
    flex: 1 0 0%;
    text-align: right;
    height: 1.5em;
  }

  .week {
    width: 100%;
    flex-direction: column;
    overflow: hidden;
  }
}

</style>

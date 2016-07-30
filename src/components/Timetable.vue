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
        <li is="mod-day"
            v-for="(name, lessons) in week"
            v-if="$index < 5 || lessons.length > 0"
            :name="name" :lessons="lessons" :is-expanded="isExpanded">
            <div slot="name">{{ name }}</div>
        </li>
      </ol>
  </section>
</template>

<script>
import ModDay from './Day';
import { } from '../vuex/actions';
import { } from '../vuex/getters';
export default {
  vuex: {
    actions: {
    },
    getters: {
      week: ({ timetable }) => timetable.week,
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
    /* returns true if number of school hours exceed 1900 */
    isExpanded() {
      const maxSchoolHours = 1900;
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
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

.timetable {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
}

.timings {
  margin: 2.2em 0 0 0;
  flex: 0 0 3em;
}

.timings__hour {
  text-align: center;
  white-space: nowrap;
  height: 5em;
  //border: 1px dotted red;
}

.timings__hour small {
  color: #555;
}

.timings__hour:last-child {
  height: 1em;
}

.week {
  flex: 1 1 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  display: inherit;
  // scrolling shadows
  background: radial-gradient(left, ellipse, rgba(0,0,0, .2) 0%, rgba(0,0,0, 0) 75%) 0 center,
              radial-gradient(right, ellipse, rgba(0,0,0, .2) 0%, rgba(0,0,0, 0) 75%) 100% center;
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
    position: relative;
    left: -1.2%;
    width: 102.2%;
    display: flex;
    border-right: 0;
    justify-content: space-around;
  }

  .timings--expanded {
    left: 0%;
    width: 101%;
  }

  .timings__hour {
    flex: 1 0 0;
    text-align: right;
    height: 3em;
    line-height: 4.5em;
  }

  .week {
    flex: 0 0 90%;
    flex-direction: column;
  }
}

</style>

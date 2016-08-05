<template>
  <li class="day">
    <div class="day__name">{{ name }}</div>
    <ul class="day__hours">
      <ol class="hours__row" v-for="row in schedule">
        <li class="row__hour"
            track-by="$index"
            v-for="hour in row">
          <mod-lesson v-for="lesson in hour" track-by="uid" :lesson="lesson"><mod-lesson>
        </li>
      </ol>
    </ul>
  </li>
</template>

<style lang="scss">
@import '../styles/base.scss';

.day {
  box-sizing: border-box;
  flex: 1 0 auto;
  min-width: 33.33%;
  color: $hoverColor;
  border-bottom: $timetableBorder;
}

.day--hoverable:hover {
  background: #E5E5E5;
  color: #BFBFBF;
  z-index: 99;
}

.day--hoverable:hover .day__name {
  background: $hoverColor;
}

// gradient on the first & last cells to hide the shadow
.day:first-child, .day:last-child {
  background-repeat: no-repeat;
  background-size: 20px 100%;
}

.day:first-child {
  background-image: linear-gradient(to right, rgba(255,255,255, 1) 50%, rgba(255,255,255, 0) 100%);
}

.day:last-child {
  background-image: linear-gradient(to left, rgba(255,255,255, 1) 50%, rgba(255,255,255, 0) 100%);
  background-position: 100% 0;
}

.day__name {
  color: #333;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 3em;
}

.day__hours {
  display: flex;
  padding-left: 2px;
  border-left: $timetableBorder;
}

.hours__row {
  margin-left: 1px;
  flex: 1 1 auto;
}

.row__hour {
  box-sizing: border-box;
  border-top: $timetableBorder;
  height: 5em;
}

@media (min-width: 768px) {
  .day {
    min-width: 20%;  // show all 5 days
  }
}

@media (min-width: 1280px) {
  .day {
    flex: 0 0 auto;
    display: flex;
    border-bottom: 0;
  }

  .day__name {
    flex: 0 0 5%;
    min-height: 5.5em;
  }

  .day__hours {
    flex: 1 1 auto;
    display: flex;
    padding: 0;
    flex-direction: column;
    border: $timetableBorder;
    border-right: 0;
    margin-bottom: -1px;
  }

  .day:last-child .day__hours {
    margin-bottom: 0;
  }

  .hours__row {
    display: flex;
    flex: 1 0 auto;
  }

  // selector ouch, but no choice
  .hours__row:first-child .row__hour {
    padding-top: 0.125em;
  }

  .row__hour {
    border-right: $timetableBorder;
    padding-left: 0;
    height: auto;
    flex: 1 0 0%;  // ie fix
    border-top: 0;
  }
}
</style>

<script>
import ModLesson from './Lesson';
import { } from '../vuex/actions';
import { } from '../vuex/getters';
export default {

  name: 'Day',

  vuex: {
    actions: {
    },
    getters: {
    },
  },

  components: {
    ModLesson,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    lessons: {
      type: Array,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    /* Does a counting sort on the lessons.
     * Then, we put each lesson on a 'row',
     * if there is space.
     */
    schedule() {
      const numberOfHours = this.isExpanded ? 16 : 12;
      const processed = this.processLessons(this.lessons, numberOfHours);

      const lessonsByHour = processed.sortedLessons;
      let numberOfLessons = processed.lessonCount;

      if (numberOfLessons === 0) {
        return [this.generateArrayFromHours(numberOfHours)];
      }

      const day = [];

      while (numberOfLessons > 0) {
        // construct a new row
        const row = this.generateArrayFromHours(numberOfHours);
        let spillover = 0;
        for (let i = 0; i < numberOfHours;) {
          // no lesson
          if (lessonsByHour[i].length === 0) {
            i++;
            spillover = 0;
          // has lesson
          } else {
            // get first lesson
            const lesson = lessonsByHour[i][0];
            const start = parseInt(lesson.startTime.slice(2), 10) / 60;
            // lesson starts before spillover, skip
            if (start > spillover) {
              i++;
              spillover = 0;
            } else {
              row[i] = [lessonsByHour[i].shift()];
              if (Number.isInteger(lesson.hours)) {
                // increment by duration
                i += lesson.hours;
                spillover = 0;
              } else {
                const flooredHours = Math.floor(lesson.hours);
                i += flooredHours;
                spillover = lesson.hours - flooredHours;
              }
              numberOfLessons--;
            }
          }
        }
        day.push(row);
      }
      return day;
    },
  },

  methods: {
    generateArrayFromHours(hours) {
      const array = [];
      for (let i = 0; i < hours; i++) {
        array[i] = [];
      }
      return array;
    },
    processLessons(lessons, numberOfHours) {
      const hours = this.generateArrayFromHours(numberOfHours);
      let lessonCount = 0;
      // counting sort
      lessons.forEach((lesson) => {
        if (lesson.displayStatus !== 'hidden') {
          const pos = parseInt(lesson.startTime.slice(0, 2), 10) - 8;
          hours[pos].push(lesson);
          lessonCount++;
        }
      });
      return { sortedLessons: hours, lessonCount };
    },
  },
};
</script>

<template>
  <li class="day">
    <div class="day__name">{{ name }}</div>
    <ul class="day__hours">
      <ol class="hours__row" v-for="row in schedule">
        <li class="row__hour"
            v-for="(hour, index) in row"
            :key="index">
          <mod-lesson v-for="lesson in hour" :key="lesson.uid" :lesson="lesson"><mod-lesson>
        </li>
      </ol>
    </ul>
  </li>
</template>

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
      while (numberOfLessons > 0 && day.length < 50) {
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
            if (spillover > start) {
              i++;
              spillover = 0;
            } else {
              row[i].push(lessonsByHour[i].shift());
              // increment by hours duration
              const flooredHours = Math.floor(start + lesson.hours);
              i += flooredHours;
              // spillover is trailing duration from the 0 minute mark
              spillover = start + lesson.hours;
              spillover -= flooredHours;
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

<style lang="scss">
@import '../styles/base.scss';

.day {
  box-sizing: border-box;
  flex: 1 0 auto;
  min-width: 33.33%;
  color: $hoverColor;
  border-bottom: $timetableBorder;
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
  border-left: $timetableBorder;
}

.hours__row {
  flex: 1 1 auto;
}

.row__hour {
  box-sizing: border-box;
  border-top: $timetableBorder;
  height: 5em;
}

// tablets xor phones tilting will show all 5 days
@media (min-width: 768px), screen and (orientation : landscape) {
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

  .day--hoverable:hover {
    background: #E5E5E5;
    color: #BFBFBF;
    z-index: 99;
  }

  .day--hoverable:hover .day__name {
    background: $hoverColor;
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

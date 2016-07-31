<template>
  <div class="lesson"
      :style="setStyle()" :class="setClass()"
      @click.stop="lessonClick()"
      @mouseenter="highlightSame()" @mouseleave="highlightSame()">
    <div class="lesson__code">{{ lesson.moduleCode }}</div>
    <div class="lesson__type">{{ lesson.lessonType }}&nbsp{{ lesson.classNo }}</div>
    <div class="lesson__venue">{{ lesson.venue }}</div>
    <div class="lesson__week">{{ lesson.weekText }}</div>
  </div>
</template>

<script>
import {
  onClickLesson,
} from '../vuex/actions';
import { } from '../vuex/getters';
export default {

  name: 'Lesson',

  vuex: {
    actions: { onClickLesson },
    getters: { },
  },

  props: {
    lesson: {
      type: Object,
    },
  },

  data() {
    return {
      isHorizontal: true,
      lessonIdentifier: '',
    };
  },

  created() {
    const mql = window.matchMedia('(min-width: 1280px)');

    mql.addListener(this.handleMediaChange);
    this.handleMediaChange(mql);
  },

  methods: {
    handleMediaChange(mediaQueryList) {
      this.isHorizontal = mediaQueryList.matches;
    },
    lessonClick() {
      if (this.lesson.displayStatus !== 'only') {
        this.onClickLesson(this.lesson);
      }
    },
    highlightSame() {
      const displayStatus = this.lesson.displayStatus;
      if (displayStatus === 'ghosted' || displayStatus === 'initial') {
        this.selectDom('lesson--highlight');
      }
    },
    selectDom(cssClass) {
      const sameLessonNo = document.getElementsByClassName(this.lessonIdentifier);
      for (let i = sameLessonNo.length - 1; i >= 0; i--) {
        sameLessonNo[i].classList.toggle(cssClass);
      }
    },
    setClass() {
      this.lessonIdentifier = `lesson__${this.lesson.moduleCode}${this.lesson.classNo}`;
      return [
        `module__${this.lesson.moduleCode}`,
        this.lessonIdentifier,
        `lesson--${this.lesson.displayStatus}`,
      ];
    },
    setStyle() {
      const startTime = parseInt(this.lesson.startTime.slice(2), 10) / 60;
      const size = this.lesson.hours;
      const style = {};

      if (size !== 1) {
        if (startTime !== 0) {
          this.setPosition(style, startTime);
        }
        this.setSize(style, size);
      }

      if (startTime !== 0) {
        this.setPosition(style, startTime);
      }
      return style;
    },
    setPosition(style, startTime) {
      if (this.isHorizontal) {
        style.left = `${startTime * 100}%`;
      } else {
        style.top = `${startTime * 100}%`;
      }
    },
    setSize(style, size) {
      if (this.isHorizontal) {
        // subpixel rounding :/
        style.width = `${size * 100.2}%`;
      } else {
        style.height = `${size * 100}%`;
      }
    },
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';
.lesson {
  height: 100%;
  position: relative;
  padding: 0.125em 0.25em;
  user-select: none;
  cursor: pointer;
  line-height: 1.23;
  box-sizing: border-box;
  background: currentColor;
  transition: $standardTransition;
}

.lesson__code, .lesson__type, .lesson__venue, .lesson__week {
  color: #FFF;
}

.lesson__code {
  font-weight: 600;
}

.lesson__type {
  text-transform: uppercase;
}

.lesson__type, .lesson__venue, .lesson__week {
  font-size: 0.875em;
}

.lesson--selected:hover {
  transform: translateY(-0.1875rem);
}

.lesson--selected:hover:after {
  opacity: 1 !important;
}

// box shadow optimisation for 60 fps
.lesson--selected:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  box-shadow: $materialBoxShadow;
  opacity: 0;
}

.lesson--highlight {
  transform: scale(1.05);
  opacity: 1 !important;
}

.lesson--only {
  user-select: text;
  cursor: auto;
}

.lesson--ghosted {
  opacity: 0.75;
}

.lesson--initial {
  outline: 1px solid #333;
}

@media (min-width: 1280px) {
  .lesson {
    height: auto;
    padding: 0.125em 0.25em 0.3em 0.25em;
    margin-top: 1px;
  }

  .lesson__code, .lesson__type, .lesson__venue, .lesson__week {
    color: #333;
  }
}

</style>

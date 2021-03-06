<template>
  <div class="search">
    <h1 :class="toggleActive('search__header')">Modules</h1>
    <transition name="search__label">
    <label class="search__label" for="mod"
            v-show="isActive">
      Search
    </label>
    </transition>
    <div class="search__bar">
      <transition name="bar__input">
      <input class="bar__input" id="mod" name="mod"
              autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
              title="Search modules" type="text" value="" role="combobox" dir="ltr"
              aria-label="Search modules" aria-haspopup="false" aria-autocomplete="list"
              v-show="isActive"
              ref="input"
              v-model="query"
              @focus="hasFocus = true"
              @input="pointerReset()"
              @keydown="keydown"/>
      </transition>
      <ul class="bar__list" v-show="hasFocus && query">
        <li v-for="(module, index) of queriedModules"
            :key="index"
            :class="{'list__module--selected': index === pointer }"
            class="list__module"
            @click="selectModule(module.code)"
            @mouseover="pointAtModule(index)"
            >
          {{ module.code }} : {{ module.title }}
        </li>
        <li class="list__module" v-show="queriedModules.length === 0">No results found.</li>
      </ul>
    </div>
    <button :class="toggleActive('search__add')"
            class="search__add--float"
            title="Add a module"
            @click="toggleSearch"
            ref="searchAdd">
      <svg :class="toggleActive('add__icon')"><use xlink:href="#plus"/></svg>
    </button>
    <button class="search__download"
            title="Download your timetable"
            @click="downloadTimetable">
      <svg class="download__icon"><use xlink:href="#download"/></svg>
    </button>
    <div class="search__error" v-if="hasError">No connection to Modify. Please refresh the page to try again.</div>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image';
import {
  setDefaultTimetable,
  addModule,
  toggleSearchStatus,
} from '../vuex/actions';
import {
  getUserModules,
  getAllModules,
  getAllModulesResponse,
  getSearchStatus,
  getSchool,
  getYear,
  getSemester,
} from '../vuex/getters';

export default {
  vuex: {
    actions: {
      toggleSearchStatus,
      setDefaultTimetable,
      addModule,
    },
    getters: {
      isActive: getSearchStatus,
      listOfModules: getAllModules,
      userModules: getUserModules,
      hasError: getAllModulesResponse,
      school: getSchool,
      year: getYear,
      sem: getSemester,
    },
  },

  data() {
    return {
      hasFocus: false,
      query: '',
      pointer: 0,
      pos: 0,
    };
  },

  created() {
    this.setDefaultTimetable();
  },

  // fab becomes fixed when it reaches the search bar
  mounted() {
    const addButton = this.$refs.searchAdd;
    const fixedClass = 'search__add--float';
    window.onscroll = () => {
      if (window.scrollY < this.$el.getBoundingClientRect().top) {
        addButton.classList.add(fixedClass);
      } else {
        addButton.classList.remove(fixedClass);
      }
    };
  },

  computed: {
    queriedModules() {
      return this.querySearch(this.listOfModules);
    },
  },

  methods: {
    toggleSearch() {
      this.toggleSearchStatus();
      if (this.isActive === true) {
        this.$nextTick(() => this.$refs.input.focus());
      } else {
        this.hasFocus = false;
        this.query = '';
      }
    },
    toggleActive(className) {
      return [
        className,
        this.isActive ? `${className}--active` : '',
      ];
    },
    selectModule(moduleCode) {
      this.addModule(this.school, this.year, this.sem, moduleCode);
      this.query = ''; // reset query
    },
    pointAtModule(index) {
      this.pointer = index;
    },
    pointerReset() {
      this.pointAtModule(0);
    },
    keydown(e) {
      const key = e.keyCode;
      // Disable when list isn't showing up
      switch (key) {
        case 40: // down
          this.pointer++;
          break;
        case 38: // up
          this.pointer--;
          break;
        case 13: // enter
          if (this.query !== '') {
            const moduleCode = this.queriedModules[this.pointer].code;
            this.selectModule(moduleCode);
          }
          break;
        case 27: // esc
          this.hasFocus = false;
          this.$refs.input.blur();
          break;
        default:
          break;
      }
      // When cursor out of range
      const listLength = Math.min(6, this.queriedModules.length - 1);
      if (this.pointer > listLength) {
        this.pointer = 0;
      } else if (this.pointer < 0) {
        this.pointer = 0;
      }
    },
    queryCode(value, search, regex) {
      // search not pure numbers
      if (isNaN(parseInt(search, 10))) {
        return value.indexOf(search) === 0;
      }
      // and compare if search matches with numerics
      // e.g. query '10' will match CS1010 but CS2110 will not
      return value.search(regex) !== -1;
    },
    querySearch(listOfModules) {
      const search = this.query.toUpperCase();
      // regex matches for later use
      const matchStartOfWord = new RegExp(`\\b${this.query}`, 'i');
      const matchNumericCode = new RegExp(`[a-zA-Z]${this.query}`);
      // codeMatches will always come first
      const codeMatches = [];
      const nameMatches = [];
      for (let i = 0, len = listOfModules.length; i < len; i++) {
        const module = listOfModules[i];
        // either code matches
        if (this.queryCode(module.code, search, matchNumericCode)) {
          codeMatches.push(module);
        // or text matches
        // e.g. 'chem' would return true for 'chem 101' and 'intro to chem'
        // but not 'biochem'
        } else if (module.title.search(matchStartOfWord) !== -1) {
          nameMatches.push(module);
        }
        // break if total module matches is reached
        // todo: increase limit without causing DOM lag
        if (codeMatches.length + nameMatches.length > 250) break;
      }
      // return both
      return codeMatches.concat(nameMatches);
    },
    downloadTimetable() {
      const timetable = document.getElementsByClassName('timetable')[0];
      const style = { margin: '0', marginLeft: '-0.25em' };
      domtoimage.toJpeg(timetable, { bgcolor: '#fff', style })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'timetable.jpeg';
        link.href = dataUrl;
        link.click();
      });
    },
  },
};
</script>

<style lang="scss">
@import '../styles/base.scss';

$searchInputHeight: 3rem;

.search {
  position: relative;
  height: 8em;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}

.search__header {
  font-size: 2rem;
  transition: all 0.225s $bezierStandardCurve;
  margin: 0.5rem 0 0 0;
  flex: 1 0 auto;
}

.search__header--active {
  transform: translateY(0.35em);
}

.search__label {
  position: absolute;
  opacity: 1;
  font-size: 2em;
  font-weight: bold;
  left: 0.03rem;
  top: -0.5rem;
  transition: all 0.225s $bezierStandardCurve;
}

.search__bar {
  position: relative;
  flex: 1 0 100%;
  order: 1;
}

.bar__input {
  font-family: inherit;
  font-size: 16px;
  padding: 5px 9px;
  box-sizing: border-box;
  width: 100%;
  height: $searchInputHeight;
  border-radius: 0;
  transition: all 0.225s $bezierStandardCurve;
}

.bar__input:focus {
  outline-color: #2196F3;
}

.bar__list {
  -webkit-overflow-scrolling: touch;
  position: absolute;
  margin-top: -1px;
  background: #FFF;
  width: 100%;
  z-index: 999;
  box-shadow: $materialBoxShadow;
  max-height: 17.5em;
  overflow-y: auto;
  cursor: pointer;
  white-space: nowrap;
}

.list__module {
  text-overflow: ellipsis;
  overflow-x: hidden;
  padding: 0 9px;
  line-height: 2.5em;
  vertical-align: center;
}

.list__module--selected {
  box-shadow: $materialBoxShadow;
  background: #2196F3;
  color: white;
}

.search__add {
  transition: background 0.225s $bezierStandardCurve,
              border-radius 0.225s $bezierStandardCurve;
  flex: 0 0 ($searchInputHeight + 0.5);
  height: ($searchInputHeight + 0.5);
  border: 0;
  line-height: 0;
  background: #E84664;
  transform: translate3d(0, 0, 0);
  will-change: scroll-position;
}

.search__add:focus {
  outline-color: #A83349;
}

.search__add--float {
  outline: 0;
  position: fixed;
  z-index: 100;
  bottom: 1em;
  right: 0.875em;
  border-radius: 50%;
  height: ($searchInputHeight + 1);
  width: ($searchInputHeight + 1);
  box-shadow: $materialBoxShadow;
}

.search__add--active {
  background: #303030;
}

.add__icon, .download__icon {
  transition: all 0.225s $bezierStandardCurve;
}

.add__icon--active {
  transform: rotate(45deg);
}

.search__download {
  display: none;
}

.search__error {
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4em;
  width: 100%;
  z-index: 9;
  text-align: center;
  background: #FFF;
  color: $errorColor;
  border: 1px solid $errorColor;
}

@media (min-width: 768px) {
  .search {
    align-items: center;
    height: auto;
  }

  .search__header {
    margin: 1rem;
    flex: 0 0 auto;
  }

  .search__label {
    top: -0.1rem;
    left: 1.03rem;
  }

  .search__bar {
    flex: 1 1 auto;
    order: 0;
  }

  .search__add {
    flex: 0 0 $searchInputHeight;
    height: $searchInputHeight;
  }

  .search__add--float {
    position: static;
    z-index: 9;
    border-radius: 0;
    width: $searchInputHeight;
  }

  .search__add:hover {
    background: #DB425F;
  }

  .search__download {
    display: block;
    transition: background 0.225s $bezierStandardCurve,
            border-radius 0.225s $bezierStandardCurve;
    flex: 0 0 ($searchInputHeight);
    height: ($searchInputHeight);
    border: 0;
    line-height: 0;
    background: #ddd;
  }

  .search__download:hover {
    background: #ccc;
  }
}

.bar__input-active, .bar__input-leave {
  opacity: 1;
}

.bar__input-enter, .bar__input-leave-active {
  transform: scale(0);
  opacity: 0;
}

.search__label-active, .search__label-leave {
  opacity: 1;
}

.search__label-enter, .search__label-leave-active {
  transform: translateY(0.5em);
  opacity: 0;
}
</style>

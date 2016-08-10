# Modify.sg

Modify is a timetable builder for Singapore Universities.

### Features
  - Responsive: works on all devices
  - Colour palette: pick your favourites!
  - At a glance information

### Tech
Modify uses the following to work:
##### Front-end
* [Vue.js] - javascript framework
* [Localforage] - client side storage
* [Webpack] - build system and module bundler
##### Back-end
* [node.js] - back-end server language
* [Express] - node.js network app framework
* [Nginx] - reverse proxy
* [Scrapy] - spider for scraping info
* [PostgreSQL] - database

### Installation

Download and install [Node.js](https://docs.npmjs.com/getting-started/installing-node) v4+ to run, then run the following in the terminal:

```sh
git clone https://github.com/li-kai/modify.git
cd modify
# install dependencies
npm install
# serve with hot reload at localhost:8080
npm run dev
```
Most of the stuff is written in Vue. It's super simple and easy to learn. So learn some [Vue.js](https://laracasts.com/series/learning-vue-step-by-step) to get started.

For production environments...

```sh
npm run build
```

### Development

Want to contribute? Great!

Modify uses Webpack for fast developing thanks to [Vue-template](https://github.com/vuejs-templates/webpack)

Make a change in your file and instantanously see your updates!

Run the following commands to run tests:
```sh
# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

### Todos

 - Write Tests
 - Sticky headers and fab
 - Clearer styling for lessons with only one choice
 - User onboarding
 - Home page
 - Accounts

License
----

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016- Li Kai

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Vue.js]: <https://vuejs.org/>
   [Localforage]: <https://github.com/localForage/localForage>
   [Webpack]: <https://webpack.github.io/>
   [node.js]: <http://nodejs.org>
   [Nginx]: <https://www.nginx.com/>
   [Scrapy]: <http://scrapy.org/>
   [PostgreSQL]: <https://www.postgresql.org/>
   [express]: <http://expressjs.com>

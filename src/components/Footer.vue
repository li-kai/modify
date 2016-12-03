<template>
  <footer v-once>
    <div class="footer__container">
      <div class="container__contribute">
        <div class="contribute__title">Contribute:</div>
        <a href="https://github.com/li-kai/modify" class="contribute__logo">
          <img src="assets/github.svg">
        </a>
      </div>
      <div class="container__copyright">Copyright © 2016 Modify. All rights reserved.</div>
    </div>
  </footer>
</template>

<style lang="scss">
@import '../styles/base.scss';
.footer__container {
  position: relative;
  margin: 0 auto;
  max-width: 980px;
}

.contribute__title {
  color: #ccc;
  margin-bottom: 0.2em;
}

.container__contribute {
  display: inline-block;
  margin: 0.5em 0.875em 0 0.875em;
}

.contribute__logo {
  display: block;
  height: 3em;
  width: 3em;
}

.container__copyright {
  display: table;
  margin: 0.5em auto;
  font-size: 0.75em;
  color: #ccc;
}
</style>

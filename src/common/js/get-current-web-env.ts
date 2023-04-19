export default function getCurrentWebEnv() {
  const href = window.location.host;
  switch (true) {
    // test环境
    case /localhost|test-|([0-9]+[.][0-9]+[.][0-9]+[.][0-9]+)/g.test(href): {
      return 'test-';
    }
    // 预发环境
    case /^(yf-)/g.test(href): {
      return 'yf-';
    }
    default: {
      return '';
    }
  }
}

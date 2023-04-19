import { defineConfig } from 'umi';
import { routes } from './src/config/route';
// const cssNamespace = require('postcss-plugin-namespace');

const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
let cookie = '';

if (!isProduction) {
  const cookiesPath = path.resolve(__dirname, './.cookie.json');
  try {
    fs.accessSync(cookiesPath, fs.constants.R_OK | fs.constants.W_OK);
    try {
      cookie = JSON.parse(fs.readFileSync(cookiesPath, { encoding: 'utf8' }))[
        'cookie'
      ];
    } catch (error) {
      console.error(cookiesPath, '配置数据格式错误');
    }
  } catch (err) {
    // ignore
  }
}

export default defineConfig({
  mountElementId: 'umi-project',
  base: 'umi-project', // 子应用的 base，默认为 package.json 中的 name 字段
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: { type: 'hash' },
  fastRefresh: {},
  alias: {
    '@layout': path.resolve(__dirname, './src/layout'),
    '@pages': path.resolve(__dirname, './src/pages'),
    '@common': path.resolve(__dirname, './src/common'),
    '@style': path.resolve(__dirname, './src/common/style'),
    '@store': path.resolve(__dirname, './src/store'),
    '@type': path.resolve(__dirname, './src/types'),
  },
  publicPath: '/',
  define: {
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  },
  lessLoader: {
    modifyVars: {
      hack: `true; @import "~@/common/style/antd-theme/index"`,
    },
  },
  routes,
  proxy: {
    '/data-api': {
      // 代理 接口
      target: 'http://localhost:XXXX',
      changeOrigin: true,
      // 使用mock数据
      // pathRewrite: { '^/data-api': '/mock/data-api' },
      pathRewrite: { '^/data-api': '' },
      ...(!isProduction
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : {}),
    },
  },
  mfsu: {},
  dynamicImportSyntax: {},
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
  // extraPostCSSPlugins: [ //配置额外的 postcss 插件。
  //   cssNamespace('.umi-project-class', { ignore: [ /body/, '.icon', '.ant-picker-dropdown' ] })]
});

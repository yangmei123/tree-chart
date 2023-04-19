export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        redirect: '/index',
        title: '首页',
      },
      {
        title: '首页',
        exact: false,
        path: '/index',
        level: 1,
        icon: 'MailOutlined',
        component: '@/pages/index/index',
      },
    ],
  },
];

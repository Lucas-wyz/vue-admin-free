import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'login', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'questions',
        name: 'Questions',
        component: () => import('@/views/QuestionPage.vue'),
        meta: { title: '题目管理' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/UserPage.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'papers',
        name: 'Papers',
        component: () => import('@/views/PaperPage.vue'),
        meta: { title: '试卷列表' },
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/RolePage.vue'),
        meta: { title: '角色管理' },
      },
      {
        path: '/AnonymousUser',
        name: 'AnonymousUser',
        component: () => import('@/views/AnonymousUserPage.vue'),
        meta: { title: '匿名管理' },
      },
      {
        path: '/QuestionHistoryPage',
        name: 'QuestionHistoryPage',
        component: () => import('@/views/QuestionHistoryPage.vue'),
        meta: { title: '答题历史页面' },
      },
      {
        path: 'urls',
        name: 'Urls',
        component: () => import('@/views/UrlPage.vue'),
        meta: { title: 'URL 管理' },
      },
    ],
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '临时注册' },
  },

  {
    path: '/RegisterInfoView',
    name: 'RegisterInfoView',
    component: () => import('@/views/RegisterInfoView.vue'),
    meta: { title: '用户注册' },
  },
  {
    path: '/QuestionView',
    name: 'QuestionView',
    component: () => import('@/views/QuestionView.vue'),
    meta: { title: '答题页面' },
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/views/error/500.vue'),
    meta: { title: '服务器错误' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '管理系统'}`
  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  router.push('/500')
})

export default router

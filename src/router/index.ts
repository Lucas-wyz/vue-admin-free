import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/RolePage.vue'),
        meta: { title: '角色管理' },
      },
    ],
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

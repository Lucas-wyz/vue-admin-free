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
      },
      {
        path: 'questions',
        name: 'Questions',
        component: () => import('@/views/QuestionPage.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UserPage.vue'),
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/RolePage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

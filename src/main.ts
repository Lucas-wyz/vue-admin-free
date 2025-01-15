import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import './assets/tailwind.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')

if (import.meta.env.MODE === 'development') {
  import('eruda').then((eruda) => eruda.default.init())
}

if (import.meta.env.MODE === 'development') {
  // https://devtools.vuejs.org/
  let { addCustomTab, addCustomCommand } = await import('@vue/devtools-api')
  addCustomTab({
    // unique identifier
    name: 'eruda',
    // title to display in the tab
    title: 'eruda',
    // any icon from material design icons or a URL to an image
    icon: 'https://eruda.liriliri.io/favicon.ico',
    // iframe view
    view: {
      type: 'iframe',
      src: 'https://eruda.liriliri.io/zh/',
    },
    category: 'advanced', //  'pinned' | 'app' | 'modules' | 'advanced';
  })

  addCustomTab({
    // unique identifier
    name: 'element-plus',
    // title to display in the tab
    title: 'element-plus',
    // any icon from material design icons or a URL to an image
    icon: 'https://element-plus.org/images/element-plus-logo-small.svg',
    // iframe view
    view: {
      type: 'iframe',
      src: 'https://cn.element-plus.org/zh-CN/component/overview.html',
    },
    category: 'advanced', //  'pinned' | 'app' | 'modules' | 'advanced';
  })

  addCustomTab({
    // unique identifier
    name: 'vite',
    // title to display in the tab
    title: 'Vite',
    // any icon from material design icons or a URL to an image
    icon: 'https://cn.vite.dev/logo.svg',
    // iframe view
    view: {
      type: 'iframe',
      src: 'https://cn.vite.dev/guide/',
    },
    category: 'modules', //  'pinned' | 'app' | 'modules' | 'advanced';
  })

  // Add a custom command with submenu
  addCustomCommand({
    // unique identifier
    id: 'Vue',
    // title to display in the command
    title: 'Vue',
    // any icon from material design icons or a URL to an image
    icon: 'https://cn.vuejs.org/logo.svg',
    // submenu, which is shown when the menu is clicked
    children: [
      {
        id: 'Vue:website',
        title: 'Website',
        icon: 'auto-awesome',
        action: {
          type: 'url',
          src: 'https://cn.vuejs.org/',
        },
      },
    ],
  })
}

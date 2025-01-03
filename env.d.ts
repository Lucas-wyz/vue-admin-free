/// <reference types="vite/client" />
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_MENU_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

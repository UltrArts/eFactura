// import './assets/main.css'

// BLOQUEAR Vue Devtools mesmo no modo de desenvolvimento
if (import.meta.env.VITE_DISABLE_DEVTOOLS === 'true') {
    Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
      value: {},
      configurable: false
    });
  }
  
import './assets/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.devtools = false;

app.mount('#app')

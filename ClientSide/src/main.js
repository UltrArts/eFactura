// import './assets/main.css'

// BLOQUEAR Vue Devtools mesmo no modo de desenvolvimento
if (import.meta.env.VITE_DISABLE_DEVTOOLS === 'true') {
    Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
      value: {},
      configurable: false
    });
  }
  
import './assets/css/style.css'
import 'sweetalert2/dist/sweetalert2.min.css'



import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faPlus, faTrash, faDownload, faCog, faFilePdf, faImage, faPalette, faRotate } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

library.add(faUser, faPlus, faTrash, faDownload, faCog, faFilePdf, faImage, faWhatsapp, faPalette, faRotate)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.config.devtools = false;

app.mount('#app')

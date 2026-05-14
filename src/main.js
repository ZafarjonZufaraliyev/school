import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Toast, toastOptions } from './plugins/toast'

import './assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')

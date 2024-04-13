import { createApp } from 'vue'
import Clipboard from 'v-clipboard'

import App from '@/App.vue'
import { initSentry } from '@/lib/sentry'
import '@/main.css'

const app = createApp(App)
if (import.meta.env.MODE !== 'development') {
  initSentry(app)
}
app.use(Clipboard)
app.mount('#app')

import { createApp } from 'vue'
import Clipboard from 'v-clipboard'

import App from '@/App.vue'
import { initSentry } from '@/utils/sentry'
import './main.css'

const app = createApp(App)
initSentry(app)
app.use(Clipboard)
app.mount('#app')

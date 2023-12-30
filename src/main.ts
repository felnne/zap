import { createApp } from 'vue'
import Clipboard from 'v-clipboard'
import App from '@/App.vue'
import './main.css'

const app = createApp(App)
app.use(Clipboard)
app.mount('#app')

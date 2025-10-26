import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'

import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
const app = createApp(App)

// Registrasi Quasar ke Vue
app.use(Quasar, {
    plugins: {},
})

app.mount('#app')
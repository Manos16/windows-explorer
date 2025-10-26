import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

export default (app: any) => {
    app.use(Quasar, {
        plugins: {}, // bisa isi nanti misalnya Dialog, Notify, dll
    })
}

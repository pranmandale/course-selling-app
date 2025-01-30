import { app } from "./app.js";
import connect_DB from "./db/db.connection.js"

const PORT = process.env.PORT || 0

connect_DB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is listening on PORT ${PORT}`)
        })
    })
    .catch(err => {
        console.log("db connection error", err)
    })

    // 2.55
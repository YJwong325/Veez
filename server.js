const express = require('express')
const path = require('path')

const port = process.env.PORT || 8080

const app = express()

app.get('/', (req, res) => {
    res.send('Homepage - Veez')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
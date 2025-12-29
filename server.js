const express = require('express')
const path = require('path')

const port = process.env.PORT || 8080

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/manga', (req, res) => {
    res.render('manga')
})

app.get('/anime', (req, res) => {
    res.render('anime')
})

app.get('/manhwa', (req, res) => {
    res.render('manhwa')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
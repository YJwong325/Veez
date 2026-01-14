const express = require('express')
const path = require('path')

const port = process.env.PORT || 8080

const app = express()

const mediaData = require('./modules/media.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    mediaData.initialize()
        .then(() => {
            mediaData.getAllMedia()
                .then((data) => console.log(data));
        })
        .catch((err) => console.log(err));
        
    res.render('home')
})

app.get('/manga', (req, res) => {
    mediaData.getMediaById(20)
        .then((data) => {
            res.render('manga', { manga: data });
        })
        .catch((err) => {
            res.status(500).json({ "message": "Internal server error" })
        })
})

app.get('/media', (req, res) => {
    res.render('media')
})

app.get('/anime', (req, res) => {
    res.render('anime')
})

app.get('/manhwa', (req, res) => {
    res.render('manhwa')
})

app.use((req, res, next) => {
    res.status(404).render('404')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
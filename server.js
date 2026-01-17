const express = require('express')
const path = require('path')

const port = process.env.PORT || 8080

const app = express()

const mediaData = require('./modules/media.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

mediaData.initialize()
    .then(() => {
        app.get('/', (req, res) => {
            res.render('home')
        })
        
        app.get('/media', (req, res) => {
            mediaData.getAllMedia()
                .then((data) => {
                    res.render('media', { media: data });
                })
                .catch((err) => {
                    res.status(500).json({ "message": "Internal server error" })
                })
        })

        app.use((req, res, next) => {
            res.status(404).render('404')
        })
        
        app.listen(port, () => {
            console.log(`Listening to port ${port}`)
        })
    })
    .catch((err) => {
        console.log(err);
    })
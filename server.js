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
            if (req.query.category) {
                mediaData.getMediaByCategory(req.query.category)
                    .then((data) => {
                        if (data.length > 0) {
                            res.render('media', { media: data });
                        }
                        else {
                            res.status(404).render('404', { errMessage: `The category, "${req.query.category}", does not exist.` });
                        }
                    })
                    .catch((err) => {
                        res.status(500).render('500', { errMessage: err });
                    });
            }
            else {
                mediaData.getAllMedia()
                    .then((data) => {
                        res.render('media', { media: data });
                    })
                    .catch((err) => {
                        res.status(500).json({ message: "Internal server error" });
                    });
            }
        })

        app.get('/media/:id', (req, res) => {
            mediaData.getMediaById(req.params.id)
                .then((data) => {
                    if (data) {
                        res.render('media-page.ejs', { mediaObj : data });
                    }
                    else {
                        res.status(404).render('404', { errMessage: `The media with id, "${req.params.id}", does not exist.` });
                    }
                })
                .catch((err) => {
                    res.status(500).json({ message: "Internal server error" });
                })
        })

        app.get('/about', (req, res) => {
            res.render('about')
        })

        app.use((req, res, next) => {
            res.status(404).render('404', { errMessage: "Page requested does not exist." })
        })
        
        app.listen(port, () => {
            console.log(`Listening to port ${port}`)
        })
    })
    .catch((err) => {
        console.log(err);
    })
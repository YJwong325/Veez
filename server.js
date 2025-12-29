const express = require('express')
const path = require('path')

const port = process.env.PORT || 8080

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.json())

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/manga', (req, res) => {
    let query = `
        query ($id: Int) {
            Media (id: $id, type: MANGA) {
                id
                title {
                    english
                }
            }
        }
    `
    let variables = {
        id: 63327
    }

    let url = 'https://graphql.anilist.co'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    })
        .then((response) => {
            return response.json().then((json) => {
                return response.ok ? json : Promise.reject(json)
            })
        })
        .then((data) => {
            console.log(JSON.stringify(data))
            res.render('manga', { mangas: data.data.Media })
        })
        .catch((err) => {
            res.status(500).render('500', { errMessage: err })
        })
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
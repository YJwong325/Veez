const catData = require('../data/category.json')
const mediaData = require('../data/media.json')

let media = []

function initialize() {
    let aniData = mediaData.filter((elem) => elem.cat_id === 1)
    let mangaData = mediaData.filter((elem) => elem.cat_id !== 1)

    // GraphQL query for fetching ANIME typed media
    let query = `
        query ($ids: [Int]) {
            Page (perPage: 10) {
                media (id_in: $ids, type: ANIME) {
                    src_id: id
                    title {
                        english
                    }
                    coverImage {
                        large
                    }
                    siteUrl
                }
            }
        }
    `

    let variables = {
        ids: []
    }

    aniData.forEach((anime) => {
        variables.ids.push(anime.src_id)
    })

    let url = 'https://graphql.anilist.co'
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    }

    // fetch ANIME
    fetch(url, options)
        .then((response) => {
            return response.json().then((json) => {
                return response.ok ? json : Promise.reject(json)
            })
        })
        .then((data) => {
            // add id and cat_id fields to the fetched objects before appending to media array
            // id acts as a primary key because src_id may not be unique
            // the added id attribute can be used as primary key when we eventually add a DB
            data.data.Page.media.forEach((obj) => {
                // all fetched objects in this query are type ANIME 
                obj.cat_id = 1
                
                // aniData is already filtered by category to make sure there are no
                // unexpected behavior with 2 objects sharing the same src_id in different categories
                let srcObj = aniData.find((elem) => elem.src_id === obj.src_id)
                obj.id = srcObj.id

                let category = catData.find((elem) => elem.id === 1)
                obj.category = category.cat_name
            })
            media.concat(data.data.Page.media)
        })
        .catch((err) => {
            console.log(err)
        })

    query = `
        query ($ids: [Int]) {
            Page (perPage: 10) {
                media (id_in: $ids, type: MANGA) {
                    src_id: id
                    title {
                        english
                    }
                    coverImage {
                        large
                    }
                    siteUrl
                }
            }
        }
    `

    variables.ids = []

    mangaData.forEach((manga) => {
        variables.ids.push(manga.src_id)
    })

    // update request body for MANGA GraphQL query
    options.body = JSON.stringify({
        query: query,
        variables: variables
    })

    // fetch MANGA
    fetch(url, options)
        .then((response) => {
            return response.json().then((json) => {
                return response.ok ? json : Promise.reject(json)
            })
        })
        .then((data) => {
            data.data.Page.media.forEach((obj) => {
                let srcObj = mangaData.find((elem) => elem.src_id === obj.src_id)

                obj.cat_id = srcObj.cat_id
                obj.id = srcObj.id
                
                let category = catData.find((elem) => elem.id === srcObj.cat_id)
                obj.category = category.cat_name
            })
            media.concat(data.data.Page.media)
        })
        .catch((err) => {
            console.log(err)
        })
}

function getAllMedia() {
    return media
}

function getMediaById(id) {
    return media.find((elem) => elem.id === id)
}

// category names will be exact because manga and manhwa both start with "man"
// will not use wildcards for querying 
function getMediaByCategory(category) {
    return media.filter((elem) => category.toLowerCase() === elem.category.toLowerCase())
}

module.exports = {initialize, getAllMedia, getMediaById, getMediaByCategory}
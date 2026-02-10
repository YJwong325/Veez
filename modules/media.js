const catData = require('../data/category.json');
const mediaData = require('../data/media.json');

let media = [];

function fetchMedia(type, filteredMedia) {
    let query = `
        query ($ids: [Int]) {
            Page (perPage: 50) {
                media (id_in: $ids, type: ${type}) {
                    src_id: id
                    title {
                        english
                        romaji
                    }
                    coverImage {
                        large
                        extraLarge
                    }
                    siteUrl
                }
            }
        }
    `;

    let variables = {
        ids: []
    };

    filteredMedia.forEach((elem) => {
        variables.ids.push(elem.src_id);
    });

    let url = 'https://graphql.anilist.co';
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
    };

    return fetch(url, options)
            .then((response) => {
                return response.json().then((json) => {
                    return response.ok ? json : Promise.reject(json);
                });
            })
            .then((data) => {
                // add id and cat_id fields to the fetched objects before appending to media array
                data.data.Page.media.forEach((obj) => {
                    let srcObj = filteredMedia.find(({src_id}) => src_id === obj.src_id);

                    obj.id = srcObj.id;
                    obj.cat_id = srcObj.cat_id;
                    
                    let category = catData.find(({id}) => id === obj.cat_id);
                    obj.category = category.cat_name;
                });
                media.push(...data.data.Page.media);
            });
}

function initialize() {
    return new Promise((resolve, reject) => {
        let aniData = mediaData.filter((elem) => elem.cat_id === 1);
        let mangaData = mediaData.filter((elem) => elem.cat_id !== 1);
    
        const aniFetch = fetchMedia('ANIME', aniData);
        const mangaFetch = fetchMedia('MANGA', mangaData);

        Promise.all([aniFetch, mangaFetch])
            .then(() => resolve())
            .catch(err => reject(err));
    });
}

function getAllMedia() {
    return new Promise((resolve, reject) => {
        resolve(media);
    });
}

function getMediaById(mediaId) {
    return new Promise((resolve, reject) => {
        resolve(media.find(({id}) => id === +mediaId));
    });
}

// category names will be exact because manga and manhwa both start with "man"
// will not use wildcards for querying 
function getMediaByCategory(mediaCat) {
    return new Promise((resolve, reject) => {
        resolve(media.filter(({category}) => category.toLowerCase() === mediaCat.toLowerCase()));
    });
}

module.exports = {initialize, getAllMedia, getMediaById, getMediaByCategory};
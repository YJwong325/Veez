jest.mock()
const { initialize, getAllMedia, getMediaById, getMediaByCategory, fetchMedia } = require('../modules/media.js');

fetchMedia = jest.fn();

test('initialize function resolves when both fetches are successful', async () => {

});
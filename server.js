const express = require('express');
const axios = require('axios');
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/externalapi/photos/:id', async (req, res) => {
    try {
        const photoId = req.params.id;

        // Obtener información de foto
        const photoResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos/${photoId}`);
        const photo = photoResponse.data;

        // Obtener información del álbum
        const albumResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${photo.albumId}`);
        const album = albumResponse.data;

        // Obtener información del usuario
        const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${album.userId}`);
        const user = userResponse.data;

        // Combinar información
        const enrichedPhoto = {
            ...photo,
            album: {
                ...album,
                user: user
            }
        };
        
        res.json(enrichedPhoto);
    } catch (error) {
        console.error('Error en /externalapi/photos/:id:', error);
        res.status(500).json({ error: 'Ha ocurrido un error!' });
    }
});

app.get('/externalapi/photos', async (req, res) => {
    try {
        const { title, limit = 25, offset = 0 } = req.query;

        // Obtener todas las fotos
        const photosResponse = await axios.get('https://jsonplaceholder.typicode.com/photos');
        let photos = photosResponse.data;

        // Filtrar por título del álbum
        if (title) {
            const albumsResponse = await axios.get('https://jsonplaceholder.typicode.com/albums');
            const albums = albumsResponse.data.filter(album => album.title.includes(title));
            const albumIds = albums.map(album => album.id);
            photos = photos.filter(photo => albumIds.includes(photo.albumId));
        }

        // Aplicar paginación
        const paginatedPhotos = photos.slice(offset, offset + limit);

        // Enriquecer las fotos con información del álbum y del usuario
        const enrichedPhotos = await Promise.all(paginatedPhotos.map(async (photo) => {
            const albumResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${photo.albumId}`);
            const album = albumResponse.data;

            const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${album.userId}`);
            const user = userResponse.data;

            return {
                ...photo,
                album: {
                    ...album,
                    user: user
                }
            };
        }));

        res.json(enrichedPhotos);
    } catch (error) {
        console.error('Error en /externalapi/photos:', error);
        res.status(500).json({ error: 'Ha ocurrido un Error!' });
    }
});

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});
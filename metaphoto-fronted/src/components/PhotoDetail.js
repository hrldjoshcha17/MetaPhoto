import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PhotoDetail = () => {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/externalapi/photos/${id}`);
                setPhoto(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al buscar fotos', error);
            }
        };

        fetchPhoto();
    }, [id]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="container">
            <div className="photo-detail">
                <h1>{photo.title}</h1>
                <img src={photo.url} alt={photo.title} />
                <h2>Álbum: {photo.album.title}</h2>
                <p>${photo.url}</p>
                <h3>Usuario: {photo.album.user.name}</h3>
                <p>Email: {photo.album.user.email}</p>
                <Link to="/" className="back-button">Regresar a la galería</Link>
            </div>
        </div>
    );
};

export default PhotoDetail;
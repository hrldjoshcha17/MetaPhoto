import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PhotoList = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [titleFilter, setTitleFilter] = useState('');

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/externalapi/photos?title=${titleFilter}&limit=${limit}&offset=${(page - 1) * limit}`);
                setPhotos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al buscar fotos:', error);
            }
        };

        fetchPhotos();
    }, [page, limit, titleFilter]);

    return (
        <div className="container">
            <h1>Galería de Fotos</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filtrar por título del álbum"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                />
                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="photo-grid">
                    {photos.map(photo => (
                        <div key={photo.id} className="photo-card">
                            <Link to={`/photos/${photo.id}`}>
                                <img src={photo.thumbnailUrl} alt={photo.title} />
                                <p>{photo.title}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
                <span>Página {page}</span>
                <button onClick={() => setPage(page + 1)}>Siguiente</button>
            </div>
        </div>
    );
};

export default PhotoList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Movie from './MovieBox.js';
import NavBar from './NavBar.js';

export default function HistoryList(props) {
    const { userName, logout = () => { } } = props;
    const [historyData, setHistory] = useState({ movies: [], ready: false, });

    useEffect(() => {
        setHistory(prevState => ({
            ...prevState,
            ready: false,
        }));
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/history/${userName}`)
            .then(res => {
                setHistory({
                    movies: res.data,
                    ready: true,
                });
            })
            .catch(err => console.log(err));
    }, [])

    const handleDislike = movieId => {
        setHistory({
            movies: historyData.movies.filter(el => el['_id'] != movieId),
            ready: true,
        });
    }

    const itemWidth = '250px';
    const itemsPerRow = 5;
    const placeholders = new Array(itemsPerRow - (historyData.movies.length % itemsPerRow)).fill(0);
    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he visto']}
                showSearchButton={true}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
            />
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: '50px', flexWrap: "wrap" }}>
                <label style={{ fontSize: '3em', padding: '20px 0px 20px 0px' }}> Las peliculas que has visto </label>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center', flexDirection: 'row' }}>
                    {historyData.movies.reduce((accumulator, movie, index) => {

                        const el = (
                            <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}>
                                <MovieHistoryWrapper
                                    movieId={movie['_id']}
                                    movieTitle={movie['title']}
                                    reviews={movie['reviews_list'] ? movie['reviews_list'].length : 0}
                                    onDislike={(id) => handleDislike(id)}
                                    userName={userName}
                                />
                            </div>
                        );
                        const el2 = (<div style={{ flexBasis: "100%", height: "40px" }}> </div>);

                        if ((index + 1) % itemsPerRow === 0) {
                            accumulator.push(el, el2);
                        } else {
                            accumulator.push(el);
                        }
                        return accumulator
                    }, []
                    )}
                    {placeholders.length < itemsPerRow && placeholders.map(() => (
                        <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MovieHistoryWrapper(props) {
    const { movieId, movieTitle, reviews, userName, onDislike } = props;

    const handleDislikeArtist = (movieId, userName) => {
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/dislike`, {
            userId: userName,
            movieId: movieId,
        })
            .then(res => {
                console.log(res)
                onDislike(movieId)
            })
            .catch(err => console.log(err))
    };

    return (
        <Movie
            movieTitle={movieTitle}
            numReviews={reviews}
            showDislikeButton={true}
            handleDislike={() => handleDislikeArtist(movieId, userName)}
        />
    )
};

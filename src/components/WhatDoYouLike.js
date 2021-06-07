import { Button } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Movie from './MovieBox.js'
import NavBar from './NavBar.js'

export default function WhatDoYouLike(props) {
    const { userName } = props;
    const [topMovies, setTopMovies] = useState({ ready: false, data: [] });
    const [allowContinue, setAllow] = useState(false)

    const fetchTopMovies = () => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/top`)
            .then(res => {
                setTopMovies({
                    ready: true,
                    data: res.data,
                })
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchTopMovies();
    }, []);

    const itemWidth = '250px';
    const itemsPerRow = 5;
    const placeholders = new Array(itemsPerRow - (topMovies.data.length % itemsPerRow)).fill(0);
    return (
        <div>
            <NavBar
                showSearchButton={false}
            />
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: '50px', flexWrap: "wrap" }}>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <label style={{ width: '100%', fontSize: '3em', padding: '20px 0px 20px 0px' }}> Queremos conocerte, cuentanos que te gusta...</label>
                    <div style={{ width: '100%', display: 'flex', flexDirection: "row-reverse"}}>
                        <div style={{height: '40px'}}>
                        <Button
                            disabled={!allowContinue}
                            variant='contained'
                            color='primary'
                            component={Link}
                            to='/home'
                        >
                            CONTINUAR
                        </Button>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center' }}>
                    {topMovies.ready && topMovies.data.reduce((accumulator, movie, index) => {
                        const el = (
                            <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}>
                                <MovieTopWrapper
                                    movieId={movie['_id']}
                                    movieTitle={movie['title']}
                                    numReviews={movie['reviews_list'] ? movie['reviews_list'].length : 0}
                                    userName={userName}
                                    onAction={() => setAllow(true)}
                                />
                            </div>
                        );
                        const el2 = (<div style={{ flexBasis: "100%", height: "40px" }}> </div>)

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

function MovieTopWrapper(props) {
    const { movieId, movieTitle, numReviews, userName, onAction } = props;
    const [movieState, setState] = useState({
        paperAsPurple: false,
        paperAsRed: false,
        disableButtons: false,
    });

    const handleDislikeMovie = (movieId, userName) => {
        setState({
            paperAsPurple: false,
            paperAsRed: true,
            disableButtons: true,
        });
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/dislike`, {
            userId: userName,
            movieId: movieId,
        })
            .then(res => {
                onAction();
            })
            .catch(err => console.log(err))
    };

    const handleLikeMovie = (movieId, userName) => {
        setState({
            paperAsPurple: true,
            paperAsRed: false,
            disableButtons: true,
        });
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/like`, {
            userId: userName,
            movieId: movieId,
        })
            .then(res => {
                onAction();
            })
            .catch(err => console.log(err))
    };

    return (
        <Movie
            paperAsRed={movieState.paperAsRed}
            paperAsPurple={movieState.paperAsPurple}
            disableButtons={movieState.disableButtons}
            movieTitle={movieTitle}
            numReviews={numReviews}
            showLikeButton={true}
            handleLike={() => handleLikeMovie(movieId, userName)}
            showDislikeButton={true}
            handleDislike={() => handleDislikeMovie(movieId, userName)}
        />
    )
};

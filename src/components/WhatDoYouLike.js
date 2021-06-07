import { Button } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Movie from './MovieBox.js'
import NavBar from './NavBar.js'

export default function WhatDoYouLike(props) {
    const { userName } = props;
    const [topArtists, setTopArtists] = useState({ ready: false, data: [] });
    const [allowContinue, setAllow] = useState(false)

    const fetchArtists = () => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/top/`)
            .then(res => {
                setTopArtists({
                    ready: true,
                    data: res.data['top'],
                })
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchArtists();
    }, []);

    const itemWidth = '250px';
    const itemsPerRow = 5;
    const placeholders = new Array(itemsPerRow - (topArtists.data.length % itemsPerRow)).fill(0);
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
                    {topArtists.ready && topArtists.data.reduce((accumulator, artist, index) => {
                        const el = (
                            <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}>
                                <ArtistTopWrapper
                                    aid={artist['artist_id']}
                                    plays={artist['play_sum']}
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

function ArtistTopWrapper(props) {
    const { aid, plays, userName, onAction } = props;
    const [artistName, setName] = useState('Cargando...');
    const [artistState, setState] = useState({
        paperAsPurple: false,
        paperAsRed: false,
        disableButtons: false,
    });

    const handleDislikeArtist = (aid, userName) => {
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/api/dislike/`, {
            user_id: userName,
            artist_id: aid,
        })
            .then(res => {
                setState({
                    paperAsPurple: false,
                    paperAsRed: true,
                    disableButtons: true,
                });
                onAction();
            })
            .catch(err => console.log(err))
    };

    const handleLikeArtist = (aid, userName) => {
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/api/like/`, {
            user_id: userName,
            artist_id: aid,
        })
            .then(res => {
                setState({
                    paperAsPurple: true,
                    paperAsRed: false,
                    disableButtons: true,
                });
                onAction();
            })
            .catch(err => console.log(err))
    };

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/artist/${aid}/`)
            .then(res => {
                setName(res.data['artist_name']);
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <Movie
            paperAsRed={artistState.paperAsRed}
            paperAsPurple={artistState.paperAsPurple}
            disableButtons={artistState.disableButtons}
            artistName={artistName}
            numListens={plays}
            showLikeButton={true}
            handleLike={() => handleLikeArtist(aid, userName)}
            showDislikeButton={true}
            handleDislike={() => handleDislikeArtist(aid, userName)}
        />
    )
};

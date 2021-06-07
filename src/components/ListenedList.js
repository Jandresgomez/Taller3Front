import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Movie from './MovieBox.js';
import NavBar from './NavBar.js';



export default function ListenedList(props) {
    const { userName, logout = () => { } } = props;
    const [historyData, setHistory] = useState({ artists: [] });

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/history/${userName}/`)
            .then(res => {
                setHistory({
                    artists: res.data['history']
                });
            })
            .catch(err => console.log(err));
    }, [])

    const itemWidth = '250px';
    const itemsPerRow = 5;
    const placeholders = new Array(itemsPerRow - (historyData.artists.length % itemsPerRow)).fill(0);
    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he escuchado']}
                showSearchButton={true}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
            />
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: '50px', flexWrap: "wrap" }}>
                <label style={{ fontSize: '3em', padding: '20px 0px 20px 0px' }}> Los artistas que has escuchado </label>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center', flexDirection:'row' }}>
                    {historyData.artists.reduce((accumulator, artist, index) => {

                        const el = (
                            <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}>
                                <ArtistHistoryWrapper
                                    aid={artist['artist_id']}
                                    plays={artist['play_count']}
                                    userName={userName}
                                    isLiked={artist['liked']}
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

function ArtistHistoryWrapper(props) {
    const { aid, plays, userName, isLiked } = props;
    const [artistName, setName] = useState('Cargando...');
    const [artistState, setState] = useState({
        paperAsPurple: isLiked,
        paperAsRed: !isLiked,
    })

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/artist/${aid}/`)
            .then(res => {
                setName(res.data['artist_name']);
            })
            .catch(err => console.log(err))
    }, [])

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
                });
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
                });
            })
            .catch(err => console.log(err))
    };

    return (
        <Movie
            paperAsRed={artistState.paperAsRed}
            paperAsPurple={artistState.paperAsPurple}
            artistName={artistName}
            numListens={plays}
            showLikeButton={true}
            listensTitle='Escuchado por ti:'
            handleLike={() => handleLikeArtist(aid, userName)}
            showDislikeButton={true}
            handleDislike={() => handleDislikeArtist(aid, userName)}
        />
    )
};

import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Song from './SongBox.js';
import Movie from './MovieBox.js';
import NavBar from './NavBar.js';
import { makeStyles, recomposeColor } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(11),
            width: "100%"
        },
    },
}));

export default function Recommendation(props) {
    const classes = useStyles();
    const { userName, logout = () => { } } = props;
    const [recomData, setData] = useState({ ready: false, artists: [] });

    const fetchData = () => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/recommendation/${userName}/`)
            .then(res => {
                var recomUpdate = []
                if ('iid' in res.data) {
                    recomUpdate = Object.values(res.data['iid'])
                } else {
                    recomUpdate = res.data['results']
                }
                setData(prevState => ({
                    ...prevState,
                    ready: true,
                    artists: recomUpdate,
                }))
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchData();
    }, []);

    const changeRecommendations = () => {
        setData(prevState => ({
            ...prevState,
            ready: false,
        }));
        axios.get(
            `http://${process.env.REACT_APP_BACKEND_URL}/api/push/${userName}/`,
        ).then(res => {
            fetchData();
        })
        .catch(err => console.log(err))
    }

    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he escuchado']}
                showSearchButton={true}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
            />

            <div style={{ flexDirection: "column", margin: '50px', justifyItems: "stretch", alignItems: "center" }}>
                <div style={{ display: "flex", padding: '50px 20px 20px 20px' }}>
                    <div style={{ flexGrow: "1" }}>
                        <div style={{ display: "flex", justifyContent: "start" }}>
                            <label style={{ fontSize: '2em', width: "100%", textAlign: 'left', alignSelf: 'stretch' }}>Basado en lo que has escuchado, te recomendamos: </label>
                        </div>
                    </div>
                    <div style={{ flexGrow: "1" }}>
                        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                            <Button variant="contained" color="primary" onClick={() => changeRecommendations()}> Nuevas Recomendaciones </Button>
                        </div>
                    </div>
                </div>
                {!recomData.ready && (
                    <div>
                        <h1>Cargando...</h1>
                    </div>
                )}
                {recomData.ready && recomData.artists.map((aid, index) => (
                    <ArtistContainer aid={aid} userName={userName} />
                ))}
            </div>
        </div>
    );
}


function ArtistContainer(props) {
    const { aid, userName } = props;
    const [artistData, setArtistData] = useState({ ready: false });

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/artist/${aid}/`)
            .then(res => {
                setArtistData(prevState => ({
                    ...prevState,
                    ready: true,
                    name: res.data['artist_name'],
                    worldListens: res.data['total_play'],
                    songs: res.data['songs'].slice(0, 5),
                }))
            })
            .catch(err => console.log(err));
    }, []);

    const handleSongPlay = (tid, uid) => {
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/api/play/`,
            {
                user_id: uid,
                track_id: tid,
            })
            .catch(err => console.log(err))
        setArtistData(prevState => ({
            ...prevState,
            worldListens: prevState.worldListens + 1
        }))
    }


    if (artistData.ready) {
        return (
            <div style={{ paddingTop: '75px' }}>
                <Paper elevation={5} square style={{ height: '40%' }}>
                    <div style={{ justifyContent: "space-evenly", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px' }}>
                        <div style={{ maxWidth: "20%", maxHeight: "60%" }}>
                            <ArtistHomeWrapper aid={aid} artistName={artistData.name} userName={userName} plays={artistData.worldListens}/>
                        </div>
                        <div style={{ width: "70%", flexDirection: "column" }}>
                            {artistData.songs.map((song) => {
                                return (
                                    <div style={{ padding: '15px 0px 15px 0px' }}>
                                        <Song songName={song['track_name']} onPlay={() => handleSongPlay(song['track_id'], userName)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Paper>
            </div>
        );
    } else {
        return (<div></div>);
    }
}

function ArtistHomeWrapper(props) {
    const { aid, plays, userName, artistName } = props;
    const [artistState, setState] = useState({
        paperAsPurple: false,
        paperAsRed: false,
        disableButtons: false,
    })

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
            })
            .catch(err => console.log(err))
    };

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
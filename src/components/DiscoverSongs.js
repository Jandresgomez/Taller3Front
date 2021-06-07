import Paper from '@material-ui/core/Paper';
import SongBox from './SongBox.js';
import NavBar from './NavBar.js';
import Movie from './MovieBox.js'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(3),
            width: '40%',
        },
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
}));


export default function DiscoverSongs(props) {
    const { aid } = useParams();
    const { logout, userName } = props;
    const [artistData, setArtistData] = useState({ ready: false });

    const fetchArtistData = () => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/api/artist/${aid}/`)
            .then(res => {
                setArtistData(prevState => ({
                    ...prevState,
                    ready: true,
                    name: res.data['artist_name'],
                    worldListens: res.data['total_play'],
                    songs: res.data['songs'],
                }))
            })
            .catch(err => console.log(err));
    }

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

    useEffect(() => {
        fetchArtistData();
    }, []);

    const classes = useStyles();
    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he escuchado']}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
                showSearchButton={true}
            />
            <div style={{ padding: '30px 60px 20px 60px' }}>
                <Paper elevation={5} square>
                    <div style={{ justifyContent: "space-evenly", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px' }}>
                        <div style={{ maxWidth: "20%", maxHeight: "80%" }}>
                            <Movie artistName={artistData.name} numListens={artistData.worldListens} showButton={false} />
                        </div>
                        <div style={{ width: "70%", justifyContent: "center", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px', flexDirection: "column" }}>
                            {artistData.ready && artistData.songs.map((song) => {
                                return (
                                    <div style={{ width: "95%", padding: '10px 100px 30px 100px' }}>
                                        <SongBox songName={song['track_name']} onPlay={() => handleSongPlay(song['track_id'], userName)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    );
}
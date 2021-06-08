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


export default function MovieDetails(props) {
    const { movieId } = useParams();
    const { logout, userName } = props;
    const [movieData, setMovieData] = useState({ ready: false });
    const [cardData, setContainerState] = useState({
        paperAsPurple: false,
        disableButtons: false,
    })

    const fetchArtistData = () => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/movie/${movieId}`)
            .then(res => {
                setMovieData(prevState => ({
                    ...prevState,
                    ready: true,
                    movie: res.data,
                }))
            })
            .catch(err => console.log(err));
    }

    const handleLikeMovie = (movieId, userId) => {
        setContainerState({
            paperAsPurple: true,
            disableButtons: true,
        });
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/like`,
            {
                userId: userId,
                movieId: movieId,
            })
            .catch(err => console.log(err))
        setMovieData(prevState => ({
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
                labels={['INICIO', 'Lo que he visto']}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
                showSearchButton={true}
            />
            <div style={{ padding: '30px 60px 20px 60px' }}>
                <Paper elevation={5} square>
                    <div style={{ justifyContent: "space-evenly", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px' }}>
                        <div style={{ maxWidth: "20%", maxHeight: "80%" }}>
                            <Movie 
                            movieTitle={movieData.ready ? movieData.movie['title'] : ""} 
                            numReviews={movieData.ready ? (movieData.movie['reviews_list'] ? movieData.movie['reviews_list'].length : 0) : ''}
                            disableButtons={cardData.disableButtons}
                            paperAsPurple={cardData.paperAsPurple}
                            showLikeButton={true}
                            handleLike={() => handleLikeMovie(movieData['_id'], userName)}
                            />
                        </div>
                        <div style={{ width: "70%", justifyContent: "center", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px', flexDirection: "column" }}>
                            {movieData.ready && (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', width: '100%'}}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                                        <h3>Información basica</h3>
                                        {movieData.movie['year'] ? (<p>Lanzamiento: {movieData.movie['year']}</p>) : undefined}
                                        {movieData.movie['country'] ? (<p>Origen: {movieData.movie['country']}</p>) : undefined}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                                        <h3>Actores</h3>
                                        {movieData.movie['actors'].map((el) => (<p>{el}</p>))}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                                        <h3>Generos</h3>
                                        {movieData.movie['genres'].map((el) => (<p>{el}</p>))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    );
}
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
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/recommendations/${userName}`)
            .then(res => {
                setData(prevState => ({
                    ...prevState,
                    ready: true,
                    movies: res.data,
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
            `http://${process.env.REACT_APP_BACKEND_URL}/push/${userName}`,
        ).then(res => {
            fetchData();
        })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he visto']}
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
                {recomData.ready && recomData.movies.map((movieData, index) => (
                    <MovieContainer movieData={movieData} userName={userName} />
                ))}
            </div>
        </div>
    );
}


function MovieContainer(props) {
    const { movieData, userName } = props;
    const [cardData, setContainerState] = useState({
        paperAsPurple: false,
        paperAsRed: false,
        disableButtons: false,
    })

    const handleLikeMovie = (movieId, userId) => {
        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/like`, {
            userId: userId,
            movieId: movieId,
        })
            .then(res => {
                setContainerState({
                    paperAsPurple: false,
                    paperAsRed: true,
                    disableButtons: true,
                });
            })
            .catch(err => console.log(err))
    }

    const handleRemoveMovie = (movieId, userId) => {
    }


    return (
        <div style={{ paddingTop: '75px' }}>
            <Paper elevation={5} square style={{ height: '40%' }}>
                <div style={{ justifyContent: "space-evenly", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px' }}>
                    <div style={{ maxWidth: "20%", maxHeight: "60%" }}>
                        <Movie
                            movieTitle={movieData['title']}
                            numReviews={movieData.ready ? (movieData['reviews_list'] ? movieData['reviews_list'].length : 0) : ''}
                            showLikeButton={true}
                            showDislikeButton={true}
                            disableButtons={cardData.disableButtons}
                            paperAsPurple={cardData.paperAsPurple}
                            paperAsRed={cardData.paperAsRed}
                            handleLike={() => handleLikeMovie(movieData['_id'], userName)}
                            handleDislike={() => handleRemoveMovie(movieData['_id'], userName)}
                        />
                    </div>
                    <div style={{ width: "70%", justifyContent: "center", display: "flex", alignItems: "center", padding: '20px 0px 20px 0px', flexDirection: "column" }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
                                <h3>Información basica</h3>
                                {movieData['year'] ? (<p>Lanzamiento: {movieData['year']}</p>) : undefined}
                                {movieData['country'] ? (<p>Origen: {movieData['country']}</p>) : undefined}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
                                <h3>Actores</h3>
                                {movieData['actors'].map((el) => (<p>{el}</p>))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
                                <h3>Generos</h3>
                                {movieData['genres'].map((el) => (<p>{el}</p>))}
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    );
}
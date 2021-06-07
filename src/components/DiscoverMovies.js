import react from 'react';
import NavBar from './NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Movie from './MovieBox.js'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import MoviesGrid from './MoviesGrid.js';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(3),
            width: '65ch',
        },
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
        '&.MuiButton-containedPrimary': {
            backgroundColor: '#b53f3f',
        },
    },
}));

export default function DiscoverMovies(props) {
    const classes = useStyles();
    const { logout } = props;
    const [searchData, setSearchData] = useState({ ready: false, results: [] });
    const [searchVal, setSearchVal] = useState('');
    const [redirectToArtist, setRedirect] = useState({ show: false, aid: '' });

    const updateSearch = (query) => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/movies?partial_name=${query}`)
            .then(res => {
                setSearchData({
                    ready: true,
                    results: res.data
                });
            })
            .catch(err => console.log(err))
    };

    const handleDiscover = (aid) => {
        setRedirect({
            show: true,
            aid: aid,
        })
    }

    const handleClick = () => {
        setSearchData(prevState => ({
            ...prevState,
            ready: false,
        }));
        updateSearch(searchVal);
    }

    useEffect(() => {
        updateSearch('');
    }, []);

    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he visto']}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
                showSearchButton={true}
            />

            <div style={{ justifyContent: "center", display: "flex", alignItems: "center", padding: '50px 20px 20px 20px' }}>
                <label style={{ fontSize: '3em', padding: '20px 0px 20px 0px' }}> ¿Qué pelicula quieres ver hoy?</label>
                <div style={{ width: "80%", flexDirection: "column" }}>
                    <form className={classes.root} noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                        <TextField value={searchVal} onChange={e => setSearchVal(e.target.value)} id="outlined-basic" label="Nombre de la pelicula" variant="outlined" />
                    </form>
                </div>
                <div style={{ width: "20%", flexDirection: "column" }}>
                    <Button onClick={() => handleClick()} disabled={!searchData.ready} variant="contained" color="primary" className={classes.button}> Buscar </Button>
                </div>
            </div>
            <MoviesGrid
                searchData={searchData}
                handleDiscover={handleDiscover}
            />
            {redirectToArtist.show && (
                <Redirect to={`/detail/${redirectToArtist.aid}`} />
            )}
        </div>
    );
}
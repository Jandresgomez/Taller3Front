import NavBar from './NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Movie from './MovieBox.js'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';


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


    const itemWidth = '250px';
    const itemsPerRow = 5;
    const placeholders = new Array(itemsPerRow - (searchData.results.length%itemsPerRow)).fill(0);

    return (
        <div>
            <NavBar
                labels={['INICIO', 'Lo que he escuchado']}
                buttonRedirections={['/home', '/history']}
                showLogoutButton={true}
                logoutCallback={logout}
                showSearchButton={true}
            />

            <div style={{ justifyContent: "center", display: "flex", alignItems: "center", padding: '50px 20px 20px 20px' }}>
                <label style={{ fontSize: '3em', padding: '20px 0px 20px 0px' }}> ¿Qué artista quieres escuchar hoy?</label>
                <div style={{ width: "80%", flexDirection: "column" }}>
                    <form className={classes.root} noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                        <TextField value={searchVal} onChange={e => setSearchVal(e.target.value)} id="outlined-basic" label="Nombre de la pelicula" variant="outlined" />
                    </form>
                </div>
                <div style={{ width: "20%", flexDirection: "column" }}>
                    <Button onClick={() => handleClick()} disabled={!searchData.ready} variant="contained" color="primary" className={classes.button}> Buscar </Button>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: '50px', flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center' }}>
                    {!searchData.ready && (
                        <div>
                            <h1>Cargando...</h1>
                        </div>
                    )}
                    {searchData.ready && searchData.results.reduce((accumulator, artist, index) => {

                        const el = (
                            <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}>
                                <Movie
                                    artistName={artist['artist_name']}
                                    numListens={artist['play_total']}
                                    showDiscoverButton={true}
                                    onClickDiscover={() => handleDiscover(artist['artist_id'])}
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
                    {searchData.ready && placeholders.length < itemsPerRow && placeholders.map(() => (
                        <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}></div>
                    ))}
                </div>
            </div>
            {redirectToArtist.show && (
                <Redirect to={`/detail/${redirectToArtist.aid}`} />
            )}
        </div>
    );
}
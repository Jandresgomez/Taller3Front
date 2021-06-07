import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import NavBar from './NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { Button } from '@material-ui/core';
import { Redirect } from 'react-router';
import { Movie } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '80ch',
        },
    },
    movieIcon: {
        '&.MuiSvgIcon-root': {
            fontSize: "10rem",
            color: "#b53f3f",
        }
    }
}));

export default function SignIn(props) {
    const { setGlobalUserData } = props
    const classes = useStyles();
    const [userName, setUserName] = useState('');
    const [errorsData, setErrors] = useState({ context: '', show: false});
    const [showRedirect, setShowRedirect] = useState(false);

    const handleClick = () => {
        if (userName === "") {
            setErrors({...errorsData, show: true, context: 'User name cannot be empty.'});
        } else {
            axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/login/${userName}`)
            .then(res => {
                setShowRedirect(true)
                setGlobalUserData(userName, res.data)
            })
            .catch(err => {
                console.log(err)
                setErrors({...errorsData, show: true, context: 'Please enter a valid user name.'});
            })
        }
    }

    return (
        <div>
            <NavBar 
            labels={['Sign Up', 'Sign In']}
            showSearchButton={false}
            buttonRedirections={['/register','/',]}
            />
            <div style={{ padding: '50px 100px 50px 100px' }}>
                <Paper elevation={5} square>
                <div style={{padding: '25px 50px 25px 50px'}}>
                    <label style={{ width: "100%", fontSize: '3em' }}> Sign in</label>
                </div>
                    <div style={{padding: '25px 50px 25px 50px'}}>
                        <Movie className={classes.movieIcon}/>
                    </div>
                    <div style={{ flexDirection: "column", justifyContent: "center", display: "flex", alignItems: "center", width: "100%", padding: '25px 50px 25px 50px'}}>
                        <label style={{ width: "100%", fontSize: '3em' }}> Ingresa tu usuario para ver tus peliculas</label>
                        <div style={{ flexBasis: "100%", height: "100px", padding: '25px 50px 25px 50px' }}> </div>
                        <form className={classes.root} noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                            <TextField value={userName} onChange={(e) => setUserName(e.target.value)} id="outlined-basic" label="Usuario" variant="outlined" />
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                <Button color="primary" variant="contained" onClick={() => handleClick()}>Login</Button>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
                                    {errorsData.show && (<label>{errorsData.context}</label>)}
                                </div>
                            </div>
                        </form>
                        
                    </div>
                </Paper>
                {showRedirect && (<Redirect to="/home"/>)}
            </div>
        </div>

    )


}
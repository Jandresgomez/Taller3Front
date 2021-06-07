import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 5,
    textAlign: 'center',
    height: '80px'

  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: 'Start',
    flexDirection: "column",
    height: '80px'
  },
  customBar: {
    height: '80px'
  }
}));

export default function ButtonAppBar(props) {
  //const { button1, button2, showButton1, showButton2, showButton3} = props;
  const { labels = [], showSearchButton = false, showLogoutButton = false, buttonRedirections, logoutCallback = () => { } } = props;
  const classes = useStyles();

  return (
    <div className={classes.root} style={{ justifyContent: "space-evenly", alignItems: "center" }}>
      <AppBar position="static" className={classes.customBar}>
        <Toolbar>
          <Typography variant="h2" className={classes.title}>
            MyMusic.io
          </Typography>
          <div style={{ display: 'flex', flexDirection: "row" }}>
            {labels.map((buttonName, index) => (
              <Button
                color="inherit"
                component={Link}
                to={buttonRedirections[index]}
              >{buttonName}
              </Button>
            ))}
            {showLogoutButton && (
              <Button
                color="inherit"
                onClick={() => logoutCallback()}
              >
                CERRAR SESIÓN
              </Button>
            )}
            {showSearchButton && (
              <div style={{margin: '0px 10px'}}>
                <IconButton
                edge="start"
                component={Link}
                to='/search'
                className={classes.menuButton}
                color="inherit"
                aria-label="Search artists you like"
              >
                <SearchOutlinedIcon />
              </IconButton>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
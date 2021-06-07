import react from 'react';
import { Button, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import BlockIcon from '@material-ui/icons/Block';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

const useStyles = makeStyles((theme) => ({
    button: {
        '&.MuiButton-containedPrimary': {
            backgroundColor: '#b53f3f',
        },
    },
    iconButton: {
        '&.MuiIconButton-colorPrimary': {
            color: '#b53f3f',
        }
    }
}));

export default function MovieBox(props) {
    const {
        paperAsRed = false,
        paperAsPurple = false,
        disableButtons = false,
        movieTitle,
        numReviews,
        showLikeButton = false,
        showDislikeButton = false,
        handleLike = () => { },
        handleDislike = () => { },
        showDiscoverButton = false,
        onClickDiscover = () => { },
    } = props;

    const classes = useStyles();
    const defineColor = () => {
        if (paperAsRed) return '#8f8f8f'
        if (paperAsPurple) return '#63cf6c'
        return 'white'
    }

    return (
        <div>
            <Paper elevation={4} square style={{
                backgroundColor: defineColor()
            }}>
                <div>
                    <img src={process.env.PUBLIC_URL + '/movies.png'} width="100%" alt='Movie' />
                </div>
                <div>
                    <div style={{ justifyContent: "left", display: "flex", alignItems: "left", alignContent: "space-between", padding: '5px 0px 5px 0px' }}>
                        <label style={{ width: "100%", fontSize: '1em' }}>{movieTitle}</label>
                    </div>
                    <div style={{ justifyContent: "center", display: "flex", alignItems: "center", padding: '5px 0px 10px 10px' }}>
                        <label style={{ width: "100%", fontSize: '1em' }}>{numReviews == 1 ? `${numReviews} review` : `${numReviews} reviews`}</label>
                    </div>
                    <div style={{ justifyContent: "center", display: "flex", alignItems: "center", padding: '5px 0px 5px 0px', width: "100%" }}>
                        {showLikeButton && (
                            <div style={{ padding: '0px 0px 10px 0px' }}>
                                <IconButton
                                    disabled={disableButtons}
                                    color="primary"
                                    aria-label="dislike"
                                    onClick={() => handleLike()}>
                                    <ThumbUpIcon />
                                </IconButton>
                            </div>
                        )}
                        {showDislikeButton && (
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                <div style={{ padding: '0px 0px 10px 0px' }}>
                                    <IconButton
                                        disabled={disableButtons}
                                        color="primary"
                                        aria-label="ThumbUpIcon"
                                        onClick={() => handleDislike()}
                                        className={disableButtons ? undefined : classes.iconButton}
                                    >
                                        <BlockIcon />
                                    </IconButton>
                                </div>
                            </div>
                        )}
                        {showDiscoverButton && (
                            <div style={{ padding: '0px 0px 10px 0px' }}>
                                <Button
                                    disabled={disableButtons}
                                    color='primary'
                                    variant='contained'
                                    className={classes.button}
                                    onClick={() => onClickDiscover()}
                                >
                                    VER MÁS
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </Paper>
        </div>
    );
}
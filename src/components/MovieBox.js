import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

export default function MovieBox(props) {
    const {
        paperAsRed = false,
        paperAsPurple = false,
        disableButtons = false,
        artistName,
        numListens,
        showLikeButton = false,
        showDislikeButton = false,
        handleLike = () => {},
        handleDislike = () => {},
        showDiscoverButton = false,
        listensTitle,
        onClickDiscover = () => { },
    } = props;

    const defineColor = () => {
        if (paperAsRed) return '#ffb5b5'
        if (paperAsPurple) return '#b5b9ff'
        return 'white'
    }

    return (
        <div>
            <Paper elevation={4} square style={{
                backgroundColor: defineColor()
            }}>
                <div>
                    <img src={process.env.PUBLIC_URL + '/micro.jpg'} width="100%" alt='Artist' />
                </div>
                <div>
                    <div style={{ justifyContent: "left", display: "flex", alignItems: "left", alignContent: "space-between", padding: '5px 0px 5px 0px' }}>
                        <label style={{ width: "100%", fontSize: '1em' }}>Artist: </label>
                        <label style={{ width: "100%", fontSize: '1em' }}>{artistName}</label>
                    </div>
                    <div style={{ justifyContent: "center", display: "flex", alignItems: "center", padding: '5px 0px 10px 10px' }}>
                        <label style={{ width: "100%", fontSize: '1em' }}> {listensTitle ? listensTitle : 'Escuchado:'} </label>
                        <label style={{ width: "100%", fontSize: '1em' }}>{numListens == 1? `${numListens} vez` : `${numListens} veces`}</label>
                    </div>
                    <div style={{ justifyContent: "center", display: "flex", alignItems: "center", padding: '5px 0px 5px 0px', width: "100%" }}>
                        {showDislikeButton && (
                            <div style={{ padding: '0px 0px 10px 0px' }}>
                                <IconButton disabled={disableButtons} color="primary" aria-label="ThumbUpIcon" onClick={() => handleDislike()}>
                                    <ThumbDownIcon />
                                </IconButton>
                            </div>
                        )}
                        {showLikeButton && (
                            <div style={{ padding: '0px 0px 10px 0px' }}>
                                <IconButton disabled={disableButtons} color="primary" aria-label="ThumbUpIcon" onClick={() => handleLike()}>
                                    <ThumbUpIcon />
                                </IconButton>
                            </div>
                        )}
                        {showDiscoverButton && (
                            <div style={{ padding: '0px 0px 10px 0px' }}>
                                <Button
                                    disabled={disableButtons}
                                    color='primary'
                                    variant='contained'
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
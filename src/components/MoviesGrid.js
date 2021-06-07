import React, { useMemo } from 'react'
import Movie from './MovieBox';

const MoviesGrid = (props) => {
    const { searchData, handleDiscover } = props

    return useMemo(() => {
        const itemWidth = '250px';
        const itemsPerRow = 5;
        const placeholders = new Array(itemsPerRow - (searchData.results.length % itemsPerRow)).fill(0);
        return (
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: '50px', flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center' }}>
                    {!searchData.ready && (
                        <div>
                            <h1>Cargando...</h1>
                        </div>
                    )}
                    {searchData.ready && searchData.results.reduce((accumulator, movie, index) => {
                        const el = (
                            <div style={{ flexGrow: "1", padding: '20px 0px 20px 0px', maxWidth: itemWidth, margin: '0px 20px' }}>
                                <Movie
                                    movieTitle={movie['title']}
                                    numReviews={movie['reviews_list'] ? movie['reviews_list'].length : 0}
                                    showDiscoverButton={true}
                                    onClickDiscover={() => handleDiscover(movie['_id'])}
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
        );
    }, [searchData, handleDiscover])
}

export default MoviesGrid

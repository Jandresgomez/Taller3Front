import React, { useState } from 'react'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import HistoryList from './components/HistoryList'
import DiscoverMovies from './components/DiscoverMovies'
import RecommendationBox from './components/RecommendationBox'
import MovieDetails from './components/MovieDetails'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
} from "react-router-dom"; 
import WhatDoYouLike from './components/WhatDoYouLike'



function MainView() {
    const [userName, setUserName] = useState('');
    const [userData, setUserData] = useState({});
    const logout = () => {
        setUserName('');
        setUserData({});
    }
    return (
        <Router>
            <Switch>
                <Route path="/register">
                    <SignUp setGlobalUserName={name => setUserName(name)} />
                </Route>
                {userName !== '' &&
                    (<Route path="/discover">
                        <WhatDoYouLike userName={userName} logout={logout} />
                    </Route>)}
                {userName !== '' &&
                    (<Route path="/home">
                        <RecommendationBox userName={userName} logout={logout} />
                    </Route>)}
                {userName !== '' &&
                    (<Route path="/history">
                        <HistoryList userName={userName} logout={logout} />
                    </Route>)}
                {userName !== '' &&
                    (<Route path="/detail/:movieId">
                        <MovieDetails userName={userName} logout={logout} />
                    </Route>)}
                {userName !== '' &&
                    (<Route path="/search">
                        <DiscoverMovies userName={userName} logout={logout} />
                    </Route>)}
                <Route path="/">
                    <SignIn setGlobalUserData={(name, data)=> { setUserName(name); setUserData(data) }} />
                </Route>
            </Switch>
        </Router>
    )
}

export default MainView

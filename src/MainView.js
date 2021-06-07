import React, { useState } from 'react'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ListenedList from './components/ListenedList'
import DiscoverMovies from './components/DiscoverMovies'
import RecommendationBox from './components/RecommendationBox'
import DiscoverSongs from './components/DiscoverSongs'
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
                        <ListenedList userName={userName} logout={logout} />
                    </Route>)}
                {userName !== '' &&
                    (<Route path="/detail/:aid">
                        <DiscoverSongs userName={userName} logout={logout} />
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

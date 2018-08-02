import React, { Component } from 'react'
import logo from '../logo.svg';
import '../styles/App.css'
import HotelList from './HotelList'
import Home from './Home'
import PropertyList from './PropertyList'
import UserSignup from './UserSignup';
import Header from './Header'
import { Switch, Route } from 'react-router-dom'
import Login from './Login'

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header/>
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/properties" component={PropertyList}/>
            <Route exact path="/signup" component={UserSignup}/>
            <Route exact path="/login" component={Login}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default App

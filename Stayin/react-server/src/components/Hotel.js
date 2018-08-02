import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants';

class Hotel extends Component {
    render() {
        //const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
            <div>
                <div>
                    {this.props.hotel.name}
                </div>
                <div>
                    {this.props.hotel.about}
                </div>
            </div>
        )
    }
}

export default Hotel
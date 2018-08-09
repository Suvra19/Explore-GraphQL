import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'

class Room extends Component {
    render() {
        return (
            <div>
                <div>
                    {this.props.room.name}
                    <p>$ {this.props.room.price}</p>
                </div>
            </div>
        )
    }
}

export default Room
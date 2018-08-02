import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'

class Room extends Component {
    render() {
        return (
            <div>
                <div>
                    {this.props.room.name}
                    <p>$ {this.props.room.price}</p>
                    <p>{this.props.room.beds.length} beds</p>
                    <p>{this.props.room.beds.map(bed => bed)}</p>
                </div>
            </div>
        )
    }
}

export default Room
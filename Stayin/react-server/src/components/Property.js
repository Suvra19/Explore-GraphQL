import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants';
import Rooms from './Rooms'

class Property extends Component {
    render() {
        return (
            <div>
                <div>
                    {this.props.property.name}
                </div>
                <div>
                    {this.props.property.about}
                </div>
                <div>
                    Email: {this.props.property.email}
                </div>
                <div>
                    Phone: {this.props.property.phone}
                </div>
                <div>
                    Address: 
                    {this.props.property.address.street},
                    {this.props.property.address.city},
                    {this.props.property.address.country}
                </div>
                {/* <div>
                    Rooms:
                    { this.props.property.rooms.map(room => <Room key={room.id} room={room}/>)}
                </div> */}
            </div>
        )
    }
}

export default Property
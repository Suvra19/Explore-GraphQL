import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'

class Rooms extends Component {
    render() {
        const rooms = this.props.rooms
        return (
            <fieldset>
                <legend>Rooms</legend>
                {rooms.map(room => (
                    <div key={room.id}>
                        <span>{room.name}</span>
                        {room.prices.map(price => (
                            <div key={price.id}>
                                <span>{price.amount}</span>
                                <span>{price.currency.symbol}</span>
                                <span>{price.type.name}</span>
                            </div>
                        ))}
                        {room.beds.map(bed => (
                            <div key={bed.id}>
                                <span>{bed.type.name}</span>
                                <span>{bed.quantity}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </fieldset>
        )
    }
}

export default Rooms
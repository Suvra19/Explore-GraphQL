import React, { Component } from 'react'
import Hotel from './Hotel'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { LinkError } from 'apollo-link/lib/linkUtils';

const HOTELS_QUERY = gql`
    {
        findHotels {
            name
            about
        }
    }`

class HotelList extends Component {
    render() {
        return (
            <Query query={HOTELS_QUERY}>
                { ( { loading, error, data } ) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    const hotels = data.findHotels
                    return (
                        <div>
                            { hotels.map(hotel => <Hotel key={hotel.name} hotel={hotel}/>)}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default HotelList
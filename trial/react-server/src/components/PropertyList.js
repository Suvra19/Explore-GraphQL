import React, { Component } from 'react'
import Property from './Property'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const PROPERTY_QUERY = gql`
    {
        findProperties {
            id
            name
            about
            email
            phone
            address {
                street
                city
                country
            }
            hotel {
                name
            }
            rooms {
                id
                name
                price
                beds
            }
        }
    }`

class PropertyList extends Component {
    render() {
        return (
            <Query query={PROPERTY_QUERY}>
                { ( { loading, error, data } ) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    const properties = data.findProperties
                    return (
                        <div>
                            { properties.map(property => <Property key={property.id} property={property}/>)}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default PropertyList
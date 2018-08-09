import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FETCH_PROPERTY = gql`
    query FetchProperty($propertyId: ID!) {
        fetchOneProperty(id: $propertyId) {
            name
            about
            phone
            email
            address {
                city
                street
                country
            }
            categories {
                id
                name
            }
            facilities {
                id
                isComplimentary
                facility {
                    name
                    type {
                        name
                    }
                }
            }
            policies {
                id
                policy
            }
            rooms {
                name
                price
                beds {
                    type {
                        name
                    }
                    quantity
                }
            }
        }
    }
`

class PropertyDetails extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const propertyId = this.props.match.params['id']
        return (
            <div>
                <Query query={FETCH_PROPERTY} variables={{propertyId: propertyId}}>
                    { ( { loading, error, data } ) => {
                        if (loading) return <div>Fetching</div>
                        if (error) return <div>Error</div>
                        const property = data.fetchOneProperty
                        return (
                            <div>
                                <fieldset>
                                    <label>Basic info</label>
                                    <span>Name: </span>
                                    <span>{property.name}</span>
                                    <span>About: </span>
                                    <span>{property.about}</span>
                                    <span>Email: </span>
                                    <span>{property.email}</span>
                                    <span>Phone: </span>
                                    <span>{property.phone}</span>
                                </fieldset>
                                <fieldset>
                                    <label>Address</label>
                                    <span>{property.address.street}</span>
                                    <span>{property.address.city}</span>
                                    <span>{property.address.country}</span>
                                </fieldset>
                                <fieldset>
                                    <label>Categories</label>
                                    {property.categories.map(category => (
                                        <span key={category.id}>{category.name}</span>
                                    ))}
                                </fieldset>
                                <fieldset>
                                    <label>Facilities</label>
                                    {property.facilities.map(facility => (
                                        <span key={facility.facility.id}>{facility.facility.name}</span>
                                    ))}
                                </fieldset>
                                <fieldset>
                                    <label>Policies</label>
                                    {property.policies.map(policy => (
                                        <span key={policy.id}>{policy.policy}</span>
                                    ))}
                                </fieldset>
                            </div>
                        )
                    }}
                </Query>
            </div>
        )
    }
}

export default PropertyDetails
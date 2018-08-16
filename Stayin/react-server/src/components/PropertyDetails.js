import React, { Component } from 'react'
import { Query, Mutation, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import RoomCreate from './RoomCreate'
import Rooms from './Rooms'

const FETCH_PROPERTY = gql`
    query FetchProperty($propertyId: ID!) {
        fetchOneProperty(id: $propertyId) {
            id
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
                id
                name
                prices {
                    id
                    amount
                    currency {
                        symbol
                    }
                    type {
                        name
                    }
                }
                beds {
                    id
                    type {
                        name
                    }
                    quantity
                }
                facilities {
                    id
                    name
                    type {
                        name
                    }
                }
            }
        }
    }
`
class PropertyDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            about: '',
            phone: '',
            email: '',
            address: {},
            facilities: [],
            policies: [],
            rooms: [],
            show: false,
        }
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.handleAddRoom = this.handleAddRoom.bind(this)
    }

    componentDidMount() {
        const propertyId = this.props.match.params['id']
        this.props.client.query({
            query: FETCH_PROPERTY,
            variables: { propertyId: propertyId },
        }).then(result => {
            const property = result.data.fetchOneProperty
            this.setState({
                id: property.id,
                name: property.name,
                about: property.about,
                phone: property.phone,
                email: property.email,
                address: {...property.address},
                categories: [...property.categories],
                facilities: JSON.parse(JSON.stringify(property.facilities)),
                policies: JSON.parse(JSON.stringify(property.policies)),
                rooms: JSON.parse(JSON.stringify(property.rooms)),
            }, () => {
                console.log(`Property states updated.`)
            })
        }).catch(reason => {
            console.log(`Property fetch failed due to ${reason}`)
        })
    }

    handleAddRoom(newRoom) {
        this.setState(prevState => {
            let rooms = JSON.parse(JSON.stringify(prevState.rooms))
            rooms.push(newRoom)
            return {
                rooms: rooms
            }

        })
    }

    showModal() {
        this.setState({ show: true })
    }

    hideModal() {
        this.setState({ show: false })
    }

    handleValueChange(key, value) {
        this.setState({
            [key]: value
        })
    }

    render() {
        const {id, name, about, phone, email, address, categories, facilities, policies, rooms} = this.state
        return (
            <div>
                {this.state && this.state.id && <div>
                    <fieldset>
                        <label>Basic info</label>
                        <span>Name: </span>
                        <span>{name}</span>
                        <span>About: </span>
                        <span>{about}</span>
                        <span>Email: </span>
                        <span>{email}</span>
                        <span>Phone: </span>
                        <span>{phone}</span>
                    </fieldset>
                    <fieldset>
                        <label>Address</label>
                        <span>{address.street}</span>
                        <span>{address.city}</span>
                        <span>{address.country}</span>
                    </fieldset>
                    <fieldset>
                        <label>Categories</label>
                        {categories.map(category => (
                            <span key={category.id}>{category.name}</span>
                        ))}
                    </fieldset>
                    <fieldset>
                        <label>Facilities</label>
                        {facilities.map(facility => (
                            <span key={facility.facility.id}>{facility.facility.name}</span>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Policies</legend>
                        {policies.map(policy => (
                            <span key={policy.id}>{policy.policy}</span>
                        ))}
                    </fieldset>
                    {rooms.length > 0 && <Rooms rooms={rooms}/>}
                    <RoomCreate
                        show={this.state.show} 
                        handleClose={this.hideModal} 
                        property={id}
                        handleAddRoom={this.handleAddRoom}
                    />
                    <button onClick={this.showModal}>Add room</button>
                </div>}
            </div>
           
        )}
    }

export default withApollo(PropertyDetails)
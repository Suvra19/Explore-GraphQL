import React, { Component } from 'react'
import gql from 'graphql-tag'
import { AUTH_TOKEN } from '../constants'
import { Mutation, Query } from 'react-apollo'
import { Redirect } from 'react-router-dom'

const CREATE_PROPERTY = gql`
    mutation CreateProperty($name: String!, $about: String, $logo: String, $phone: String!, $email: String!, $photos: PropertyCreatephotosInput, $address: AddressCreateOneInput!, $rooms: RoomCreateManyWithoutPropertyInput, $policies: PolicyCreateManyWithoutPropertiesInput, $categories: CategoryCreateManyWithoutPropertiesInput, $facilties: PropertyFacilityCreateManyWithoutPropertyInput) {
        createProperty(name: $name, about: $about, logo: $logo, phone: $phone, email: $email, photos: $photos, address: $address, rooms: $rooms, policies: $policies, categories: $categories, facilties: $facilties) {
            id
        }
    }
`

class Confirmation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            propertyId: ''
        }
        this.confirm = this.confirm.bind(this)
    }

    confirm(data) {
        this.setState({
            propertyId: data.id
        })
    }

    render() {
        if (this.state.propertyId !== "") {
            const id = this.state.propertyId
            return <Redirect to={`/property/${id}`}/>
        }
        const {name, about, email, phone, address, categories, facilities, policies, logo, photos, rooms} = this.props.data
        return (
            <div>
                <section>
                    <h4>Basic Information</h4>
                    <span>Name: </span>
                    <span>{name}</span>
                    <span>About: </span>
                    <span>{about}</span>
                    <span>Email: </span>
                    <span>{email}</span>
                    <span>Phone: </span>
                    <span>{phone}</span>
                </section>
                <section>
                    <h4>Address</h4>
                    <span>Street: </span>
                    <span>{address.create.street}</span>
                    <span>City: </span>
                    <span>{address.create.city}</span>
                    <span>Country: </span>
                    <span>{address.create.country}</span>
                </section>
                <Mutation 
                    mutation={CREATE_PROPERTY} 
                    variables={{name, about, email, phone, address, categories, facilities, policies, logo, photos, rooms}}
                    onCompleted={data => this.confirm(data.createProperty)}>
                    {createProperty => 
                        <button onClick={createProperty}>
                            Confirm
                        </button>
                    }
                </Mutation>
            </div>
        )
    }
}

export default Confirmation
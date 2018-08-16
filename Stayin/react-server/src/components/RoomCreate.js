import React, { Component } from 'react'
import { Mutation, Query, graphql, compose } from 'react-apollo'
import { withRouter } from 'react'
import gql from 'graphql-tag'
import PriceComponent from './PriceComponent'
import BedComponent from './BedComponent'
import RoomFacility from './RoomFacility'

class RoomCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            createPrices: [{
                amount: '',
                currency: '',
                type: ''
            }],
            createBeds: [{
                quantity: '',
                type: ''
            }], 
            facilities: [],
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleBedChange = this.handleBedChange.bind(this)
        //this.handleChange = this.handleChange.bind(this)
        this.addComponent = this.addComponent.bind(this)
        this.removeComponent = this.removeComponent.bind(this)
        this.handleFacilityChange = this.handleFacilityChange.bind(this)
        this.confirm = this.confirm.bind(this)
    }

    confirm(data) {
        const {id, name, prices, beds, facilities} = data.createRoom
        const newPrices = JSON.parse(JSON.stringify(prices))
        const newBeds = JSON.parse(JSON.stringify(beds))
        const newFacilities = JSON.parse(JSON.stringify(facilities))
        this.props.handleAddRoom({
            id: id,
            name: name,
            prices: newPrices,
            beds: newBeds,
            facilities: newFacilities,
        })
        this.props.handleClose()
    }

    handleFacilityChange(value, checked) {
        this.setState(prevState => {
            let newFacilities = prevState.facilities.slice()
            if (checked) {
                newFacilities.push(value)
            } else {
                let index = newFacilities.indexOf(value)
                newFacilities.splice(index, 1)
            }
            return {
                facilities: newFacilities
            }
        })
    }

    handlePriceChange(index, name, value) {
        this.setState((prevState) => {
            let newPrices = prevState.createPrices.slice()
            let targetPrice = newPrices.splice(index, 1)[0]
            targetPrice[name] = value
            newPrices.splice(index, 0, targetPrice)
            return {
                createPrices: newPrices
            }
        })
    }

    handleBedChange(index, name, value) {
        this.setState(prevState => {
            let newBeds = prevState.createBeds.slice()
            let targetBed = newBeds.splice(index, 1)[0]
            targetBed[name] = value
            newBeds.splice(index, 0, targetBed)
            return {
                createBeds: newBeds
            }
        })
    }

    addComponent(e) {
        const name = e.target.name
        switch(name) {
            case 'bed': 
                this.setState((prevState) => {
                    let newBedState = JSON.parse(JSON.stringify(prevState.createBeds))
                    newBedState.push({
                        quantity: '',
                        type: ''
                    })
                    return {
                        createBeds: newBedState
                    }
                })
                break
            case 'price': 
                this.setState((prevState) => {
                    let newPriceState = JSON.parse(JSON.stringify(prevState.createPrices))
                    newPriceState.push({
                        amount: '',
                        currency: '',
                        type: '',
                    })
                    return {
                        createPrices: newPriceState
                    }
                })
                break
        }
    }

    removeComponent(name, index) {
        switch(name) {
            case 'bed': 
                this.setState((prevState) => {
                    let newBedState = JSON.parse(JSON.stringify(prevState.createBeds))
                    if (newBedState.length !== 1) {
                        newBedState.splice(index, 1)
                    }
                    return {
                        createBeds: newBedState
                    }
                })
                break
            case 'price': 
                this.setState((prevState) => {
                    let newPriceState = JSON.parse(JSON.stringify(prevState.createPrices))
                    if (newPriceState.length !== 1){
                        newPriceState.splice(index, 1)
                    }
                    return {
                        createPrices: newPriceState
                    }
                })
                break
        }
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        })
    }
    
    render() {
        const show = this.props.show
        const handleClose = this.props.handleClose
        const showHideClassName = show ? 'modal display-block' : 'modal display-none'
        const property = this.props.property
        const {name, createPrices, createBeds, facilities} = this.state
        const prices = JSON.parse(JSON.stringify(createPrices))
        const beds = JSON.parse(JSON.stringify(createBeds))
        const roomFacilities = JSON.parse(JSON.stringify(facilities))
        return (
            <div className={showHideClassName}>
                <section className="modal-main">
                    <h1>
                        <input type="text" id="name" name="name" value={name} placeholder="Name of the room ?" onChange={this.handleNameChange}/>
                    </h1>
                    <fieldset>
                        <legend>Prices</legend>
                        <button name='price' onClick={this.addComponent}>+</button>
                        {prices.map((price, index) => 
                            <PriceComponent key={index} id={index} price={price} remove={this.removeComponent} edit={this.handlePriceChange}/>
                        )}
                    </fieldset>
                    <fieldset>
                        <legend>Beds</legend>
                        <button name='bed' onClick={this.addComponent}>+</button>
                        {beds.map((bed, index) => 
                            <BedComponent key={index} id={index} bed={bed} remove={this.removeComponent} edit={this.handleBedChange}/>
                        )}
                    </fieldset>
                    <fieldset>
                        <legend>In-room facilities</legend>
                        <RoomFacility facilities={roomFacilities} edit={this.handleFacilityChange}/>
                    </fieldset>
                    <button onClick={handleClose}>close</button>
                    <Mutation mutation={CREATE_ROOM} variables={{ 
                        name: name,
                        property: property,
                        prices: prices,
                        beds: beds,
                        facilities: roomFacilities
                     }} onCompleted={data => this.confirm(data)}>
                        {createRoom => (
                            <button onClick={createRoom}>done</button>
                        )}
                    </Mutation>
                </section>
            </div>
        )
    }
}

const CREATE_ROOM = gql`
    mutation CreateRoom($name: String, $property: String!, $prices: [RoomPriceCreateInput!]!, $beds: [RoomBedCreateInput!]!, $facilities: [String!]!) {
        createRoom(name: $name, property: $property, prices: $prices, beds: $beds, facilities: $facilities) {
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
`
export default RoomCreate
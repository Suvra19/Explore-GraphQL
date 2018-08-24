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
        this.initState = {
            id: '',
            name: '',
            createPrices: [{
                id: '',
                amount: '',
                currency: '',
                type: ''
            }],
            createBeds: [{
                id: '',
                quantity: '',
                type: ''
            }], 
            facilities: [],
            deletePrices: [],
            deleteBeds: [],
            deleteFacilities: []
        }
        this.state = this.initState
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleBedChange = this.handleBedChange.bind(this)
        //this.handleChange = this.handleChange.bind(this)
        this.addComponent = this.addComponent.bind(this)
        this.removeComponent = this.removeComponent.bind(this)
        this.handleFacilityChange = this.handleFacilityChange.bind(this)
        //this.handleEditRoomProps = this.handleEditRoomProps.bind(this)
        this.clearDeleteStates = this.clearDeleteStates.bind(this)
        this.confirm = this.confirm.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.editRoom.id && this.props.editRoom.id !== prevState.id) {
            console.log(`Received props ${JSON.stringify(this.props.editRoom)}`)
            const room = this.props.editRoom
            const id = room.id
            const name = room.name ? room.name : ''
            const createPrices = room.prices.map(price => {
            // return ({id, amout, currency: { symbol }, type: { name }} = price)
                return ({
                    id : price.id,
                    amount: price.amount,
                    currency: price.currency.id,
                    type: price.type.id,
                })
            })
            console.log(`createPrices ${JSON.stringify(createPrices)}`)
            const createBeds = room.beds.map(bed => {
            //return ({id, type: { name }, quantity} = bed)
                return ({
                    id: bed.id,
                    quantity: bed.quantity,
                    type: bed.type.id,
                })
            })
            console.log(`createBeds ${JSON.stringify(createBeds)}`)
            const facilities = room.facilities.map(facility => facility.id)
            this.setState({
                id: id,
                name: name,
                createPrices: [...createPrices],
                createBeds: [...createBeds],
                facilities: [...facilities]
            })
        }
      }

    confirm(data) {
        this.setState(this.initState, () => {
            console.log(`After state reset ${JSON.stringify(this.state)}`)
            const {id, name, prices, beds, facilities} = data.createRoom ? data.createRoom : data.updateRoom
            const newPrices = JSON.parse(JSON.stringify(prices))
            console.log(`New prices: ${JSON.stringify(prices)}`)
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

        })
    }

    clearDeleteStates() {
        this.setState({
            id: '',
            name: '',
            createPrices: [{
                id: '',
                amount: '',
                currency: '',
                type: ''
            }],
            createBeds: [{
                id: '',
                quantity: '',
                type: ''
            }], 
            facilities: [],
            deletePrices: [],
            deleteBeds: [],
            deleteFacilities: []
        })
    }

    handleFacilityChange(value, checked) {
        this.setState(prevState => {
            let newFacilities = prevState.facilities.slice()
            let deleteFacilities = prevState.deleteFacilities.slice()
            if (checked) {
                newFacilities.push(value)
                if (deleteFacilities.includes(value)) {
                    const index = deleteFacilities.indexOf(value)
                    deleteFacilities.splice(index, 1)
                }
            } else {
                let index = newFacilities.indexOf(value)
                const deletedFacility = newFacilities.splice(index, 1)[0]
                deleteFacilities.push(deletedFacility)
            }
            return {
                facilities: newFacilities,
                deleteFacilities: deleteFacilities
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
                    let deleteBeds = prevState.deleteBeds.slice()
                    if (newBedState.length !== 1) {
                        let deletedBed = newBedState.splice(index, 1)[0]
                        if (deletedBed.id !== '') {
                            deleteBeds.push(deletedBed.id)
                        }
                    }
                    return {
                        createBeds: newBedState,
                        deleteBeds: deleteBeds
                    }
                })
                break
            case 'price': 
                this.setState((prevState) => {
                    let newPriceState = JSON.parse(JSON.stringify(prevState.createPrices))
                    let deletePrices = prevState.deletePrices.slice()
                    if (newPriceState.length !== 1){
                        let deletedPrice = newPriceState.splice(index, 1)[0]
                        if (deletedPrice.id !== '') {
                            deletePrices.push(deletedPrice.id)
                        }
                    }
                    return {
                        createPrices: newPriceState,
                        deletePrices: deletePrices
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
        let checkStateFlag = false
        console.log(`${JSON.stringify(this.props.editRoom)}`)
        // if (Object.keys(this.props.editRoom).length != 0) {
        //     checkStateFlag = true
        //     this.handleEditRoomProps(this.props.editRoom)
        // }
        //roomData = this.props.editRoom
        // id = roomData.id
        // name = roomData.name ? roomData.name: ''
        // prices = JSON.parse(JSON.stringify(roomData.prices))
        // beds = JSON.parse(JSON.stringify(roomData.beds))
        // facilities = JSON.parse(JSON.stringify(roomData.facilities))
        // name = roomData.name ? roomData.name: ''
        // prices = JSON.parse(JSON.stringify(roomData.createPrices))
        // beds = JSON.parse(JSON.stringify(roomData.createBeds))
        // facilities = JSON.parse(JSON.stringify(roomData.facilities))
        const id = this.state.id ? this.state.id : ''
        const name = this.state.name ? this.state.name: ''
        const prices = JSON.parse(JSON.stringify(this.state.createPrices))
        const beds = JSON.parse(JSON.stringify(this.state.createBeds))
        const facilities = JSON.parse(JSON.stringify(this.state.facilities))
        const deletePrices = JSON.parse(JSON.stringify(this.state.deletePrices))
        const deleteBeds = JSON.parse(JSON.stringify(this.state.deleteBeds))
        const deleteFacilities = JSON.parse(JSON.stringify(this.state.deleteFacilities))

        console.log(`STATE ${JSON.stringify(this.state)}`)
    
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
                        <RoomFacility facilities={facilities} edit={this.handleFacilityChange}/>
                    </fieldset>
                    <button onClick={handleClose}>close</button>
                    {id === '' && 
                    <Mutation mutation={CREATE_ROOM} variables={{ 
                        name: name,
                        property: property,
                        prices: prices,
                        beds: beds,
                        facilities: facilities
                     }} onCompleted={data => this.confirm(data)}>
                        {createRoom => (
                            <button onClick={createRoom}>done</button>
                        )}
                    </Mutation>
                    }
                    {id !== '' && 
                    <Mutation mutation={UPDATE_ROOM} variables={{ 
                        room: id,
                        name: name,
                        prices: prices,
                        beds: beds,
                        facilities: facilities,
                        deletePrices: deletePrices,
                        deleteBeds: deleteBeds,
                        deleteFacilities: deleteFacilities,
                     }} onCompleted={data => this.confirm(data)}>
                        {updateRoom => (
                            <button onClick={updateRoom}>done</button>
                        )}
                    </Mutation>
                    }
                    
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
                    id
                    symbol
                }
                type {
                    id
                    name
                }
            }
            beds {
                id
                type {
                    id
                    name
                }
                quantity
            }
            facilities {
                id
                name
                type {
                    id
                    name
                }
            }
        }
    }
`

const UPDATE_ROOM = gql`
    mutation UpdateRoom($room: String!, $name: String, $prices: [RoomPriceCreateInput], $beds: [RoomBedCreateInput], $facilities: [String], $deletePrices: [String], $deleteBeds: [String], $deleteFacilities: [String]) {
        updateRoom(room: $room, name: $name, prices: $prices, beds: $beds, facilities: $facilities, deletePrices: $deletePrices, deleteBeds: $deleteBeds, deleteFacilities: $deleteFacilities) {
            id
            name
            prices {
                id
                amount
                currency {
                    id
                    symbol
                }
                type {
                    id
                    name
                }
            }
            beds {
                id
                type {
                    id
                    name
                }
                quantity
            }
            facilities {
                id
                name
                type {
                    id
                    name
                }
            }
        }
    }
`
export default RoomCreate
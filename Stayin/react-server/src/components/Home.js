import React, {Component} from 'react'
import gql from 'graphql-tag'
import Property from './Property'
import { withApollo } from 'react-apollo'
import { setFormDataState } from '../common/utils'

const PROPERTY_SEARCH = gql`
    query PropertySearch($city: String!, $hotel: String, $adults: Int!) {
        findProperties(city: $city, hotel: $hotel, adults: $adults) {
            id
            name
            about
            address {
                street
                city
            }
            hotel {
                name
            }
            rooms {
                id
                name
                price
            }
        }
    }
`

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                hotel: '',
                city: '',
                tripType: 'family',
                petFriendly: false,
                checkIn: '',
                checkOut: '',
                minPrice: '',
                maxPrice: '',
                adults: 1,
                kids: 0,
                infants: 0,
            },
            properties: [],
        }
        this.handleDates = this.handleDates.bind(this)
        this.handleTripType = this.handleTripType.bind(this)
        this.handleFormDataChange = this.handleFormDataChange.bind(this)
    }

    // _setFormDataState(key, value) {
    //     this.setState({
    //         formData: {
    //             ...this.state.formData,
    //             [key]: value
    //         }
    //     })
    // }

    handleFormDataChange(event) {
        let key = event.target.id
        let value = event.target.value
        if (event.target.id === "petFriendly") {
            value = !this.state.formData.petFriendly
        }
        setFormDataState.call(this, key, value)
    }

    async handleTripType(event) {
        await setFormDataState.call(this, "tripType", event.target.value)
        if (this.state.formData.tripType === 'romantic') {
            setFormDataState.call(this, "adults", 2)
        }
        if (this.state.formData.tripType === 'family' || this.state.formData.tripType === 'solo' || 
        this.state.formData.tripType === 'work') {
            setFormDataState.call(this, "adults", 1)
        }
    }

    async handleDates(event) {
        await setFormDataState.call(this, "checkIn", event.target.value) 
        await this._updateMinMaxCheckout()
        setFormDataState.call(this, "checkOut", this.minCheckOut)
    }

    _updateMinMaxCheckout() {
        let checkInDate = new Date(this.state.checkIn)
        let dd = checkInDate.getDate()
        let mm = checkInDate.getMonth() + 1
        let yyyy = checkInDate.getFullYear()

        this.minCheckOut = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd + 1 < 10 ? '0' + (dd + 1) : dd + 1) 
        this.maxCheckOut = (mm + 6 > 12 ? yyyy + 1 : yyyy) + '-' + ((mm + 6) % 12 < 10 ? '0' + (mm + 6) % 12 : (mm + 6) % 12) + '-' + (dd < 10 ? '0' + dd : dd)
    }
    componentDidMount() {
        let today = new Date()
        let dd = today.getDate()
        let mm = today.getMonth() + 1
        let yyyy = today.getFullYear()
        this.minCheckIn = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd) 
        this.maxCheckIn = (mm + 6 > 12 ? yyyy + 1 : yyyy) + '-' + ((mm + 6) % 12 < 10 ? '0' + (mm + 6) % 12 : (mm + 6) % 12) + '-' + (dd < 10 ? '0' + dd : dd)
    }

    render() {
        const {hotel, city, tripType, petFriendly, checkIn, checkOut, minPrice, maxPrice, adults, kids, infants} = this.state.formData
        return (
            <div>
                <div className="flex mt3">
                    {this.state.properties.map((property, index) => (
                        <Property key={property.id} property={property} index={index}/>
                    ))}
                </div>
                {this.state.properties.length === 0 && 
                <div className="flex flex-column">
                    <label>
                        Hotel
                        <input 
                            id="hotel"
                            value={hotel}
                            onChange={this.handleFormDataChange} 
                            type="text"
                            placeholder="Hotel"/>
                    </label>
                    <label>
                        City
                        <input 
                            id="city"
                            value={city}
                            onChange={this.handleFormDataChange}
                            type="text"
                            placeholder="City"/>     
                    </label>
                    <label>
                        Trip type
                        <select value={tripType} onChange={this.handleTripType}>
                            <option value="family">Family</option>
                            <option
                            value="work">Work</option>
                            <option value="soloTraveller">Solo Traveller</option>
                            <option value="romantic">Romantic</option>
                        </select>
                    </label>
                    <label>
                        Pet friendly:
                        <input type="checkbox" 
                            id="petFriendly"
                            value={petFriendly} 
                            onChange={this.handleFormDataChange}
                        />
                    </label>
                    <p>Guests</p>
                    <label>
                        Adults:
                        <input type="number" 
                            id="adults"
                            value={adults} onChange={this.handleFormDataChange}
                            min="1"
                            max="10"
                        />
                    </label>
                    {this.state.tripType === 'family' &&
                        <label>
                            Kids:
                            <input type="number" 
                                id="kids"
                                value={kids} onChange={this.handleFormDataChange}
                                min="0"
                                max="10"
                            />
                        </label>
                    }
                    {this.state.tripType === 'family' &&
                        <label>
                            Infants:
                            <input type="number" 
                                id="infants"
                                value={infants} onChange={this.handleFormDataChange}
                                min="0"
                                max="10"
                            />
                        </label>
                    }
                    <label>
                        Check-in:
                        <input 
                            id="checkIn"
                            value={checkIn}
                            onChange={this.handleDates}
                            type="date"
                            min={this.minCheckIn}
                            max={this.maxCheckIn}/>
                    </label>
                    <label>
                        Check-out:
                        <input 
                            id="checkOut"
                            value={checkOut}
                            onChange={this.handleFormDataChange}
                            type="date"
                            min={this.minCheckOut}
                            max={this.maxCheckOut}/>
                    </label>
                    <button onClick={() => this._search()}>
                    Search
                    </button>
                </div>
            }
            </div>
        ) 
    }

    _search = async () => {
        const {city, hotel, adults} = this.state.formData
        const result = await this.props.client.query({
            query: PROPERTY_SEARCH,
            variables: {city, hotel, adults}
        })
        const propertyList = result.data.findProperties
        this.setState({properties: propertyList})   
    }
}

export default withApollo(Home)
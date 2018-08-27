import React, {Component} from 'react'
import gql from 'graphql-tag'
import Property from './Property'
import { Query, withApollo } from 'react-apollo'
import { setFormDataState } from '../common/utils'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            city: '',
            tripType: '',
            petFriendly: false,
            checkIn: '',
            checkOut: '',
            minPrice: '',
            maxPrice: '',
            adults: 1,
            kids: 0,
            infants: 0,
            properties: [],
        }
        this.handleDates = this.handleDates.bind(this)
        this.handleTripType = this.handleTripType.bind(this)
        this.handleFormDataChange = this.handleFormDataChange.bind(this)
    }

    handleFormDataChange(event) {
        let key = event.target.id
        let value = event.target.value
        if (key === "petFriendly") {
            value = !this.state.formData.petFriendly
        }
        this.setState({
            [key]: value
        })
    }

    handleTripType(event) {
        const value = event.target.value
        this.setState(prevState => {
            if (prevState.tripType !== value) {
                return {
                    tripType: value
                }
            }
        })
    }

    handleDates(event) {
        const value = event.target.value
        this.setState({
            checkIn: value
        }, () => {
            this._updateMinMaxCheckout()
            this.setState({
                checkOut: this.minCheckOut
            })
        })
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
        const {hotel, city, tripType, petFriendly, checkIn, checkOut, minPrice, maxPrice, adults, kids, infants} = this.state
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
                        <Query query = {FETCH_TRIP_TYPE}>{({loading, error, data}) => {
                            if (loading) return <div>Fetching...</div>
                            if (error) return <div>Error</div>
                            const tripTypes = data.fetchTripTypes
                            return (
                                <select name="tripType"
                                value={tripType} onChange={this.handleTripType}>
                                {
                                    tripTypes.map(tripType => 
                                    <option key={tripType.id} value={tripType.name}>
                                        {tripType.name}
                                    </option>)
                                }
                                </select>
                            )
                        }}
                        </Query>
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
        const {name, city, tripTypes, petFriendly, checkIn, checkOut, adults, kids, infants} = this.state
        const result = await this.props.client.query({
            query: PROPERTY_SEARCH,
            variables: {name, city, tripTypes, petFriendly, checkIn, checkOut, adults, kids, infants}
        })
        const propertyList = result.data.findProperties
        this.setState({properties: propertyList})   
    }
}

const FETCH_TRIP_TYPE = gql`
    query FetchTripTypes($id: ID, $name: String) {
        fetchTripTypes(id: $id, name: $name) {
            id
            name
        }
    }
`

const PROPERTY_SEARCH = gql`
    query PropertySearch($filter: PropertySearch) {
        findProperties(filter: $filter) {
            id
            name
            about
            address {
                street
                city
            }
            rooms {
                id
                name
                prices {
                    amount
                    currency {
                        symbol
                        name
                        name_plural
                    }
                    type {
                        name
                    }
                }
                beds {
                    id
                    quantity
                    type {
                        name
                    }
                }
            },
            facilities {
                isComplimentary
                facility {
                    name
                    type {
                        name
                    }
                }
            }
        }
    }
`

export default withApollo(Home)
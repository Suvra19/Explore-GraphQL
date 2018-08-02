import React, {Component} from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Property from './Property'
import { withApollo } from 'react-apollo'

const PROPERTY_SEARCH = gql`
    query PropertySearch($filter: String!) {
        findProperties(filter: $filter) {
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
                beds
            }
        }
    }
`

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hotel: '',
            city: '',
            tripType: 'family',
            checkIn: '',
            checkOut: '',
            minPrice: '',
            maxPrice: '',
            adults: 1,
            kids: 0,
            infants: 0,
            properties: [],
            filter: '',
        }
        this.handleDates = this.handleDates.bind(this)
        this.handleTripType = this.handleTripType.bind(this)
    }

    async handleTripType(event) {
        await this.setState({
            tripType: event.target.value
        })
        if (this.state.tripType === 'romantic') {
            this.setState({
                adults: 2
            })
        }
        if (this.state.tripType === 'family' || this.state.tripType === 'solo' || 
        this.state.tripType === 'work') {
            this.setState({
                adults: 1
            })
        }
    }

    async handleDates(event) {
        await this.setState({
            checkIn: event.target.value
        })
        await this._updateMinMaxCheckout()
        this.setState({
            checkOut: this.minCheckOut
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
        const {hotel, city, tripType, checkIn, checkOut, minPrice, maxPrice, adults, kids, infants} = this.state
        return (
            <div>
                <div className="flex flex-column">
                    <label>
                        Hotel
                        <input 
                            value={hotel}
                            onChange={e => this.setState({
                                hotel: e.target.value
                            })} 
                            type="text"
                            placeholder="Hotel"/>
                    </label>
                    <label>
                        City
                        <input 
                        value={city}
                        onChange={e => this.setState({
                            city: e.target.value
                        })} 
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
                    <p>Guests</p>
                    <label>
                        Adults:
                        <input type="number" 
                            value={adults} onChange={e => this.setState({
                                adults: e.target.value
                            })}
                            min="1"
                            max="10"
                        />
                    </label>
                    {this.state.tripType === 'family' &&
                        <label>
                            Kids:
                            <input type="number" 
                                value={kids} onChange={e => this.setState({
                                    kids: e.target.value
                                })}
                                min="0"
                                max="10"
                            />
                        </label>
                    }
                    {this.state.tripType === 'family' &&
                        <label>
                            Infants:
                            <input type="number" 
                                value={infants} onChange={e => this.setState({
                                    infants: e.target.value
                                })}
                                min="0"
                                max="10"
                            />
                        </label>
                    }
                    <label>
                        Check-in:
                        <input 
                            value={checkIn}
                            onChange={this.handleDates}
                            type="date"
                            min={this.minCheckIn}
                            max={this.maxCheckIn}/>
                    </label>
                    <label>
                        Check-out:
                        <input 
                            value={checkOut}
                            onChange={e => this.setState({
                                checkOut: e.target.value
                            })}
                            type="date"
                            min={this.minCheckOut}
                            max={this.maxCheckOut}/>
                    </label>
                </div>
               <button onClick={() => this._search()}>
                    Search
                </button>
                <div className="flex mt3">
                    {this.state.properties.map((property, index) => (
                        <Property key={property.id} property={property} index={index}/>
                    ))}
                </div>
            </div>
        ) 
    }

    _search = async () => {
        const filter = this.state.city
        console.log(`Filter ${filter}`)
        const result = await this.props.client.query({
            query: PROPERTY_SEARCH,
            variables: {filter},
        })
        console.log(`Result ${JSON.stringify(result)}`)
        const propertyList = result.data.findProperties
        this.setState({properties: propertyList})   
    }
}

export default withApollo(Home)
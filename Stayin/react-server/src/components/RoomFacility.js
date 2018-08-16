import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FETCH_ALL_ROOM_FACILITIES = gql`
    query FetchRoomFacilities {
        fetchFacilities(type: "room") {
            id
            name
        }
    }
`

class RoomFacility extends Component {
    constructor(props) {
        super(props)
        this.handleFacilityChange = this.handleFacilityChange.bind(this)
    }

    handleFacilityChange(e) {
        const checked = e.target.checked
        const value = e.target.value
        this.props.edit(value, checked)
    }
    
    render() {
        const facilities = this.props.facilities
        return (
            <Query query={FETCH_ALL_ROOM_FACILITIES}>
                {({loading, error, data}) => {
                    if (loading) return <div>Fetching...</div>
                    if (error) return <div>Error</div>
                    const roomFacilities = data.fetchFacilities
                    return (
                        <div>
                            {roomFacilities.map(facility => 
                                <label key={facility.id}>
                                    <input
                                        name="facility"
                                        type="checkbox"
                                        onChange={this.handleFacilityChange}
                                        checked={facilities.includes(facility.id)}
                                        value={facility.id}
                                    />
                                    {facility.name}
                                </label>
                            )}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default RoomFacility
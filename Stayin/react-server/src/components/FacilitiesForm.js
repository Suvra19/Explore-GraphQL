import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import '../styles/index.css'

const FETCH_PROPERTY_FACILITIES = gql`
    query FetchPropertyFacilities($filter: String) {
        fetchFacilityTypes(filter: $filter) {
            id
            name
            facilities {
                id
                name
            }
        }
    }
`
class FacilitiesForm extends Component {
    constructor(props) {
        super(props)
        this.facilities = {
            'create': []
        }
        this.currentIds = []
        this.prevIds = []
        this.handleFacilityChange = this.handleFacilityChange.bind(this)
    }

    // Click-1: Facility added
    // Click-2: Added facility is marked as complimentary
    // Click-3: Facility is removed
    handleFacilityChange(value, e) {
        e.preventDefault()
        let create = this.facilities['create']
        if (this.prevIds.includes(value)) {
            let removeIndex = create.map(item => item['facility']['connect']['id']).indexOf(value)
            create.splice(removeIndex, 1)
            this.prevIds.splice(this.prevIds.indexOf(value), 1)
        } else if (this.currentIds.includes(value)) {
            let removeIndex = create.map(item => item['facility']['connect']['id']).indexOf(value)
            const newVal = {
                'isComplimentary': true,
                'facility': {
                    'connect': {
                        'id': value
                    }
                }
            }
            this.prevIds.push(value)
            this.currentIds.splice(this.currentIds.indexOf(value), 1)
            create.splice(removeIndex, 1, newVal)
        } else {
            this.currentIds.push(value)
            let obj = {
                'isComplimentary': false,
                'facility': {
                    'connect': {
                        'id': value
                    }
                }
            }
            create.push(obj)
        }
        this.facilities = { 'create': create }
        this.props.onValueChange('facilities', this.facilities)
    }

    render() {
        const facilities = this.props.data
        const propertyFacility = facilities['create'] ? facilities['create'].slice() : []
        const complimentary = propertyFacility.map(item => item['isComplimentary'])
        const checked = propertyFacility.map(item => item['facility']['connect']['id'])
        return (
            <div>
                <fieldset>
                    <legend>What services do you offer ?</legend>
                    <Query query={FETCH_PROPERTY_FACILITIES} variables = {{ filter: "room" }}>
                        {({ loading, error, data }) => {
                            if (loading) return <div>Fetching...</div>
                            if (error) return <div>Error</div>
                            const allFacilityTypes = data.fetchFacilityTypes
                            return (
                                <section>
                                    {allFacilityTypes.map(facilityType => 
                                        <article key={facilityType.id}>
                                            <fieldset>
                                                <legend>{facilityType.name}</legend>
                                                {facilityType['facilities'].map(facility => 
                                                        <a
                                                         key={facility.id}
                                                            href="#"
                                                            name="facility"
                                                            className={checked.includes(facility.id) ? (complimentary[checked.indexOf(facility.id)] ? "green" : "blue") : "options"}
                                                            onClick={e => this.handleFacilityChange(facility.id, e)}
                                                        >{facility.name}</a>
                                                )}
                                            </fieldset>
                                        </article>
                                    )}
                                </section>
                            )
                        }}
                    </Query>
                </fieldset>
                <button onClick={this.props.prev}>Previous</button>
                <button onClick={this.props.next}>Next</button>
            </div>
        )
    }
}

export default FacilitiesForm
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FETCH_ALL_BEDTYPES = gql`
    query FetchBedTypes {
        fetchBedTypes {
            id
            name
        }
    }
`

class BedComponent extends Component {
    constructor(props) {
        super(props)
        this.removeBedRow = this.removeBedRow.bind(this)
        this.editBedRow = this.editBedRow.bind(this)
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        // Setting default value for bed type
        if (prevProps.bed.type === '') {
            this.props.edit(prevProps.id, 'type', this.defaultType)
        }
    }

    removeBedRow(e) {
        const index = e.target.id
        const name = e.target.name
        this.props.remove(name, index)
    }

    editBedRow(e) {
        const index = e.target.id
        const name = e.target.name 
        const value = e.target.value
        console.log(`${index}, ${name}, ${value}`)
        this.props.edit(index, name, value)
    }

    render() {
        const bed = this.props.bed
        const index = this.props.id
        return (
            <div>
                <label htmlFor="bedType">What kind of bed ?</label>
                <Query query={FETCH_ALL_BEDTYPES}>
                    {({loading, error, data}) => {
                        if (loading) return <div>Fetching...</div>
                        if (error) return <div>Error</div>
                        const bedTypes = data.fetchBedTypes
                        this.defaultType = bedTypes.find(type => type.name === 'single').id
                        return (
                            <select id={index} name="type" value={bed.type} onChange={this.editBedRow}>
                                {bedTypes.map(bedType => 
                                    <option key={bedType.id} value={bedType.id}>{bedType.name}</option>
                                )}
                            </select>
                        )
                    }}
                </Query>
                <label htmlFor="bedCount">How many ?</label>
                <input type="number" id={index} name="quantity" value={bed.quantity} onChange={this.editBedRow}/>
                <button id={index} name='bed' onClick={this.removeBedRow}>-</button>
            </div>
        )
    }
}

export default BedComponent
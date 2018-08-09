import React, {Component} from 'react'

class AddressForm extends Component {
    constructor(props) {
        super(props)
        this.address = {}
        this.handleAddressFieldChange = this.handleAddressFieldChange.bind(this)
    }

    handleAddressFieldChange(e) {
        const key = e.target.name
        const value = e.target.value
        this.address[key] = value
        this.props.onValueChange('address', {'create': this.address})
    }

    render() {
        const address = this.props.data['create'] ? this.props.data['create'] : {} 
        return (
            <div>
                <fieldset>
                    <legend>Where is your property ?</legend>
                    <label htmlFor="street">Street</label>
                    <input id="street" name="street" type="text" value={address.street ? address.street : ''} onChange={this.handleAddressFieldChange}/>
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" type="text" value={address.city ? address.city : ''} onChange={this.handleAddressFieldChange}/>
                    <label htmlFor="region">Region</label>
                    <input id="region" name="region" type="region" value={address.region ? address.region : ''} onChange={this.handleAddressFieldChange}/>
                    <label htmlFor="country">Country</label>
                    <input id="country" name="country" type="text" value={address.country ? address.country : ''} onChange={this.handleAddressFieldChange}/>
                </fieldset>
                <button onClick={this.props.prev}>Previous</button>
                <button onClick={this.props.next}>Next</button>
            </div>
            
        )
    }
}

export default AddressForm
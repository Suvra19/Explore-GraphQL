import React, {Component} from 'react'

class BasicInfoForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const key = e.target.name
        const value = e.target.value
        this.props.onValueChange(key, value)
    }

    render() {
        const {name, about, phone, email} = this.props.data
        return (
            <div>
                <fieldset>
                    <legend>About your property:</legend>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" value={name} onChange={this.handleChange}/>
                    <label htmlFor="about">About</label>
                    <input id="about" name="about" type="textarea" value={about} onChange={this.handleChange}/>
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" type="text" value={phone} onChange={this.handleChange}/>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={email} onChange={this.handleChange}/>
                </fieldset>
                <button onClick={this.props.next}>Next</button>
            </div>
            
        )
    }
}

export default BasicInfoForm
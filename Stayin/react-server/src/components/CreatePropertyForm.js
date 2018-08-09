import React, { Component } from 'react'
// import gql from 'graphql-tag'
// import { setFormDataState } from '../common/utils'
// import { AUTH_TOKEN } from '../constants'
// import { Mutation, Query } from 'react-apollo'
import BasicInfoForm from './BasicInfoForm'
import AddressForm from './AddressForm'
import CategoriesForm from './CategoriesForm'
import FacilitiesForm from './FacilitiesForm'
import PoliciesForm from './PoliciesForm'
import UploadForm from './UploadForm'
import Confirmation from './Confirmation'

class CreatePropertyForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            about: '',
            phone: '',
            email: '',
            address: {},
            logo: '',
            photos: {},
            rooms: {},
            policies: {},
            categories: {},
            facilities: {},
            step: 1
        }
        // this.handleFormDataChange = this.handleFormDataChange.bind(this)
        //this.handleInputChange = this.handleInputChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        // this.handlePolicySelect = this.handlePolicySelect.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.previousStep = this.previousStep.bind(this)
        this.showStep = this.showStep.bind(this)
        // this.saveValues = this.saveValues.bind(this)
    }

    handleValueChange(key, value) {
        this.setState({
            [key]: value
        })
    }

    nextStep() {
        this.setState((prevState) => ({
            step: prevState.step + 1
        }))
    }

    previousStep() {
        this.setState((prevState) => ({
            step: prevState.step - 1
        }))
    }

    showStep() {
        const {name, about, email, phone, address, categories, facilities, policies, logo, photos, rooms} = this.state
        switch (this.state.step) {
            case 1:
                const basicData = {
                    name,
                    about,
                    email,
                    phone,  
                }
                return <BasicInfoForm 
                        data={basicData} 
                        onValueChange={this.handleValueChange}
                        next={this.nextStep}/>
            case 2:
                return <AddressForm 
                        data={address}
                        onValueChange={this.handleValueChange}
                        next={this.nextStep}
                        prev={this.previousStep}/>
            case 3:
                return <CategoriesForm
                        data={categories}
                        onValueChange={this.handleValueChange}
                        next={this.nextStep}
                        prev={this.previousStep}/>
            case 4:
                return <FacilitiesForm 
                        data={facilities}
                        onValueChange={this.handleValueChange}
                        next={this.nextStep}
                        prev={this.previousStep}/>
            case 5:
                return <PoliciesForm 
                        data={policies}
                        onValueChange={this.handleValueChange}
                        next={this.nextStep}
                        prev={this.previousStep}/>
            case 6:
                let uploadData = {
                    logo,
                    photos,
                }
                return <UploadForm
                        data={uploadData}
                        onValueChange={this.handleValueChange}
                        next={this.nextStep}
                        prev={this.previousStep}/>
            case 7:
                let property = {name, about, email, phone, address, categories, facilities, policies, logo, photos, rooms}
                return <Confirmation
                        data={property}
                        onValueChange={this.handleValueChange}
                        prev={this.previousStep}/>
            }
    }

    // saveValues(fieldValues) {
    //     const {newFieldValues} = fieldValues
    //     for (let field in newFieldValues) {
    //         if (this.state.hasOwnPropery(field)) {
    //             this.setState({
    //                 [field]: newFieldValues[field]
    //             })
    //         }
    //     }
    // }

    // handlePolicySelect(event) {
    //     const value = event.target.id
    //     const newPolicies = this.state.policies.slice()
    //     if (newPolicies.includes(value)) {
    //         newPolicies.pop(value)
    //     } else {
    //         newPolicies.push(value)
    //     }
    //     this.setState({
    //         policies: newPolicies
    //     })
    // }

    // handleInputChange(event) {
    //     const target = event.target;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     const name = target.name;
    
    //     this.setState({
    //       [name]: value
    //     });
    //   }

    // handleFormDataChange(event) {
    //     let key = event.target.id
    //     let value = event.target.value
    //     setFormDataState.call(this, key, value)
    // }

    render() {
        return (
            <div>
                {this.showStep()}
            </div>
        )
    }
}

export default CreatePropertyForm
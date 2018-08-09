import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import '../styles/index.css'

const FETCH_ALL_POLICIES = gql`
    {
        fetchPolicies {
            id
            policy
        }
    }
`
class PoliciesForm extends Component {
    constructor(props) {
        super(props)
        this.policies = {
            'connect': []
        }
        this.currentIds = []
        this.handlePolicyChange = this.handlePolicyChange.bind(this)
    }

    // Click-1: Property added
    // Click-2: Property is removed
    handlePolicyChange(value, e) {
        e.preventDefault()
        let connect = this.policies['connect']
        if (this.currentIds.includes(value)) {
            let removeIndex = connect.map(item => item['id']).indexOf(value)
            this.currentIds.splice(removeIndex, 1)
            connect.splice(removeIndex, 1)
        } else {
            this.currentIds.push(value)
            let obj = { 'id': value }
            connect.push(obj)
        }
        this.policies = { 'connect': connect }
        this.props.onValueChange('policies', this.policies)
    }

    render() {
        const policies = this.props.data
        const propertyPolicies = policies['connect'] ? policies['connect'].slice() : []
        const checked = propertyPolicies.map(item => item['id'])
        return (
            <div>
                <fieldset>
                    <legend>Share your property policies</legend>
                    <Query query={FETCH_ALL_POLICIES}>
                        {({ loading, error, data }) => {
                            if (loading) return <div>Fetching...</div>
                            if (error) return <div>Error</div>
                            const policies = data.fetchPolicies
                            return (
                                <section>
                                    {policies.map(policy => 
                                        <a
                                            key={policy.id}
                                            href="#"
                                            name="facility"
                                            className={checked.includes(policy.id) ? "blue" : "options"}
                                            onClick={e => this.handlePolicyChange(policy.id, e)}
                                        >{policy.policy}</a>
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

export default PoliciesForm
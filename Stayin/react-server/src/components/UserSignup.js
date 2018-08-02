import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SIGNUP_MUTATION = gql`
        mutation SignupMutation($name: String, $email: String!, $password: String!) {
            customerSignup(name: $name, email: $email, password: $password) {
                token
                customer {
                    email
                }
            }
        }
    `

class UserSignup extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }
    
    render() {
        const { name, email, password } = this.state
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text"
                        placeholder="Your name"
                    />
                    <input
                        className="mb2"
                        value={email}
                        onChange={e => this.setState({ email: e.target.value })}
                        type="email"
                        placeholder="Your email"
                    />
                    <input
                        className="mb2"
                        value={password}
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        placeholder="Your password"
                    />
                </div>
                <Mutation 
                    mutation={SIGNUP_MUTATION} 
                    variables={{name, email, password}}
                    onCompleted={() => this.props.history.push('/')}>
                    {signupMutation => 
                        <button onClick={signupMutation}>
                            Submit
                        </button>
                    }
                </Mutation>
            </div>
        )
    }
}

export default UserSignup
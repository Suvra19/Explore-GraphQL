import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const FETCH_ALL_CATEGORIES = gql`
    {
        fetchCategories {
            id
            name
        }
    }
`
class CategoriesForm extends Component {
    constructor(props) {
        super(props)
        this.categories = {
            'connect': []
        }
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
    }

    handleCategoryChange(e) {
        const key = e.target.name
        const value = e.target.value
        const checked = e.target.checked
        const obj = { [key]: value }
        const connect = this.categories['connect'].slice()
        if (checked) connect.push(obj)
        else connect.pop(obj)
        const newCategories = {
            'connect': connect
        }
        this.categories = newCategories
        this.props.onValueChange('categories', this.categories)
    }

    render() {
        const categories = this.props.data
        const connect = categories['connect'] ? categories['connect'].slice() : []
        return (
            <div>
                <fieldset>
                    <legend>Choose categories for your property ?</legend>
                    <Query query={FETCH_ALL_CATEGORIES}>
                        {({loading, error, data}) => {
                            if (loading) return <div>Fetching...</div>
                            if (error) return <div>Error</div>
                            const categories = data.fetchCategories
                            return (
                                <div>
                                    {categories.map(category => 
                                        <label key={category.id}>
                                            <input
                                                name="id"
                                                type="checkbox"
                                                checked={connect.some(c => c.id == category.id)}
                                                onChange={this.handleCategoryChange}
                                                value={category.id}
                                            />
                                            {category.name}
                                        </label>
                                    )}
                                </div>
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

export default CategoriesForm
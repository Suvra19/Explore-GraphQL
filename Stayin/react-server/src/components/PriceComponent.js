import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FETCH_ALL_CURRENCEIS = gql`
    query FetchCurrencies {
        fetchCurrencies {
            id
            symbol
        }
    }
`

const FETCH_ALL_PRICETYPES = gql`
    query FetchPriceTypes {
        fetchPriceTypes {
            id
            name
        }
    }
`

class PriceComponent extends Component {
    constructor(props) {
        super(props)
        this.removePriceRow = this.removePriceRow.bind(this)
        this.editPriceRow = this.editPriceRow.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Setting default values for currency and price type
        if (prevProps.price.currency === '') {
            this.props.edit(prevProps.id, 'currency', this.defaultCurrency)
        }
        if (prevProps.price.type === '') {
            this.props.edit(prevProps.id, 'type', this.defaultPriceType)
        }
    }

    removePriceRow(e) {
        const index = e.target.id
        const name = e.target.name
        this.props.remove(name, index)
    }

    editPriceRow(e) {
        const index = e.target.id
        const name = e.target.name 
        const value = e.target.value
        this.props.edit(index, name, value)
    }

    render() {
        const price = this.props.price
        const index = this.props.id
        //console.log(`${JSON.stringify(price)}`)
        return (
            <div>
                <label htmlFor="amount">Amount</label>
                <input type="number" value={price.amount} id={index} name="amount" min="1" onChange={this.editPriceRow}/>
                <label htmlFor="currency">Currency</label>
                <Query query={FETCH_ALL_CURRENCEIS}>
                    {({loading, error, data}) => {
                        if (loading) return <div>Fetching...</div>
                        if (error) return <div>Error</div>
                        const currencies = data.fetchCurrencies
                        this.defaultCurrency = currencies.find(currency => currency.symbol === 'NZD').id
                        return (
                            <select id={index} name="currency" value={price.currency} onChange={this.editPriceRow}>
                                {currencies.map(currency => 
                                    <option key={currency.id} value={currency.id}>{currency.symbol}</option>
                                )}
                            </select>
                        )
                    }}
                </Query>
                <label htmlFor="type">Type</label>
                <Query query={FETCH_ALL_PRICETYPES}>
                    {({loading, error, data}) => {
                        if (loading) return <div>Fetching...</div>
                        if (error) return <div>Error</div>
                        const priceTypes = data.fetchPriceTypes
                        this.defaultPriceType = priceTypes.find(price => price.name === 'regular').id
                        return (
                            <select id={index} name="type" value={price.type} onChange={this.editPriceRow}>
                                {priceTypes.map(priceType => 
                                    <option key={priceType.id} value={priceType.id}>{priceType.name}</option>
                                )}
                            </select>
                        )
                    }}
                </Query>
                <button id={index} name='price' onClick={this.removePriceRow}>-</button>
            </div>
        )
    }
}

export default PriceComponent
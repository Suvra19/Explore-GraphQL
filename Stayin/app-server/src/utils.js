const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

getCustomerId = context => {
    const Authorization = context.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { customerId } = jwt.verify(token, APP_SECRET)
        return customerId
    }
    throw new Error('Not authorized')
}

getQueryDataFromArgs = args => {
    let filtereArgs = {}
    for (let key in args) {
        let val = args[key]
        if ((Object.keys(val).length === 0 && val.constructor === Object) || val === 0 || val === "" || val.length === 0) continue
        filtereArgs[key] = args[key]
    }
    console.log(`Filtere args ${filtereArgs}`)
    return filtereArgs
}

setFormDataState = (obj, key, value) => {
    obj.setState({
        formData: {
            ...obj.state.formData,
            [key]: value
        }
    })
}

module.exports = {
    APP_SECRET,
    getCustomerId,
    getQueryDataFromArgs,
    setFormDataState,
}
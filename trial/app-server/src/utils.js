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

module.exports = {
    APP_SECRET,
    getCustomerId,
}
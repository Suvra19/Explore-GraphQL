findProperties = (parent, args, context, info) => {
    console.log('Here')
    const {name, city, tripType, checkIn, checkOut, adults, kids, infants, first, skip} = args
    let filter = {
        AND: []
    }
    if (name) {
        let obj = {
            name_contains: name
        }
        filter.AND.push(obj)
    }
    if (city) {
        let obj = {
            address: {
                city_contains: city
            }
        }
        filter.AND.push(obj)
    }

    if (filter.AND.length === 0) {
        filter = {
            name_not: ""
        }
    }

    return context.prisma.query.properties({
        where: filter
    }, info)
}

findCustomer = (parent, args, context, info) => {
    return context.prisma.query.customers({
        where: {
            email: args.email
        }
    }, info)
}

fetchOneProperty = (parent, args, context, info) => {
    let where = {
        'id': args.id
    }

    return context.prisma.query.property({
        where: where
    }, info)
}



fetchPolicies = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.policy) {
        where['policy'] = args.policy
    } else {
        where['policy_not'] = "" 
    }

    return context.prisma.query.policies({
        where: where
    }, info)
}

fetchCategories = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.policy) {
        where['name'] = args.name
    } else {
        where['name_not'] = "" 
    }

    return context.prisma.query.categories({
        where: where
    }, info)
}

fetchFacilities = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.name) {
        where['name'] = args.name
    } else if (args.type) {
        where['type'] = {
            'name': args.type
        }
    } else {
        where['name_not'] = "" 
    }

    return context.prisma.query.facilities({
        where: where
    }, info)
}

fetchFacilityTypes = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.name) {
        where['name'] = args.name
    } else {
        where['name_not'] = "" 
    }

    return context.prisma.query.facilityTypes({
        where: where
    }, info)
}

fetchPriceTypes = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.name) {
        where['name'] = args.name
    } else {
        where['name_not'] = "" 
    }

    return context.prisma.query.priceTypes({
        where: where
    }, info)
}

fetchBedTypes = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.name) {
        where['name'] = args.name
    } else {
        where['name_not'] = "" 
    }

    return context.prisma.query.bedTypes({
        where: where
    }, info)
}

fetchCurrencies = (parent, args, context, info) => {
    let where = {}
    if (args.id) {
        where['id'] = args.id
    } else if (args.symbol) {
        where['symbol'] = args.symbol
    } else {
        where['symbol_not'] = ""
    }

    return context.prisma.query.currencies({
        where: where
    }, info)
}

module.exports = {
    findProperties,
    findCustomer,
    fetchPolicies,
    fetchCategories,
    fetchFacilities,
    fetchFacilityTypes,
    fetchOneProperty,
    fetchPriceTypes,
    fetchBedTypes,
    fetchCurrencies,
}
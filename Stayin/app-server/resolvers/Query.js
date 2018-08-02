findHotels = (parent, args, context, info) => {
    return context.prisma.query.hotels({
        where: {
            OR: [
                {
                    name_contains: args.filter
                }, 
                {
                    about_contains: args.filter
                }
            ]
        }
    }, info)
}

findProperties = (parent, args, context, info) => {
    console.log("Reached here...")
    const {filter, first, skip} = args
    return context.prisma.query.properties({
        where: {
            OR: [
                {
                    address: {
                        city: filter
                    }
                }
            ]
        }
    }, info)
}

findCustomer = (parent, args, context, info) => {
    return context.prisma.query.customers({
        where: {
            email: args.email
        }
    }, info)
}

module.exports = {
    findHotels,
    findProperties,
    findCustomer,
}
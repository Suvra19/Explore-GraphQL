customer = (parent, args, context, info) => {
    return context.prisma.query.customer({
        where: {
            id: parent.customer.id
        }
    }, info)
}

module.exports = {
    customer,
}
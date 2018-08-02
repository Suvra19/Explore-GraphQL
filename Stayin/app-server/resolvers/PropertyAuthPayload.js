property = (parent, args, context, info) => {
    return context.prisma.query.property({
        where: {
            id: parent.property.id
        }
    }, info)
}

module.exports = {
    property,
}
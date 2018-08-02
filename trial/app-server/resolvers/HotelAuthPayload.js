hotel = (parent, args, context, info) => {
    console.log(`***Info*** ${info}`)
    return context.prisma.query.hotel({
        where: {
            id: parent.hotel.id
        }
    }, info)
}


module.exports = {
    hotel,
}
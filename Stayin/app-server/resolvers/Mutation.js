const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getCustomerId, getQueryDataFromArgs } = require('../src/utils')
const { AuthenticationError } = require('apollo-server-core')


customerSignup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10)
    const customer = await context.prisma.mutation.createCustomer({
        data: {
            ...args,
            password,
        }
    }, `{ id }`)
    const token = jwt.sign({ customerId: customer.id }, APP_SECRET)
    return {
        token,
        customer,
    }
}

customerLogin = async (parent, args, context, info) => {
    const customer = await context.prisma.query.customer({
        where: {
            email: args.email
        }
    }, `{ id password }`)
    
    if (!customer) {
        throw new Error('No such customer exists') 
    }
    const valid = await bcrypt.compare(args.password, customer.password)
    
    if (!valid) {
        throw new Error('Invalid password')
    }
    const token = jwt.sign({ customerId: customer.id }, APP_SECRET)
    return {
        token,
        customer,
    }
}

updateCustomerInfo = (parent, args, context, info) => {
    const customer = getCustomerId(context)
    let data = {
        ...args,
    }
    if (args.address) {
        data['address'] = {
            upsert: {
                update: args.address,
                create: args.address,
            },
        }
    }

    return context.prisma.mutation.updateCustomer({
        data: data,
        where: {
            id: customer
        }
    }, info)
}

//cjkdbg5h8000l0815keedt25l
createProperty = (parent, args, context, info) => {
    const owner = getCustomerId(context)
    let data = getQueryDataFromArgs(args)
    data['owner'] = {
        connect: {
            id: owner
        } 
    }
    if (!data.hasOwnProperty('name') || !data.hasOwnProperty('address')) {
        return new Error(`Required field(s) missing in ${JSON.stringify(data)}`)
    }
   return context.prisma.mutation.createProperty({
        data: data
    }, info)
}

createRoom = (parent, args, context, info) => {
    //Authenticate ownership
    console.log(`Before ${JSON.stringify(args)}`)
    const filteredData = getQueryDataFromArgs(args)
    console.log(`After ${JSON.stringify(filteredData)}`)
    if (!filteredData.hasOwnProperty('property') || !filteredData.hasOwnProperty('prices') || !filteredData.hasOwnProperty('beds')) {
        return new Error('Required field(s) missing')
    }
    let propertyData = {
        connect: {
            id: filteredData.property
        }
    }
    let priceData = {
        create: []
    }
    let bedData = {
        create: []
    }
    let facilityData = {
        connect: []
    }
    const prices = filteredData.prices.slice()
    prices.forEach(price => {
        if (price.amount !== '') {
            let { amount, currency, type } = price
            let priceEntry = {
                amount: amount,
                currency: {
                    connect: {
                        id: currency
                    }
                },
                type: {
                    connect: {
                        id: type
                    }
                }
            }
            priceData.create.push(priceEntry)
        }
        
    })
    const beds = filteredData.beds.slice()
    beds.forEach(bed => {
        if (bed.quantity !== 0) {
            const quantity = bed.quantity
            const type = {
            connect: {
                id: bed.type
            }
        }
        bedData.create.push({
            quantity,
            type
        })    
    }
    })
    const facilities = filteredData.facilities ? filteredData.facilities.slice() : []
    facilities.forEach(facility => {
        if (facility !== '') {
            facilityData.connect.push({
                id: facility
            })
        }
      
    })
    const roomData = {
        ...filteredData,
        property: propertyData,
        prices: priceData,
        beds: bedData,
        facilities: facilityData
    }
    console.log(`${JSON.stringify(roomData)}`)
    return context.prisma.mutation.createRoom({
        data: roomData
    }, info)
}

// updateBasicHotelInfo = async (parent, args, context, info) => {
//     const owner = getCustomerId(context)
//     const customerOwnsHotel = context.prisma.exists.Hotel({
//         id: args.id,
//         owner: {
//             id: owner
//         }
//     })
//     if (!await customerOwnsHotel) {
//         throw new Error(`Customer does not own this hotel`)
//     }
//     const {id, ...data} = args
//     return context.prisma.mutation.updateHotel({
//         data: data,
//         where: {
//             id: args.id
//         }
//     }, info)
// }

// createPropertyForHotel = async (parent, args, context, info) => {
//     const hotelOwner = getCustomerId(context)
//     const hotelAndPropertyExists = context.prisma.exists.Property({
//         name: args.name,
//     })
//     const customerOwnsHotel = context.prisma.exists.Hotel({
//         id: args.hotel,
//         owner: {
//             id: hotelOwner
//         }
//     })

//     if (await hotelAndPropertyExists) {
//         if (!await customerOwnsHotel) {
//             throw new Error(`Customer does not own this hotel`)
//         } else {
//             throw new Error(`Property with name ${args.name} already exists for this hotel`)
//         }
//     }
//     const property = await context.prisma.mutation.createProperty({
//         data: {
//             name: args.name,
//             about: args.about,
//             phone: args.phone,
//             email: args.email,
//             address: {
//                 create: args.address
//             },
//             hotel: {
//                 connect: {
//                     id: args.hotel
//                 }
//             },
//         }
//     }, `{ id }`)

//     return {
//         property
//     }
// }

// createRoomForProperty = async (parent, args, context, info) => {
//     const hotelOwner = getCustomerId(context)
//     const hotelAndPropertyExists = context.prisma.exists.Property({
//         id: args.property,
//         hotel: {
//             id: args.hotel
//         },
//     })
//     const customerOwnsHotel = context.prisma.exists.Hotel({
//         id: args.hotel,
//         owner: {
//             id: hotelOwner
//         }
//     })
//     if (!await hotelAndPropertyExists) {
//         throw new Error(`Property with name ${args.name} does not exist for this hotel`)
//     }
//     if (!await customerOwnsHotel) {
//         throw new Error(`Customer does not own this hotel`)
//     }
    
//     let input = {
//         ...args
//     }
//     input['property'] = {
//         connect: {
//             id: args.property
//         }
//     }
//     input['beds'] = {
//         set: args.beds
//     }
//     let {hotel, ...data} = input
//     return context.prisma.mutation.createRoom({
//         data: data
//     }, info)
// }

module.exports = {
    customerSignup,
    customerLogin,
    createProperty,
    updateCustomerInfo,
    createRoom,
}
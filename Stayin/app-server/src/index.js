const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('../resolvers/Query')
const Mutation = require('../resolvers/Mutation')
//const Subscription = require('../resolvers/Subscription')
const CustomerAuthPayload = require('../resolvers/CustomerAuthPayload')
const HotelAuthPayload = require('../resolvers/HotelAuthPayload')
const PropertyAuthPayload = require('../resolvers/PropertyAuthPayload')

const resolvers = {
    Query,
    Mutation,
    CustomerAuthPayload,
    HotelAuthPayload,
    PropertyAuthPayload,
   // Subscription,
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        prisma: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'http://192.168.99.100:4466',
            debug: true,
        }),
    }),
})

server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))
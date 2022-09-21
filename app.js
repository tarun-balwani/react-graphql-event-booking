const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLList } = require("graphql");
// it will take incoming requests, funnel them through graphql query parser and map them to resolvers
const { buildSchema } = require("graphql");
// we can write objects in plain text and then the above package will convert it to javascript objects
const app = express();
app.use(bodyParser.json());

const events = [];
// app.get('/', (req,res,next) => {
//     res.send("Hello World!");
// })

// the graphqlHttp method contains an object having some keys :-
// schema key is used to get the schema for the GraphQL
// rootValue : it contains the resolvers which will actually have the business logic
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }`),
    //Inside the buildSchema method, two keywords schema and type are mandatory to use for graphql, type basically tells us the type of request
    // and it maps the request to resolvers. In Schema you can map the types to the type of query they are actually.

    //Rootvalue are the resolvers and contains all the logical stuff
    // Resolvers should contain resolver names exactly same as that of the query/mutation, for ex events in rootQuery
    rootValue: {
        events : () => {
            return events;
        },

        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date,
            };
            events.push(event);
            return event;
        }
        
    },
    graphiql: true,
    //graphiql = true to get UI to test API
  })
);

app.listen(3000,()=>{
    console.log("server started at port 3000")});

//Test commit and PR

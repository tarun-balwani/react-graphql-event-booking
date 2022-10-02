const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
// it will take incoming requests, funnel them through graphql query parser and map them to resolvers
const { buildSchema } = require("graphql");
// we can write objects in plain text and then the above package will convert it to javascript objects
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();


app.use(bodyParser.json());


//This portion of code allows the user to perform cross origin operations
// it basically add the headers to the incoming request
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type,Authorization");
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);
// const events = [];
// app.get('/', (req,res,next) => {
//     res.send("Hello World!");
// })

// the graphqlHttp method contains an object having some keys :-
// schema key is used to get the schema for the GraphQL
// rootValue : it contains the resolvers which will actually have the business logic
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    //Inside the buildSchema method, two keywords schema and type are mandatory to use for graphql, type basically tells us the type of request
    // and it maps the request to resolvers. In Schema you can map the types to the type of query they are actually.

    //Rootvalue are the resolvers and contains all the logical stuff
    // Resolvers should contain resolver names exactly same as that of the query/mutation, for ex events in rootQuery
    rootValue: graphQlResolvers,
    graphiql: true,
    //graphiql = true to get UI to test API
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-app.odlamac.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000, () => {
      console.log("server started at port 8000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//Test commit and PR

const { ApolloServer, gql } = require('apollo-server-lambda')
const shortid = require('shortid')
const faunadb = require('faunadb')
  q = faunadb.query
require('dotenv').config()
const typeDefs = gql`
  type Query {
   person:[record]
   person_link:linked
  }

  type Mutation {
    addperson(
      name:String
      title:String
    ):record
  }
  type record {
    id:  ID!
    name: String!
    title:String!
    Link:String!
  } 
  type linked{
    name: String!
    title:String!
    Link:String!
  }`

const resolvers = {
 Query: {
 /*  person:async(root,args,context)=>{
      try{
var adminClient=new faunadb.Client({secret:'process.env.netlify_key})
const result= await adminClient.query(
q.Map(
  q.Paginate(
    q.Match(
      q.Index('links'))),
  q.Lambda(x=>q.Get(x)))
  )

   result.data.map(d=>{
    return {
      title:d.data.title,
      name:d.data.name,
      id:d.ts,
      Link:d.data.Link

  }})
}
    
catch(err){
  console.log(err)

}
   }
*/
person_link:async(root,args,context)=>{
  if (process.env.netlify_key) {
    var adminClient=new faunadb.Client({secret:process.env.netlify_key})
  try {
const result= await adminClient.query(
  q.Get(
q.Match(
  q.Index('newlink') ) )
)
  return {
 title: result.data.title,
 name:result.data.name,
 Link:result.data.Link
}
  }
catch(err){
console.log(err)

}
  
  } 
  else {
    console.log('No FAUNADB_SERVER_SECRET in .env file, skipping Container Creation');
  } 
  
}
 
},

Mutation: {
  addperson: async (_,{name,title})=>{
    if (process.env.netlify_key) {
    var adminClient=new faunadb.Client({secret:process.env.netlify_key})
    try{
const result= await adminClient.query(
  q.Create(
    q.Collection('link'),
    {
     data:{
       name,
       title,
      Link: shortid.generate()
     }  
    },
  )
)
return result.data.data 
    }
    catch(error){
      console.log(error)
    }
  }
  else {
    console.log('No FAUNADB_SERVER_SECRET in .env file in mutation, skipping Container Creation');
  }
  }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()
module.exports = { handler }


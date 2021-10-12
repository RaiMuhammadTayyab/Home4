import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'curl/.netlify/functions/record4',
    fetch,          
  }),
  cache: new InMemoryCache()
});

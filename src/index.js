// load preact components
import { h, render, Component } from 'preact';

// load our shopping list factories
import { ShoppingListFactory, ShoppingListRepositoryPouchDB } from 'ibm-shopping-list-model';

// load PouchDB libraries
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import './App.css';

// add the pouchdb-find plugin for free-text search
PouchDB.plugin(PouchDBFind);

// create local PouchDB database (if it doesn't already exist)
const localDB = new PouchDB('shopping_list_react');

// start up the factories
const shoppingListFactory = new ShoppingListFactory();
const shoppingListRepository = new ShoppingListRepositoryPouchDB(localDB);

// load our App class
import App from './App';

// create database indexes
shoppingListRepository.ensureIndexes().then(() => {

  // tehn render our app
  render(<App
    shoppingListFactory={shoppingListFactory}
    shoppingListRepository={shoppingListRepository}
    localDB={localDB}
  />, document.body);
}).catch(err => {
  console.log('ERROR in ensureIndexes');
  console.log(err);
});

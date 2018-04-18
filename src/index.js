import { h, render, Component } from 'preact';
import { ShoppingListFactory, ShoppingListRepositoryPouchDB } from 'ibm-shopping-list-model';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import './App.css';

PouchDB.plugin(PouchDBFind);
const localDB = new PouchDB('shopping_list_react');
const shoppingListFactory = new ShoppingListFactory();
const shoppingListRepository = new ShoppingListRepositoryPouchDB(localDB);

import App from './App';

shoppingListRepository.ensureIndexes().then(() => {
  render(<App
    shoppingListFactory={shoppingListFactory}
    shoppingListRepository={shoppingListRepository}
    localDB={localDB}
  />, document.body);
}).catch(err => {
  console.log('ERROR in ensureIndexes');
  console.log(err);
});

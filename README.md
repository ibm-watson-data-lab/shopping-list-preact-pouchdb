# Shopping List - with Preact and PouchDB

Shopping List is an Offline First demo Progressive Web App built using [Preact](https://preactjs.com), [preact-cli](https://github.com/developit/preact-cli) and [PouchDB](https://pouchdb.com). This app is part of [a series of Offline First demo apps, each built using a different stack](https://github.com/ibm-watson-data-lab/shopping-list).

## Quick Start

To see this app in action without installing anything, check out the [live demo instructions](#live-demo).

Here's how to get started on custom development:

1. `git clone https://github.com/ibm-watson-data-lab/shopping-list-preact-pouchdb.git`
2. `npm i -g preact-cli`
3. `npm install`
4. `npm start`

And here's how to build for production

1. `npm run build`
2. `sed -i '' 's/sw\.js/\.\/sw\.js/g' docs/bundle.*.js`

> NOTE 1: Step #1 actually runs this: `preact build --no-prerender --template=./index.html --dest=./docs --clean`

> NOTE 2: `--dest=./docs` is nice if you're going to deploy to GitHub Pages from your `docs` directory.

> NOTE 3: Step #2 is needed only if you're deploying to a non-root URL, e.g. https://www.example.com/my-pwa instead of https://my-pwa.example.com/)

## Features

Shopping List is a simple demo app, with a limited feature set. Here is a list of features written as user stories grouped by Epic:

### Planning
  * As a \<person planning to shop for groceries\>, I want to **\<create a shopping list\>** so that \<I can add items to this shopping list\>.
  * As a \<person planning to shop for groceries\>, I want to **\<add an item to my shopping list\>** so that \<I can remember to buy that item when I am at the grocery store later\>.
  * As a \<person planning to shop for groceries\>, I want to **\<remove an item from my shopping list\>** so that \<I can change my mind on what to buy when I am at the grocery store later\>.

### Shopping
  * As a \<person shopping for groceries\>, I want to **\<view items on my shopping list\>** so that \<I can remember what items to buy\>.
  * As a \<person shopping for groceries\>, I want to \<add an item to my shopping list\> so that \<I can remember to buy that item\>.
  * As a \<person shopping for groceries\>, I want to **\<remove an item from my shopping list\>** so that \<I can change my mind on what to buy\>.
  * As a \<person shopping for groceries\>, I want to **\<check off an item on my shopping list\>** so that \<I can keep track of what items I have bought\>.

### Offline First
  * As a \<person shopping for groceries\>, I want to **\<have the app installed on my device\>** so that \<I can continue to utilize my shopping list when no internet connection is available\>.
  * As a \<person shopping for groceries\>, I want to **\<have my shopping list stored locally on my device\>** so that \<I can continue to utilize my shopping list when no internet connection is available\>.
  * As a \<person shopping for groceries\>, I want to **\<sync my shopping list with the cloud\>** so that \<I can manage and utilize my shopping list on multiple devices\>.

### Multi-User / Multi-Device (planned feature)
  * As a \<new user\>, I want to **\<sign up for the app\>** so that \<I can use the app\>.
  * As an \<existing user\>, I want to **\<sign in to the app\>** so that \<I can use the app\>.
  * As an \<existing user\>, I want to **\<sign out of the app\>** so that \<I can protect my privacy\>.

### Geolocation (planned feature)
  * As a \<person planning to shop for groceries\>, I want to **\<associate a shopping list with a grocery store\>** so that \<I can be notified of this shopping list when I am physically at that grocery store\>.
  * As a \<person associating a shopping list with a physical store\>, I want to **\<access previously-used locations\>** so that \<I can quickly find the physical store for which I am searching\>.
  * As a \<person shopping for groceries\>, I want to **\<be notified of a shopping list when I am physically at the grocery store associated with that shopping list\>** so that \<I can quickly find the shopping list for my current context\>.

## App Architecture

\<Information detailing the app architecture; for using this app as a reference implementation\>

## Live Demo

You can try this demo on a mobile phone by visiting [https://ibm-watson-data-lab.github.io/shopping-list-preact-pouchdb/](https://ibm-watson-data-lab.github.io/shopping-list-preact-pouchdb/). It will open in a web browser. Choose "Add to home screen" and the app will installed on your phone as if it were a downloadable native app. It will appear on your home screen with an icon and the lists and items you create will be stored on your phone.

## Tutorial

### Table of Contents

* Prerequisite Knowledge & Skills
* Key Concepts
* Initial Set Up
* Creating the [Vanilla JS | Polymer | React | Preact | Vue.js | Ember.js | React Native | Ionic | Cordova | Swift | Kotlin | Electron] App
* Adding a [PouchDB | Cloudant Sync] Database
* Syncing Data
  * Configure a Database
     * Option 1: Apache CouchDB
     * Option 2: IBM Cloudant
     * Option 3: Cloudant Developer Edition
  * Configure Remote Database Credentials
  * Trigger Database Replication
* Adding Multi-User / Multi-Device Features with Hoodie (future)
  * Installing Hoodie
  * Configuring Hoodie
  * Using the Hoodie Store API
  * Using Hoodie Account API
  * Testing Offline Sync
* Adding Gelocation Features (future)
* What's next?
  * Other Features
  * Get Involved in the Offline First Community!
  * Further Reading and Resources


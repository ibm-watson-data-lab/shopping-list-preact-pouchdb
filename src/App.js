// load the 'h' function that powers the Preact JSX Hyperscript function
import { h, Component } from 'preact';

// we use the List types to store shopping lists and their items
import { List } from 'immutable';
import ShoppingList from './components/ShoppingList';
import ShoppingLists from './components/ShoppingLists';

// PouchDB is our in-browser database that can store state whether we are on-line or not
import PouchDB from 'pouchdb';

// constants
const NOLISTMSG = 'Click the + sign above to create a shopping list.';
const NOITEMSMSG = 'Click the + sign above to create a shopping list item.';
const localConfig = '_local/user';

// main App preact component
class App extends Component {

  // sets the app's state depending on what it finds in the shopping list database
  getShoppingLists = () => {
    let checkedCount = new List();
    let totalCount = new List();
    let lists = null;

    // load list of shopping lists
    this.props.shoppingListRepository.find().then(foundLists => {
      lists = foundLists;
      return foundLists;
    }).then(foundLists => this.props.shoppingListRepository.findItemsCountByList()).then(countsList => {
      totalCount = countsList;

      // calculate number of items by list
      return this.props.shoppingListRepository.findItemsCountByList({
        selector: {
          type: 'item',
          checked: true
        },
        fields: ['list']
      });
    }).then(checkedList => {
      checkedCount = checkedList;

      // update the Preact app's state
      this.setState({
        view: 'lists',
        shoppingLists: lists,
        shoppingList: null,
        shoppingListItems: null,
        checkedTotalShoppingListItemCount: checkedCount,
        totalShoppingListItemCount: totalCount,
      });
    }).catch(err => {
    });
  }

  // load the shopping list items from the database
  getShoppingListItems = (listid) => this.props.shoppingListRepository.findItems({
    selector: {
      type: 'item',
      list: listid
    }
  })

  // re-load the shopping list items
  refreshShoppingListItems = (listid) => {
    this.props.shoppingListRepository.findItems({
      selector: {
        type: 'item',
        list: listid
      }
    }).then(items => {
      this.setState({
        view: 'items',
        shoppingListItems: items
      });
    });
  }

  // load a single shopping list by its id
  openShoppingList = (listid) => {
    this.props.shoppingListRepository.get(listid).then(list => list).then(list => {
      this.getShoppingListItems(listid).then(items => {
        this.setState({
          view: 'items',
          shoppingList: list,
          shoppingListItems: items
        });
      });
    });
  }

  // load a shopping list item, update its name and write it back to the database
  renameShoppingListItem = (itemid, newname) => {
    this.props.shoppingListRepository.getItem(itemid).then(item => {
      item = item.set('title', newname);
      return this.props.shoppingListRepository.putItem(item);
    }).then(this.refreshShoppingListItems(this.state.shoppingList._id));
  }

  // delete a shopping list item i.e. load it and write it back as a deletion
  deleteShoppingListItem = (itemid) => {
    this.props.shoppingListRepository.getItem(itemid).then(item => this.props.shoppingListRepository.deleteItem(item)).then(this.refreshShoppingListItems(this.state.shoppingList._id));
  }

  // mark a shopping list item as "checked" (done)
  toggleItemCheck = (itemid) => {
    this.props.shoppingListRepository.getItem(itemid).then(item => {
      item = item.set('checked', !item.checked);
      return this.props.shoppingListRepository.putItem(item);
    }).then(this.refreshShoppingListItems(this.state.shoppingList._id));
  }

  // mark all of a shopping list items as checked
  checkAllListItems = (listid) => {
    let listcheck = true;

    // load the items
    this.getShoppingListItems(listid).then(items => {
      let newitems = [];
      items.forEach(item => {
        if (!item.checked) {
          newitems.push(item.mergeDeep({ checked: true }));
        }
      }, this);
      // if all items were already checked let's uncheck them all
      if (newitems.length === 0) {
        listcheck = false;
        items.forEach(item => {
          newitems.push(item.mergeDeep({ checked: false }));
        }, this);
      }

      // write back in a single bulk request
      let listOfShoppingListItems = this.props.shoppingListFactory.newListOfShoppingListItems(newitems);
      return this.props.shoppingListRepository.putItemsBulk(listOfShoppingListItems);
    }).then(newitemsresponse => this.props.shoppingListRepository.get(listid)).then(shoppingList => {
      
      // update the shopping list object itself
      shoppingList = shoppingList.set('checked', listcheck);
      return this.props.shoppingListRepository.put(shoppingList);
    }).then(shoppingList => {
      // reload the shopping lists
      this.getShoppingLists();
    });
  }

  // delete a shopping list
  deleteShoppingList = (listid) => {
    this.props.shoppingListRepository.get(listid).then(shoppingList => {
      shoppingList = shoppingList.set('_deleted', true);
      return this.props.shoppingListRepository.put(shoppingList);
    }).then(result => {
      this.getShoppingLists();
    });
  }

  // rename a shopping list
  renameShoppingList = (listid, newname) => {
    this.props.shoppingListRepository.get(listid).then(shoppingList => {
      shoppingList = shoppingList.set('title', newname);
      return this.props.shoppingListRepository.put(shoppingList);
    }).then(this.getShoppingLists);
  }

  // creates a new shopping list or a new shopping list item, depending
  // on the state of the app
  createNewShoppingListOrItem = (e) => {
    e.preventDefault();
    this.setState({ adding: false });

    // new shopping list
    if (this.state.view === 'lists') {
      let shoppingList = this.props.shoppingListFactory.newShoppingList({
        title: this.state.newName
      });
      this.props.shoppingListRepository.put(shoppingList).then(this.getShoppingLists);

    }
    // new shopping list item
    else if (this.state.view === 'items') {
      let item = this.props.shoppingListFactory.newShoppingListItem({
        title: this.state.newName
      }, this.state.shoppingList);
      this.props.shoppingListRepository.putItem(item).then(item => {
        this.getShoppingListItems(this.state.shoppingList._id).then(items => {
          this.setState({
            view: 'items',
            shoppingListItems: items
          });
        });
      });
    }
  }
  
  // handles UI event when a name is changed
  updateName = (e) => {
    this.setState({ newName: e.target.value });
  }

  // handles UI event where user clicks the + button
  displayAddingUI = () => {
    this.setState({ adding: true });
  }

  // sets the app into "lists" mode
  displayLists = () => {
    this.setState({ view: 'lists' });
  }

  // sets the app into "about" mode
  displayAbout = () => {
    this.setState({ view: 'about' });
  }

  // sets the app into "settings" mode
  displaySettings = () => {
    this.setState({ view: 'settings' });
  }

  // utility function to save a local PouchDB document
  saveLocalDoc = (doc) => {
    const db = this.props.localDB;
    return db.get(doc._id).then((data) => {
      doc._rev = data._rev;
      return db.put(doc);
    }).catch((e) => {
      return db.put(doc);
    });
  }

  // handles UI event when the sync URL is changed
  updateURL = (e) => {
    this.setState({ url: e.target.value });
    var obj = {
      '_id': localConfig,
      'syncURL': e.target.value
    };
    this.saveLocalDoc(obj).then(console.log);
  }

  // starts a sync operation between the local PouchDB database and the remote
  // Cloudant/CouchDB/PouchDB databases
  startSync = (e) => {
    // if we have a sync URL
    if (this.state.url) {
      // initialise PouchDB
      this.state.remoteDB = new PouchDB(this.state.url)

      // start a live, continuous sync between our local DB and the remote DB
      this.props.localDB.sync(this.state.remoteDB, { live: true, retry: true })
        .on('change', change => {
          // console.log("something changed!");
        })
        .on('error', err => { });
    }
  }

  // application constructor
  constructor(props) {
    super(props);

    // initialise state
    this.state = {
      shoppingList: null,
      shoppingLists: [],
      totalShoppingListItemCount: new List(), //Immutable.js List with list ids as keys
      checkedTotalShoppingListItemCount: new List(), //Immutable.js List with list ids as keys
      shoppingListItems: null,
      adding: false,
      view: 'lists',
      newName: ''
    };
  }

  // called when the application is loaded and ready to run
  componentDidMount = () => {

    // load the shopping lists
    this.getShoppingLists();

    // load the local config - start sync if we have previously saved 
    // a remote DB's URL
    this.props.localDB.get(localConfig).then((doc) => {
      console.log('local doc', doc)
      this.setState({url: doc.syncURL || ''})
      this.startSync()
    })
  }

  // JSX - markup for the about panel
  renderAbout = () => (
    <div class="card" style="padding:30px">
      <div class="card-body">
        <div class="card-title">About this app</div>
        <p class="card-text">
          <a href="https://github.com/ibm-watson-data-lab/shopping-list">Shopping List is a series of Offline First demo apps, each built using a different stack</a>. These demo apps cover Progressive Web Apps, hybrid mobile apps, native mobile apps, and desktop apps.
          This particular demo app is a <strong>Progressive Web App</strong> built using <strong>Preact and PouchDB</strong>.
        </p>
        <a class="card-link" href="https://github.com/ibm-watson-data-lab/shopping-list-preact-pouchdb">Get the source code</a>.
      </div>
    </div>
  )

  // JSX - markup for the settings panel
  renderSettings = () => (
    <div class="card" style="padding:30px">
      <div class="card-body">
        <div class="card-title">Setings</div>
        <p class="card-text">
          You can sync your shopping lists to a remote Apache CouchDB, IBM Cloudant or PouchDB server. Supply the URL, including
          credentials and database name and hit "Start Sync".
        </p>
        <div class="input-group">
          <input type="url" value={this.state.url} onChange={this.updateURL} class="form-control" placeholder="e.g http://localhost:5984/list"></input>
        </div>
        <button class="btn btn-lg" onClick={this.startSync}>Start Sync</button>
      </div>
    </div>
  )

  // JSX - markup for the new shopping list/item panel
  renderNewNameUI = () => (
    <form onSubmit={this.createNewShoppingListOrItem} style={{ marginTop: '12px' }}>
      <div class="input-field">
        <input className="validate" type="text"
          placeholder="Name..." id="input-name"
          onChange={this.updateName}
          fullWidth={false}
          style={{ padding: '0px 12px', width: 'calc(100% - 24px)' }}
          underlineStyle={{ width: 'calc(100% - 24px)' }}
        />
        {/* <label for="input-name">Name</label> */}
      </div>
    </form>
  )

  // render the shopping list component
  renderShoppingLists = () => {
    if (this.state.shoppingLists.length < 1)
      return (<h5>{NOLISTMSG}</h5>);
    return (
      <ShoppingLists
        shoppingLists={this.state.shoppingLists}
        openListFunc={this.openShoppingList}
        deleteListFunc={this.deleteShoppingList}
        renameListFunc={this.renameShoppingList}
        checkAllFunc={this.checkAllListItems}
        totalCounts={this.state.totalShoppingListItemCount}
        checkedCounts={this.state.checkedTotalShoppingListItemCount}
      />
    );
  }

  // render the shopping list item component
  renderShoppingListItems = () => {
    if (this.state.shoppingListItems.size < 1)
      return (<h5>{NOITEMSMSG}</h5>);
    return (
      <ShoppingList
        shoppingListItems={this.state.shoppingListItems}
        deleteFunc={this.deleteShoppingListItem}
        toggleItemCheckFunc={this.toggleItemCheck}
        renameItemFunc={this.renameShoppingListItem}
      />
    );
  }

  // JSX - back button
  renderBackButton = () => {
    if (this.state.view === 'items')
      return (
        <a className="btn-flat btn-large white-text backbutton" onClick={this.getShoppingLists} style={{ padding: '0px', 'vertical-align': 'top' }}>
          <i className="material-icons">keyboard_backspace</i>
        </a>);
    return <span />;
  }

  // JSX - main app markup
  render() {
    let screenname = 'Shopping Lists';
    if (this.state.view === 'items') screenname = this.state.shoppingList.title;
    return (
      <div className="App">
        <nav>
          <div className="nav-wrapper">
            <div className="brand-logo left">
              {this.renderBackButton()}
              <span onClick={this.displayLists}>{screenname}</span>
            </div>
            <div className="right">
              <a className="btn pink lighten-2" style={{ 'margin-right': '8px' }}
                onClick={this.displaySettings}
              >
                Settings
              </a>
              <a className="btn pink lighten-2" style={{ 'margin-right': '8px' }}
                onClick={this.displayAbout}
              >
                About
              </a>
              <a className="btn-floating pink lighten-2" style={{ 'margin-right': '8px' }}
                onClick={this.displayAddingUI}
              >
                <i className="material-icons" style={{ 'line-height': 'unset' }}>add</i>
              </a>
            </div>
          </div>
        </nav>
        <div className="listsanditems container" style={{ margin: '8px', backgroundColor: 'white' }}>
          {this.state.adding ? this.renderNewNameUI() : <span />}
          {this.state.view === 'items' ? this.renderShoppingListItems() : ''}
          {this.state.view === 'lists' ? this.renderShoppingLists() : ''}
        </div>
        <div>
          {this.state.view === 'about' ? this.renderAbout() : ''}
          {this.state.view === 'settings' ? this.renderSettings() : ''}
        </div>
      </div>
    );
  }
}

export default App;
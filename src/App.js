import { h, Component } from 'preact';
import { List } from 'immutable';
import ShoppingList from './components/ShoppingList';
import ShoppingLists from './components/ShoppingLists';

const NOLISTMSG = 'Click the + sign above to create a shopping list.';
const NOITEMSMSG = 'Click the + sign above to create a shopping list item.';

class App extends Component {


  getShoppingLists = () => {
    let checkedCount = new List();
    let totalCount = new List();
    let lists = null;
    this.props.shoppingListRepository.find().then(foundLists => {
      lists = foundLists;
      return foundLists;
    }).then(foundLists => this.props.shoppingListRepository.findItemsCountByList()).then(countsList => {
      totalCount = countsList;
      return this.props.shoppingListRepository.findItemsCountByList({
        selector: {
          type: 'item',
          checked: true
        },
        fields: ['list']
      });
    }).then(checkedList => {
      checkedCount = checkedList;
      this.setState({
        view: 'lists',
        shoppingLists: lists,
        shoppingList: null,
        shoppingListItems: null,
        checkedTotalShoppingListItemCount: checkedCount,
        totalShoppingListItemCount: totalCount
      });
    }).catch(err => {
      // console.log('ERROR in getShoppingLists');
      // console.log(err);
    });
  }

  getShoppingListItems = (listid) => this.props.shoppingListRepository.findItems({
    selector: {
      type: 'item',
      list: listid
    }
  })

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

  renameShoppingListItem = (itemid, newname) => {
    this.props.shoppingListRepository.getItem(itemid).then(item => {
      item = item.set('title', newname);
      return this.props.shoppingListRepository.putItem(item);
    }).then(this.refreshShoppingListItems(this.state.shoppingList._id));
  }

  deleteShoppingListItem = (itemid) => {
    this.props.shoppingListRepository.getItem(itemid).then(item => this.props.shoppingListRepository.deleteItem(item)).then(this.refreshShoppingListItems(this.state.shoppingList._id));
  }
  toggleItemCheck = (itemid) => {
    this.props.shoppingListRepository.getItem(itemid).then(item => {
      item = item.set('checked', !item.checked);
      return this.props.shoppingListRepository.putItem(item);
    }).then(this.refreshShoppingListItems(this.state.shoppingList._id));
  }

  checkAllListItems = (listid) => {
    let listcheck = true;
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
      let listOfShoppingListItems = this.props.shoppingListFactory.newListOfShoppingListItems(newitems);
      return this.props.shoppingListRepository.putItemsBulk(listOfShoppingListItems);
    }).then(newitemsresponse => this.props.shoppingListRepository.get(listid)).then(shoppingList => {
      shoppingList = shoppingList.set('checked', listcheck);
      return this.props.shoppingListRepository.put(shoppingList);
    }).then(shoppingList => {
      this.getShoppingLists();
    });
  }

  deleteShoppingList = (listid) => {
    this.props.shoppingListRepository.get(listid).then(shoppingList => {
      shoppingList = shoppingList.set('_deleted', true);
      return this.props.shoppingListRepository.put(shoppingList);
    }).then(result => {
      this.getShoppingLists();
    });
  }

  renameShoppingList = (listid, newname) => {
    this.props.shoppingListRepository.get(listid).then(shoppingList => {
      shoppingList = shoppingList.set('title', newname);
      return this.props.shoppingListRepository.put(shoppingList);
    }).then(this.getShoppingLists);
  }

  createNewShoppingListOrItem = (e) => {
    e.preventDefault();
    this.setState({ adding: false });

    if (this.state.view === 'lists') {
      let shoppingList = this.props.shoppingListFactory.newShoppingList({
        title: this.state.newName
      });
      this.props.shoppingListRepository.put(shoppingList).then(this.getShoppingLists);

    }
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


  updateName = (e) => {
    this.setState({ newName: e.target.value });
  }

  displayAddingUI = () => {
    this.setState({ adding: true });
  }

  displayLists = () => {
    this.setState({ view: 'lists' });
  }

  displayAbout = () => {
    this.setState({ view: 'about' });
  }


  constructor(props) {
    super(props);
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

  componentDidMount = () => {
    this.getShoppingLists();
    this.props.localDB.sync(this.props.remoteDB, { live: true, retry: true })
      .on('change', change => {
        // console.log("something changed!");
      })
      // .on("paused", info => console.log("replication paused."))
      // .on("active", info => console.log("replication resumed."))
      .on('error', err => { });
  }

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

  renderBackButton = () => {
    if (this.state.view === 'items')
      return (
        <a className="btn-flat btn-large white-text backbutton" onClick={this.getShoppingLists} style={{ padding: '0px', 'vertical-align': 'top' }}>
          <i className="material-icons">keyboard_backspace</i>
        </a>);
    return <span />;
  }

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
        </div>
      </div>
    );
  }
}

export default App;
// load Preact components
import { h, Component } from 'preact';

// renders a shopping list
class ShoppingList extends Component {

  /* all state actions are for handling the renaming dialog */
  state = {
    editingName: false,
    activeItemId: '',
    oldName: '',
    newName: ''
  };

  // reset focus
  componentDidUpdate() {
    if (this.state.editingName === true) {
      this.nameInput.focus();
    }
  }

  // record that editing is starting
  handleEditingStart = (itemid, itemtitle) => {
    this.setState({ editingName: true, activeItemId: itemid, oldName: itemtitle });
  };

  // record that editing is done
  handleEditingDone = () => {
    this.setState({ editingName: false });
  };

  //  UI handler for submission of editing form
  handleEditingSubmit = (e) => {
    this.props.renameItemFunc(this.state.activeItemId, this.state.newName);
    this.handleEditingDone();
  };

  // UI handler for editing the name
  updateName = (e) => {
    this.setState({ newName: e.target.value });
  }

  // JSX - edit name markup
  renderEditNameUI = () => (
    <div>
      <div className="col s6">
        <form onSubmit={this.handleEditingSubmit}>
          <div className="input-field"
            style={{ 'margin-top': '0.5rem' }}
          >
            <input type="text" id="input-name"
              ref={(inp) => { this.nameInput = inp; }}
              value={this.state.oldName}
              onChange={this.updateName}
              style={{ height: 'unset', 'margin-bottom': '8px' }}
            />
          </div>
        </form>
      </div>
      <div className="col s1">
        <a className="btn-flat" onClick={this.handleEditingDone} style={{ padding: '0px' }}>
          <i className="material-icons">close</i>
        </a>
      </div>
    </div>
  )

  // JSX - render the component
  render() {
    let items = [];
    for (let item of this.props.shoppingListItems) {
      items.push(
        <div>
          <div className="row shoppinglistitem" key={'listitem_' + item._id} style={{ margin: '0.5rem 0 0.5rem 0' }}>
            <div className="col s1">
              <input type="checkbox" id={'cb_' + item._id}
                onChange={() => this.props.toggleItemCheckFunc(item._id)}
                defaultChecked={item.checked}
              />
              <label for={'cb_' + item._id} >&nbsp;</label>
            </div>

            {this.state.editingName && this.state.activeItemId === item._id ?
              this.renderEditNameUI() :
              <div className="col s7"><span className={item.checked ? 'checkeditem' : 'uci'}>{item.title}</span></div>}

            <div className="col s4 right-align">
              <a class="btn-flat itemactionbutton" onClick={() => this.handleEditingStart(item._id, item.title)}>
                <i className="material-icons">mode_edit</i>
              </a>
              <a class="btn-flat itemactionbutton" onClick={() => this.props.deleteFunc(item._id)}>
                <i className="material-icons">delete_forever</i>
              </a>
            </div>
          </div>

          <div className="divider" />
        </div>);
    }

    return (
      <div>
        <div>{items}</div>
      </div>
    );
  }
}

export default ShoppingList;
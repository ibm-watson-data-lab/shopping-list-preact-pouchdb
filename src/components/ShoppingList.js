import { h, Component } from 'preact';

const moveVertButton = (
  <a className="btn-floating waves-effect waves-light" 
    onClick={this.displayAddingUI}>
    <i className="material-icons">more_vert</i>
  </a>
);

const fabPositionStyle = {
  position: "absolute" 
}

class ShoppingList extends Component {
  /* all state actions are for handling the renaming dialog */
  state = {
    editingName: false,
    activeItemId: '', 
    oldName: '',
    newName: ''
  };

  handleEditingStart = (itemid, itemtitle) => {
    console.log("in handleEditingStart with itemid="+itemid);
    this.setState({editingName: true, activeItemId: itemid, oldName: itemtitle});
  };

  handleEditingDone = () => {
    this.setState({editingName: false});
  };

  handleEditingSubmit = (e) => {
    this.props.renameItemFunc(this.state.activeItemId, this.state.newName);
    this.handleEditingDone();
  };

  updateName = (e) => {
    this.setState({newName: e.target.value});
  }

  renderEditNameUI = () => {
    return (
      <div>
        <div className="col s6">
          <form onSubmit={this.handleEditingSubmit} style={{marginTop:'12px'}}>
            <div class="input-field">
                <input className="validate" type="text" 
                  value={this.state.oldName} id="input-name" 
                  onChange={this.updateName} 
                  style={{height:"unset"}}
                  underlineStyle={{width:'calc(100% - 24px)'}}/>
            </div>
          </form>
        </div>
        <div className="col s1">
          <a className="btn-flat" onClick={this.handleEditingDone} style={{padding:"0px"}}>
            <i className="material-icons">close</i>
          </a>
        </div>
      </div>
    );
  }

  render() {
    let items = [];
    for(let item of this.props.shoppingListItems) {
      items.push(
        <div>
        <div className="row" key={'listitem_'+item._id} style={{margin:"0.5rem 0 0.5rem 0"}}>
          <div className="col s1">
            <input type="checkbox" id={"cb_"+item._id} 
                onChange={()=>this.props.toggleItemCheckFunc(item._id)} 
                defaultChecked={item.checked}></input>
                <label for={"cb_"+item._id} >&nbsp;</label>
          </div>

          {this.state.editingName && this.state.activeItemId===item._id ? 
            this.renderEditNameUI() : 
            <div className="col s7"><span className={item.checked?"checkeditem":"uci"}>{item.title}</span></div> }

          <div className="col s4 right-align ">
            <a class="btn-flat itemactionbutton" onClick={()=>this.handleEditingStart(item._id, item.title)}>
              <i className="material-icons">mode_edit</i>
            </a>
            <a class="btn-flat itemactionbutton" onClick={()=>this.props.deleteFunc(item._id)}>
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
    )
  }
}

export default ShoppingList;
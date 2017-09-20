import {h, Component} from 'preact';

const iconButtonElement = (
  <a className="btn-floating waves-effect waves-light" 
    onClick={this.displayAddingUI}>
    <i className="material-icons">more_vert</i>
  </a>
);

class ShoppingLists extends Component {
  /* all state actions are for handling the renaming dialog */
  state = {
    editingName: false,
    activeListId: '', 
    oldName: '',
    newName: ''
  };

  componentDidUpdate() {
    if ( this.state.editingName === true ) {
      this.nameInput.focus();
    }
  }

  handleEditingStart = (listid, listtitle) => {
    this.setState({editingName: true, activeListId: listid, oldName: listtitle});
  };

  handleEditingDone = () => {
    this.setState({editingName: false});
  };

  handleEditingSubmit = (e) => {
    this.props.renameListFunc(this.state.activeListId, this.state.newName);
    this.handleEditingDone();
  };

  updateName = (e) => {
    this.setState({newName: e.target.value});
  }

  renderEditNameUI = () => {
    return (
      <div className="row">
        <div className="col s10">
          <form onSubmit={this.handleEditingSubmit}>
            <div class="input-field" 
              style={{"margin-top":"0.5rem","background-color":"aliceblue"}}>
                <input type="text" id="input-name" 
                  ref={(inp)=>{this.nameInput=inp;}} 
                  value={this.state.oldName} 
                  onChange={this.updateName} 
                  style={{height:"unset","margin-bottom":"8px"}}/>
            </div>
          </form>
        </div>
        <div className="col s2">
          <a className="btn-flat" onClick={this.handleEditingDone} style={{padding:"0px"}}>
            <i className="material-icons">close</i>
          </a>
        </div>
      </div>
    );
  }

  render() {
    let listItems = [];
    for(let list of this.props.shoppingLists) {
      listItems.push(
      <div className="card" key={list._id} style={{margin:"12px 0",padding:"12px"}}>
        <span className="card-title">
          {this.state.editingName && this.state.activeListId===list._id ? 
            this.renderEditNameUI() : list.title}
        </span>

        <p>{(this.props.checkedCounts.get(list._id) || 0)+' of '+(this.props.totalCounts.get(list._id) || 0)+' items checked.'}</p>
        <div className="card-action">
          <a className="btn-flat" onClick={()=>this.props.openListFunc(list._id)}>
            <i className="material-icons">play_arrow</i> Open
          </a>
          <a className="btn-flat" onClick={()=>this.handleEditingStart(list._id, list.title)}>
            <i className="material-icons">mode_edit</i> Rename
          </a>
          <a className="btn-flat" onClick={()=>this.props.deleteListFunc(list._id)}>
            <i className="material-icons">delete_forever</i> Delete
          </a>
        </div>
      </div>);
  }
  return (
    <div>
      <div>{listItems}</div>
    </div>
  )
  }
}

export default ShoppingLists;
import {h, Component} from 'preact';

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
        <div className="editing">
          <div className="col s9">
            <form onSubmit={this.handleEditingSubmit}>
              <div class="input-field" 
                style={{"margin-top":"0.5rem","background-color":"aliceblue"}}>
                  <input type="text" id="input-name" 
                    ref={(inp)=>{this.nameInput=inp;}} 
                    value={this.state.oldName} 
                    onChange={this.updateName} 
                    style={{height:"unset","font-size":"18pt","margin-bottom":"8px"}}/>
              </div>
            </form>
          </div>
          <div className="col s3">
            <a className="btn-flat btn-large" style={{padding:"0 0.5rem"}} style={{padding:"0px"}} 
              onClick={this.handleEditingDone}>
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
      <div className="shoppinglist" key={list._id} style={{margin:"12px 0",padding:"12px"}}>
        <div class="row" style="margin-bottom: 0px">
          { this.state.editingName && this.state.activeListId===list._id ? 
            this.renderEditNameUI() : 
            <div className="notediting">
              <div className="col s7">
                <h5><a href="#" onClick={()=>this.props.openListFunc(list._id)}>{list.title}</a></h5>
              </div>
              <div className="col s5 right-align">
                <a className="btn-flat btn-large" style={{padding:"0 0.5rem"}} 
                  onClick={()=>this.props.openListFunc(list._id)}>
                  <i className="material-icons">play_arrow</i>
                </a>
                <a className="btn-flat btn-large" style={{padding:"0 0.5rem"}} 
                  onClick={()=>this.handleEditingStart(list._id, list.title)}>
                  <i className="material-icons">mode_edit</i>
                </a>
                <a className="btn-flat btn-large" style={{padding:"0 0.5rem"}} 
                  onClick={()=>this.props.deleteListFunc(list._id)}>
                  <i className="material-icons">delete_forever</i>
                </a>
              </div>
            </div>
          }
        </div>
        <div className="row">
          <div className="col s1">
            <input type="checkbox" id={"cb_"+list._id} 
              onChange={()=>this.props.checkAllFunc(list._id)} 
              defaultChecked={false}></input>
              <label for={"cb_"+list._id} >&nbsp;</label>
          </div>
          <div className="col s11">
            { (this.props.checkedCounts.get(list._id) || 0)+' of '+(this.props.totalCounts.get(list._id) || 0)+' items checked' }
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div>{listItems}</div>
    </div>
  )
  }
}

export default ShoppingLists;
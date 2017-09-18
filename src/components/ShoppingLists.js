import {h, Component} from 'preact';
import './ShoppingLists.css';

const iconButtonElement = (
  <a className="btn-floating waves-effect waves-light" 
    onClick={this.displayAddingUI}>
    <i className="material-icons">more_vert</i>
  </a>
);

class ShoppingLists extends Component {
  /* all state actions are for handling the renaming dialog */
  state = {
    open: false,
    activeListId: '', 
    oldName: '',
    newName: ''
  };

  handleOpen = (listid, listtitle) => {
    this.setState({open: true, activeListId: listid, oldName: listtitle});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    this.props.renameListFunc(this.state.activeListId, this.state.newName);
    this.handleClose();
  };

  updateName = (e) => {
    this.setState({newName: e.target.value});
  }

  render() {
    /* rename dialog stuff */
    const actions = [
      <a className="btn-flat" onClick={this.handleClose}>cancel</a>,
      <a className="btn-flat" onClick={this.handleSubmit} keyboardFocused={true}>submit</a>
    ];
    /* end rename dialog stuff */
    
    let listItems = [];
    for(let list of this.props.shoppingLists) {
      listItems.push(
      <div className="card" key={list._id} style={{margin:"12px 0"}}>
        <span className="card-title">{list.title}</span>
        <p>{(this.props.checkedCounts.get(list._id) || 0)+' of '+(this.props.totalCounts.get(list._id) || 0)+' items checked.'}</p>
        <div className="card-action">
          <a className="btn-flat" onClick={()=>this.props.openListFunc(list._id)}>
            <i className="material-icons">play_arrow</i> Open
          </a>
          <a className="btn-flat" onClick={()=>this.handleOpen(list._id, list.title)}>
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
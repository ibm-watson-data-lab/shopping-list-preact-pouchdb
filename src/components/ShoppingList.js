import { h, Component } from 'preact';
import './ShoppingList.css';

const moveVertButton = (
  <a className="btn-floating waves-effect waves-light" 
    onClick={this.displayAddingUI}>
    <i className="material-icons">more_vert</i>
  </a>
);


class ShoppingList extends Component {
  /* all state actions are for handling the renaming dialog */
  state = {
    open: false,
    activeItemId: '', 
    oldName: '',
    newName: ''
  };

  handleOpen = (itemid, itemtitle) => {
    this.setState({open: true, activeItemId: itemid, oldName: itemtitle});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = (e) => {
    this.props.renameItemFunc(this.state.activeItemId, this.state.newName);
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

    let items = this.props.shoppingListItems.map( (item) => 
      <div key={'listitem_'+item._id}>
      <li className='shoppinglistitem'>
        <a className="btn-flat" onCheck={this.props.toggleItemCheckFunc} data-item={item._id} data-id={item._id} checked={item.checked}>
          <i className="material-icons">check_box_outline_blank</i>
        </a>
        <span className={(item.checked ? 'checkeditem' : 'uncheckeditem')}>{item.title}</span>
        <a className="btn-flat" onClick={()=>this.props.openListFunc(list._id)}>
          <i className="material-icons">play_arrow</i> Open
        </a>
        <a className="btn-flat" onClick={()=>this.handleOpen(list._id, list.title)}>
          <i className="material-icons">mode_edit</i> Rename
        </a>
        <a className="btn-flat" onClick={()=>this.props.deleteListFunc(list._id)}>
          <i className="material-icons">delete_forever</i> Delete
        </a>
      </li>
      <hr inset={true} />
      </div>
    );
      
    return (
      <div>
        <div>{items}</div>
      </div>
    )
  }
}

export default ShoppingList;
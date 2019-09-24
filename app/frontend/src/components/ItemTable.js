"use strict";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrashAlt, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import ReactTable from 'react-table'
import UserService from '../services/UserService';
import ItemService from '../services/ItemService';
import EditItemModal from './modals/EditItemModal';
import SmallItemModal from './modals/SmallItemModal';
import AssignItemModal from './modals/AssignItemModal';
import ConfirmationModal from './modals/ConfirmationModal';
import TooltipIcon from './TooltipIcon';
import Button from 'react-bootstrap/Button';
import classnames from "classnames";
import PropTypes from 'prop-types';
import 'react-table/react-table.css'

/**
 * returns a function to either filter all or a specific value of the dropdown
 * @param {function} accessor the row accessor function returning the value
 */
const allOrEqualFilterMethod = accessor => (filter, row) => {
  if (filter.value === "all")
    return true;

  if(filter.value === "-- Unassigned --" && !row[filter.id])
    return true;

  return accessor(row[filter.id]) === filter.value;
};

/**
 * returns a function returning a select menu with options defined in list
 * @param {object} list the options
 */
const allOrEqualFilter = list => ({ filter, onChange }) => (
  <select
    onChange={event => onChange(event.target.value)}
    style={{ width: "100%" }}
    value={filter ? filter.value : "all"}
  >
    <option value="all">Show All</option>
    {list.map((el, i) => (<option key={i} value={el}>{el}</option>) )}
  </select>
);

/**
 * Funtion to compare two user object. Sorting lexicographically by username
 * @param {object} a the first user
 * @param {object} b the second user
 */
const userSortMethod = (a, b) => {
    if (!a) return 1;
    if (!b) return -1;
    if (a.name === b.name) {
      return 0;
    }
    return a.name > b.name ? 1 : -1;
};

class ItemTable extends React.Component {

    constructor(props) {
        super(props);

        // real-time socket
        this.socket = props.socket;

        // keeping track of recently changed items to apply flashing background
        this.changed = new Set();

        this.state = {
            //show variables: define if modal is visible
            //index variables: used to pass table index to modal
            addModalShow: false,
            deleteModalShow: false,
            deleteModalIndex: -1,
            unassignModalShow: false,
            unassignModalIndex: -1,
            assignModalShow: false,
            assignModalIndex: -1,
            editModalShow: false,
            editModalIndex: -1,
            smallEditModalShow: false,
            smallEditModalIndex: -1,
            loading: true,
            data: [],
            categories: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleSmallEditSubmit = this.handleSmallEditSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.handleUnassignSubmit = this.handleUnassignSubmit.bind(this);
        this.handleAssignSubmit = this.handleAssignSubmit.bind(this);
        this.canEdit = this.canEdit.bind(this);
        this.canAssign = this.canAssign.bind(this);
        this.canUnassign = this.canUnassign.bind(this);
        this.canDelete = this.canDelete.bind(this);
        this.addItem = this.addItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.getTrProps = this.getTrProps.bind(this);
    }

    componentWillMount(){
        ItemService.getItems(this.props.eventID).then((data) => {
            this.setState(Object.assign({}, this.state, {loading: false, data: data}));
        }).catch((e) => {
            this.setState(Object.assign({}, this.state, {loading: false}));
            console.error(e);
        });

        ItemService.getCategories().then((data) => {
            this.setState(Object.assign({}, this.state, {categories: data}));
        }).catch((e) => {
            console.error(e);
        });
    }

    componentDidMount() {
        // add real-time listeners
        this.socket.on("addItem", this.addItem);
        this.socket.on("deleteItem", this.deleteItem);
        this.socket.on("editItem", this.editItem);
    }

    componentWillUnmount() {
        // remove real-time listeners
        this.socket.off("addItem");
        this.socket.off("deleteItem");
        this.socket.off("editItem");
    }

    //functions called by socket.io
    addItem(item) {
        this.changed.add(item._id); //item was added => add it to changed set
        this.setState(Object.assign({}, this.state, {data: [...this.state.data, item]})); //state is set => changed item will be rendered with flashing background
    }

    editItem(item) {
        this.changed.add(item._id); //item was edited => add it to changed set
        const data = [...this.state.data];
        const index = data.findIndex(el => el._id === item._id);
        if(index >= 0){
            data[index] = item;
            this.setState(Object.assign({}, this.state, {data: data})); //state is set => changed item will be rendered with flashing background
        }
    }

    deleteItem(itemID) {
        this.setState(Object.assign({}, this.state, {data: [...this.state.data.filter(el => el._id !== itemID)]}));
    }

    //functions used to determine user's access to an item row
    canEdit(row) {
        //User can edit an item if they are a host or they requested the item and it has not been assigned yet.
        return this.props.asHost || !row.assigned && (row.requested._id === UserService.getCurrentUser()._id);
    }

    canAssign(row) {
        //Users can assign an item to themselves if the item has not been assigned yet.
        return !row.assigned;
    }

    canUnassign(row) {
        //User can unassign an item if the item is currently assigned to them.
        return row.assigned._id === UserService.getCurrentUser()._id;
    }

    canDelete(row) {
        //User can delete an item if they are a host or they requested the item
        return this.props.asHost || (row.requested._id === UserService.getCurrentUser()._id);
    }

    // Format the amount of an item (amount and unit is stored in the same field in db)
    formatAmount(item){
        const amount = Math.round(item.itemAmount * 100) / 100;
        return `${amount}${item.unit!=='-'? ` ${item.unit}` : ''}`;
    }

    // new item is submitted
    handleSubmit(item) {
        if(!item.itemName) return;
        const newItem = {
            name: item.itemName,
            amount: this.formatAmount(item),
            category: item.category,
            requested: UserService.getCurrentUser()
        }
        ItemService.createItem(this.props.eventID, newItem)
            .catch((e) => window.confirm(e));
        this.setState(Object.assign({}, this.state, {addModalShow: false}));
    }

    // item is edited by a host
    handleEditSubmit(item) {
        if(!item.itemName) return;
        let assignedUser = item.assignedTo === '-'? undefined : this.props.users.find(el => el.name === item.assignedTo);
        const cost = assignedUser? Math.round(item.itemCost * 100) / 100 : undefined;
        assignedUser = cost? assignedUser : undefined;
        const newItem = {
            _id: this.state.data[this.state.editModalIndex]._id,
            name: item.itemName,
            cost: cost,
            amount: this.formatAmount(item),
            category: item.category,
            requested: this.state.data[this.state.editModalIndex].requested,
            assigned: assignedUser? assignedUser._id : undefined
        }
        ItemService.editItem(this.props.eventID, newItem)
            .catch((e) => window.confirm(e));
        this.setState(Object.assign({}, this.state, {editModalShow: false, editModalIndex: -1}));
    }

    // unassigned item is edited by its requester
    handleSmallEditSubmit(item) {
        if(!item.itemName) return;
        const newItem = {
            _id: this.state.data[this.state.smallEditModalIndex]._id,
            name: item.itemName,
            amount: this.formatAmount(item),
            category: item.category,
            requested: this.state.data[this.state.smallEditModalIndex].requested,
        };
        ItemService.editItem(this.props.eventID, newItem)
            .catch((e) => window.confirm(e));
        this.setState(Object.assign({}, this.state, {smallEditModalShow: false, smallEditModalIndex: -1}));
    }

    // item is deleted
    handleDeleteSubmit() {
        if(this.state.deleteModalIndex < 0) return;
        ItemService.deleteItem(this.props.eventID, this.state.data[this.state.deleteModalIndex]._id)
            .catch((e) => window.confirm(e));
        this.setState(Object.assign({}, this.state, {deleteModalShow: false, deleteModalIndex: -1}));
    }

    // item is unassigned
    handleUnassignSubmit() {
        if(this.state.unassignModalIndex < 0) return;
        ItemService.unassignItem(this.props.eventID, this.state.data[this.state.unassignModalIndex]._id)
            .catch(e => window.confirm(e));
        this.setState(Object.assign({}, this.state, {unassignModalShow: false, unassignModalIndex: -1}));
    }

    // item is assigned
    handleAssignSubmit(item) {
        if(this.state.assignModalIndex < 0 || !item.itemCost) return;
        ItemService.assignItem(this.props.eventID, this.state.data[this.state.assignModalIndex]._id, Math.round(item.itemCost * 100) / 100)
            .catch((e) => window.confirm(e));
        this.setState(Object.assign({}, this.state, {assignModalShow: false, assignModalIndex: -1}));
    }

    /**
     * returns a style object used to render each table row
     * @param {object} rowInfo the row
     */
    getTrProps(state, rowInfo, instance) {
        let obj = {
            style : {
                borderRadius: '8px',
                borderBottom: '2px solid rgba(0,0,0,0.16)',
                borderTop: '2px solid rgba(255,255,255,0.04)',
                fontSize: '17px',
                color: 'rgba(70,70,70,1)'
            }
        }

        //if a row item has changes add flashing background
        if(rowInfo && this.changed.has(rowInfo.row._id)){
            this.changed.delete(rowInfo.row._id); // remove item from changed set
            setTimeout(() => { this.setState(Object.assign({}, this.state, {data: [...this.state.data]})); }, 1700);
            obj.className =  classnames({
                "backgroundAnimated": true
            });
        }else if (rowInfo){
            obj.className =  classnames({
                "backgroundAnimated": false
            });
        }

        //if a row item is assigned add green background
        if (rowInfo && rowInfo.row.assigned) {
            obj.style.background = 'rgba(199,255,198,0.5)';
        }

        return obj;
      }

    render() {
        // functions to close modals
        const addModalClose = () => this.setState(Object.assign({}, this.state, {addModalShow: false}));
        const editModalClose = () => this.setState(Object.assign({}, this.state, {editModalShow: false}));
        const smallEditModalClose = () => this.setState(Object.assign({}, this.state, {smallEditModalShow: false}));
        const deleteModalClose = () => this.setState(Object.assign({}, this.state, {deleteModalShow: false}));
        const unassignModalClose = () => this.setState(Object.assign({}, this.state, {unassignModalShow: false}));
        const assignModalClose = () => this.setState(Object.assign({}, this.state, {assignModalShow: false}));

        const columns = [{ //Invisible id column so that _id can be accessed inside getTrProps() to check if the row has changed (_id is in chaged set)
            Header: 'ID',
            accessor: '_id',
            show: false
        }, {
            Header: 'Item Name',
            accessor: 'name',
        }, {
            id: 'cost',
            Header: 'Cost (€)',
            filterable: false,
            accessor: d => d.cost? d.cost : "-", // cost is optional initially
            maxWidth: 120
        }, {
            Header: 'Amount',
            filterable: false,
            accessor: 'amount',
            maxWidth: 120
        }, {
            Header: 'Category',
            accessor: 'category',
            filterMethod: allOrEqualFilterMethod(el => el),
            Filter: allOrEqualFilter(this.state.categories),
            maxWidth: 160
        }, {
            Header: 'Requested by',
            accessor: 'requested',
            sortMethod: userSortMethod,
            filterMethod: allOrEqualFilterMethod(el => el? el.name : undefined),
            Filter: allOrEqualFilter(this.props.users.map(el => el.name)),
            // custom cell to render profile picture and name
            Cell: props => <div><img className="img-profile rounded-circle" src={UserService.getProfilePictureOfUser(props.value)} 
                height="30" width="30" style={{objectFit: "cover", marginRight: '10px'}}/>{props.value.name}</div>
        }, {
            Header: 'Assigned to',
            accessor: 'assigned',
            sortMethod: userSortMethod,
            filterMethod: allOrEqualFilterMethod(el => el? el.name : undefined),
            Filter: allOrEqualFilter(['-- Unassigned --', ...this.props.users.map(el => el.name)]),
            // custom cell to render profile picture and name or 'unassigned'
            Cell: props => props.value ?
                <div><img className="img-profile rounded-circle" src={UserService.getProfilePictureOfUser(props.value)} 
                    height="30" width="30" style={{objectFit: "cover", marginRight: '10px'}}/>{props.value.name}</div>
            : <div style={{color: "red"}}>-- Unassigned --</div>
        }, {
            Header: 'Actions',
            accessor: 'actions',
            filterable: false,
            sortable: false,
            maxWidth: 100,
            style: {textAlign: "center"},
            //Only show action buttons if the specific action can be done by the user
            // Edit | Assign/Unassign | Delete
            Cell: props => <div>
                <TooltipIcon active={this.canEdit(props.row)} placement="left" color="orange" icon={faPen}
                    onClick={() => this.props.asHost?
                        this.setState(Object.assign({}, this.state, {editModalShow: true, editModalIndex: props.row._index}))
                        :this.setState(Object.assign({}, this.state, {smallEditModalShow: true, smallEditModalIndex: props.row._index})) }
                >Edit this Item</TooltipIcon>

                {!props.row.assigned?

                    // if not assigned: show assign button
                    <TooltipIcon active={this.canAssign(props.row)} placement="left" color="green" icon={faUserCheck}
                        onClick={() => this.setState(Object.assign({}, this.state, {assignModalShow: true, assignModalIndex: props.row._index}))}
                    >Assign this Item to yourself</TooltipIcon>

                    // else: show unassign button
                    : <TooltipIcon active={this.canUnassign(props.row)} placement="left" color="red" icon={faUserSlash}
                        onClick={() => this.setState(Object.assign({}, this.state, {unassignModalShow: true, unassignModalIndex: props.row._index}))}
                    >Unassign this Item from yourself</TooltipIcon>
                }

                <TooltipIcon active={this.canDelete(props.row)} placement="left" color="red" icon={faTrashAlt}
                    onClick={() => this.setState(Object.assign({}, this.state, {deleteModalShow: true, deleteModalIndex: props.row._index}))}
                >Delete this Item</TooltipIcon>
                </div>
        }];

        return (
            <div>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-2 text-gray-200">Event Data</h1>
                    <Button onClick={() => this.setState(Object.assign({}, this.state, {addModalShow: true}))} variant="primary">
                        <FontAwesomeIcon className="text-white-50" style={{marginRight:"8px"}} icon={faPlus} /> Add Item
                    </Button>
                </div>
                <div className="card shadow mb-4" >
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-dark">Item Overview</h6>
                    </div>
                    <div className="card-body">
                        <ReactTable loading={this.state.loading} resizable={false} filterable minRows="5" className="text-gray-1600"
                            data={this.state.data}
                            columns={columns}
                            noDataText= 'No items found'
                            getTrProps={this.getTrProps}
                        />
                    </div>
                </div>

                {/* Modal to create an item */}
                <SmallItemModal
                    categories={this.state.categories}
                    users={this.props.users.map(el => el.name)}
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    onSubmit={this.handleSubmit}
                    row={{}}
                />

                {/* Modal to edit an item as a guest */}
                <SmallItemModal
                    categories={this.state.categories}
                    users={this.props.users.map(el => el.name)}
                    show={this.state.smallEditModalShow}
                    onHide={smallEditModalClose}
                    onSubmit={this.handleSmallEditSubmit}
                    row={this.state.smallEditModalIndex>=0?this.state.data[this.state.smallEditModalIndex]:{}}
                />

                {/* Modal to edit an item as a host */}
                <EditItemModal
                    categories={this.state.categories}
                    users={this.props.users}
                    show={this.state.editModalShow}
                    onHide={editModalClose}
                    onSubmit={this.handleEditSubmit}
                    row={this.state.editModalIndex>=0?this.state.data[this.state.editModalIndex]:{}}
                />

                <ConfirmationModal
                    title="Delete item"
                    show={this.state.deleteModalShow}
                    onHide={deleteModalClose}
                    onSubmit={this.handleDeleteSubmit}
                >
                    Are you sure you want to delete this item? Any assigned users will be notified.
                </ConfirmationModal>

                <ConfirmationModal
                    title="Unassign Yourself"
                    show={this.state.unassignModalShow}
                    onHide={unassignModalClose}
                    onSubmit={this.handleUnassignSubmit}
                >
                    Are you sure you don't want to bring this item to the event? The requesting user will be notified.
                </ConfirmationModal>

                <AssignItemModal
                    show={this.state.assignModalShow}
                    onHide={assignModalClose}
                    onSubmit={this.handleAssignSubmit}
                />
            </div>
        );
    }
}

ItemTable.propTypes = {
    users: PropTypes.array.isRequired,
    asHost: PropTypes.bool.isRequired,
    eventID: PropTypes.string.isRequired
};

export default ItemTable;
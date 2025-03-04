import React, { Component } from "react";
import UserEntry from "../components/UserEntry"; 
import "../styles/UserList.css"
import UserForm from "./UserForm";
import ConfirmationModal from "./ConfirmationModal";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true,
      error: null,
      editingUser: null,
      isAddingUser: false,
      userToDelete: null,
      isConfirmingDelete: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.edit = this.edit.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  async componentDidMount() {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiURL}/users`);
      const body = await response.json();
      this.setState({ users: body, isLoading: false });
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  }

  async handleDelete() {
    try {
      const {userToDelete} = this.state
      const apiURL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiURL}/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if(!response.ok) {
        throw new Error("Failed to delete user");
      }

      this.setState((prevState) => ({
        users: prevState.users.filter((user) => user.id !== userToDelete.id),
        isConfirmingDelete: false,
        userToDelete: null,
      }));

    }catch(error) {
      console.log("Error deleting user: ", error); 
    }
  }

  edit(user) {
    this.setState({editingUser: user, isAddingUser: false});
  }

  async handleSave(user) {
    if(user.id) {
      this.handleEdit(user);
    } else {
      this.handleAdd(user);
    }
  }

  async handleEdit(updatedUser) {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiURL}/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if(!response.ok) {
        throw new Error("Failed to update user");
      }
      
      const updatedUserData = await response.json();
    
      this.setState(prevState => ({
        users: prevState.users.map(user =>
          user.id === updatedUser.id ? updatedUserData : user
        ),
        editingUser: null,
      }));
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  }

  async handleAdd(newUser) {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const response = await fetch( `${apiURL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      if(!response.ok) {
        throw new Error("Failed to add user!");
      }

      const addedUser = await response.json();
      this.setState((prevState) => ({
        users: [...prevState.users, addedUser],
        isAddingUser: false
      }));

    } catch(error) {
      console.error("Error adding user: ", error);
    }
  }

  handleCancel() {
    this.setState({editingUser : null, isAddingUser: false, isConfirmingDelete: false});
  }

  addUser() {
    this.setState({isAddingUser: true, editingUser: null});
  }

  deleteUser(user) {
    this.setState({isAddingUser: false, editingUser: null, isConfirmingDelete: true, userToDelete: user});
  }

  render() {
    const { users, isLoading, error, editingUser, isAddingUser, isConfirmingDelete } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error fetching users: {error}</div>;
    }

    return (
      <div className="user-list">
        <div className="user-list-header">
          <h2>Users</h2>
          <button className="positive button" onClick={() => this.addUser()}>Add User</button>
        </div>
        <div className="user-list-body">
          {users.map((user) => (
            <UserEntry
              key={user.id}
              user={user}
              onEdit={() =>this.edit(user)}
              onDelete={() => this.deleteUser(user)}
            />
          ))}
        </div>
        {(editingUser || isAddingUser) && !isConfirmingDelete && (
            <UserForm
              initialUser={editingUser || {}}
              onSave={this.handleSave}
              onCancel={this.handleCancel}
              isEditing={!!editingUser}
            />
        )}
        {(isConfirmingDelete) && (
          <ConfirmationModal
            message={"Are you sure you want to delete this user?"}
            onConfirm={this.handleDelete}
            onCancel={this.handleCancel}
          />
        )}
      </div>
    );
  }
}

export default UserList;

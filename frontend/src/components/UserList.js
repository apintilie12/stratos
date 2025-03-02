import React, { Component } from "react";
import UserEntry from "../components/UserEntry"; 
import "../styles/UserList.css"
import EditUserForm from "./EditUserForm";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true,
      error: null,
      editingUser: null,
    };
    this.remove = this.remove.bind(this);
    this.edit = this.edit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  // Fetch users when the component mounts
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

  remove(userId) {
    alert(`Remove user with ID: ${userId}`);
  }

  edit(user) {
    this.setState({editingUser: user});
  }

  async handleSave(updatedUser) {
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

  handleCancel() {
    this.setState({editingUser : null});
  }

  addUser() {
    alert("Adding new user");
  }

  render() {
    const { users, isLoading, error, editingUser } = this.state;

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
          <button className="add-button" onClick={() => this.addUser()}>Add User</button>
        </div>
        <div className="user-list-body">
          {users.map((user) => (
            <UserEntry
              key={user.id}
              user={user}
              onEdit={() =>this.edit(user)}
              onDelete={this.remove}
            />
          ))}
        </div>
        {editingUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <EditUserForm
                user={editingUser}
                onSave={this.handleSave}
                onCancel={this.handleCancel}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserList;

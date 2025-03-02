import React, { Component } from "react";
import UserEntry from "../components/UserEntry"; 
import "../styles/UserList.css"

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true,
      error: null,
    };
    this.remove = this.remove.bind(this);
    this.edit = this.edit.bind(this);
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

  edit(userId) {
    alert(`Edit user with ID: ${userId}`);
  }

  addUser() {
    alert("Adding new user");
  }

  render() {
    const { users, isLoading, error } = this.state;

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
              onEdit={this.edit}
              onDelete={this.remove}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default UserList;

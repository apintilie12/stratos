import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component {
  
  state = {
    users : []
  };

  async componentDidMount() {
  try {
    const apiURL = process.env.REACT_APP_API_URL;
    const response = await fetch(`${apiURL}/users`);
    const body = await response.json();
    this.setState({users: body});
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


  render() {
    const {users} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className='App-intro'>
            <h2>Users</h2>
            {users.map(user => 
              <div key={user.id}>
                {user.username} -- {user.role}
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default App;

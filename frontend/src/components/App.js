import '../styles/App.css';
import '../styles/global.css';
import { Component } from 'react';
import UserList from '../components/UserList'; 

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Admin Home Page</h1>
        </header>
        <div className='App-body'>
          <div className='App-intro'>
            <UserList />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

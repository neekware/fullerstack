import './app.scss';

import { Component } from 'react';
import { Link, Route } from 'react-router-dom';

import { ReactComponent as Logo } from './logo.svg';

export class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="flex">
          <Logo width="75" height="75" />
          <h1>Welcome to annotator!</h1>
        </header>

        <main>
          <h2>Resources &amp; Tools</h2>
          <p>Thank you for using and showing some ♥ for Nx.</p>
        </main>

        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/page-2">Page 2</Link>
            </li>
          </ul>
        </div>

        <Route
          path="/"
          exact
          render={() => (
            <div>
              This is the generated root route. <Link to="/page-2">Click here for page 2.</Link>
            </div>
          )}
        />

        <Route
          path="/page-2"
          exact
          render={() => (
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          )}
        />
      </div>
    );
  }
}

export default App;

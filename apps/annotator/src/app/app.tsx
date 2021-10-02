/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import './app.scss';

import { RcxAnnotator } from '@fullerstack/rcx-annotator';
import MoreIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { Route } from 'react-router';

export class App extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  componentDidMount() {
    // this is like ngOnInit
  }

  componentDidUpdate() {
    // this is like ngOnChanges
  }

  componentWillUnmount() {
    // this is like ngOnDestroy
  }

  shouldComponentUpdate(): boolean {
    // this is like ngDoCheck?
    return true;
  }

  handleMobileMenuOpen = (event: any) => {
    this.setState({ ...this.state, mobileMoreAnchorEl: event.currentTarget });
  };

  render() {
    return (
      <>
        <Box className="app">
          <IconButton>
            <MoreIcon color="primary" />
          </IconButton>
        </Box>
        <Route path="/dd" component={RcxAnnotator} />
      </>
    );
    //   <div className="app">
    //     <header className="flex">
    //       <Logo width="75" height="75" />
    //       <h1>Welcome to annotator!</h1>
    //     </header>

    //     <main>
    //       <h2>Resources &amp; Tools</h2>
    //       <p>Thank you for using and showing some ♥ for Nx.</p>
    //     </main>

    //     <div role="navigation">
    //       <ul>
    //         <li>
    //           <Link to="/">Home</Link>
    //         </li>
    //         <li>
    //           <Link to="/rcx-annotator">RcxAnnotator</Link>
    //         </li>
    //         <li>
    //           <Link to="/page-2">Page 2</Link>
    //         </li>
    //       </ul>
    //     </div>

    //     <Route
    //       path="/"
    //       exact
    //       render={() => (
    //         <div>
    //           This is the generated root route. <Link to="/page-2">Click here for page 2.</Link>
    //         </div>
    //       )}
    //     />

    //     <Route
    //       path="/page-2"
    //       exact
    //       render={() => (
    //         <div>
    //           <Link to="/">Click here to go back to root page.</Link>
    //         </div>
    //       )}
    //     />
    //   </div>
    // );
  }
}

export default App;

/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import './app.scss';

import { RcxAnnotator } from '@fullerstack/rcx-annotator';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { Route } from 'react-router';
import { withRouter } from 'react-router-dom';

export class App extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  getLocation() {
    const { pathname } = (this.props as any)?.location;
    return pathname;
  }

  componentDidMount() {
    // this is like ngOnInit
    console.log(this.getLocation());
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
        {this.getLocation() === '/' && (
          <IconButton>
            <Box className="app">
              <IconButton>
                <MoreIcon color="primary" />
              </IconButton>
            </Box>
          </IconButton>
        )}
        <Route path="/dd" component={RcxAnnotator} />
      </>
    );
  }
}

export default withRouter((props) => <App {...props} />);

import React, { Component, PropTypes } from 'react';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import ModalManager from 'containers/ModalManager';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import * as currentUserActions from 'redux/modules/currentUser';
if (__CLIENT__) {
  require('../../../node_modules/sweetalert/dev/sweetalert.scss');
}

@connect(
  state => {
    return {
      isAuthenticated: state.currentUser.get('isAuthenticated'),
      pathName: state.router.location.pathname
    };
  },
  {
    pushState,
    checkAuthentication: currentUserActions.checkAuthentication
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,

    isAuthenticated: PropTypes.bool.isRequired,
    pathName: PropTypes.string.isRequired,

    pushState: PropTypes.func.isRequired,
    checkAuthentication: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.checkAuthentication();
  }

  componentDidMount() {
    // TODO refactor this code later to support this redirect on the server
    if (this.props.isAuthenticated && this.props.pathName === '/sign-in') {
      this.props.pushState(null, '/');
    } else if (!this.props.isAuthenticated && this.props.pathName !== '/sign-in') {
      this.props.pushState(null, '/sign-in');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.props.pushState(null, '/');
      location.reload();
    } else if (this.props.isAuthenticated && !nextProps.isAuthenticated) {
      this.props.pushState(null, '/sign-in');
      location.reload();
    }
  }

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <Navbar />
        <div>
          <Sidebar />
          <div className={styles.appContent}>
            {this.props.children}
          </div>
        </div>
        <ModalManager />
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import ModalManager from 'containers/ModalManager';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

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

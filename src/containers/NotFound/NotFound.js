import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    const styles = require('./NotFound.scss');
    return (
      <div className={styles.notFound}>
        This page does not exist.
      </div>
    );
  }
}

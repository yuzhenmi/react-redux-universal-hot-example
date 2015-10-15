import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeModal } as modalActions from 'redux/modules/modal';
import Immutable from 'immutable';

@connect(
  state => ({
    modals: state.modal.get('modals')
  }),
  dispatch => ({
    ...bindActionCreators({
      closeModal: modalActions.closeModal
    }, dispatch)
  })
)
export default class ModalManager extends Component {
  static propTypes = {
    modals: PropTypes.instanceOf(Immutable.List),

    closeModal: PropTypes.func.isRequired
  }

  handleClickBackdrop = (modalId) => {
    this.props.closeModal(modalId);
  }

  render() {
    const styles = require('./ModalManager.scss');
    const {modals} = this.props;
    return (
      <div className={styles.modalManager}>
        {modals.map((modal, modalIndex) => {
          const modalId = modal.get('id');
          const ModalComponent = modal.get('component');
          const props = modal.get('props');
          return (
            <div key={modalIndex} className={styles.wrapper1}>
              <div className={styles.wrapper2}>
                <div className={styles.wrapper3}>
                  <button className={styles.backdrop} onClick={this.handleClickBackdrop.bind(this, modalId)}/>
                  <ModalComponent {...props} modalId={modalId}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import { signOut } from 'redux/modules/currentUser';
import YumferClient from 'apis/YumferClient';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import * as modalActions from 'redux/modules/modal';
import classNames from 'classnames';
import IngredientCard from 'components/IngredientCard';

const initialState = {
  searchTerm: '',
  isSearching: false,
  matchingIngredients: []
};

@connect(
  null,
  {
    closeModal: modalActions.closeModal
  }
)
export default class SelectOutputIngredientModal extends Component {
  static propTypes = {
    modalId: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,

    closeModal: PropTypes.func.isRequired
  }

  state = {...initialState}

  search = lodash.throttle((searchTerm) => {
    YumferClient.searchIngredients({ searchTerm, page: 1, perPage: 10 })
      .then(data => {
        const {ingredients} = data;
        this.setState({ isSearching: false, matchingIngredients: ingredients });
      }, error => {
        this.setState({ isSearching: false });
        if (error.status === 401) {
          signOut();
          return;
        }
      });
  }, 500)

  handleClickCloseModal = () => {
    const { modalId, closeModal } = this.props;
    closeModal(modalId);
  }

  handleSelectIngredient = (selectedIngredient) => {
    const { onSelect, modalId, closeModal } = this.props;
    const ingredient = Immutable.fromJS({...selectedIngredient, portionValue: 0, portionUnit: ''});
    onSelect(ingredient);
    closeModal(modalId);
  }

  handleChangeSearchTerm = (event) => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    if (searchTerm.length === 0) {
      this.setState(initialState);
      return;
    }
    this.search(searchTerm);
  }

  render() {
    const styles = require('./SelectOutputIngredientModal.scss');
    const { selectedIngredient, matchingIngredients, searchTerm } = this.state;
    const selectedIngredientName = selectedIngredient ? selectedIngredient.name : '';
    let trimmedSearchTerm = searchTerm.trim().toLowerCase();
    trimmedSearchTerm = trimmedSearchTerm.charAt(0).toUpperCase() + trimmedSearchTerm.slice(1);
    let searchTermHasExactMatch = false;
    return (
      <div className={styles.selectOutputIngredientModal}>
        <div className={styles.heading}>
          <h2>What gets produced?</h2>
          <button type="button" className={styles.closeModal} onClick={this.handleClickCloseModal}>&#215;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.searchContainer}>
            <label>This step produces...</label>
            <input type="text" className={styles.searchTerm} placeholder="Apple pie, Potato chunks, Chili sauce, etc." onChange={this.handleChangeSearchTerm} />
            <ul className={styles.searchResultsContainer}>
              {matchingIngredients.map((ingredient, ingredientIndex) => {
                const name = ingredient.name;
                if (name.toLowerCase() === trimmedSearchTerm.toLowerCase()) {
                  searchTermHasExactMatch = true;
                }
                return (
                  <li className={styles.searchResultContainer} key={ingredientIndex}>
                    <button type="button" className={classNames({[styles.selected]: name === selectedIngredientName})} onClick={this.handleSelectIngredient.bind(null, ingredient)}>
                      <IngredientCard name={name}/>
                    </button>
                  </li>
                );
              })}
              {trimmedSearchTerm.length > 0 && !searchTermHasExactMatch && (
                <li className={styles.searchResultContainer}>
                  <button type="button" className={classNames({[styles.selected]: trimmedSearchTerm === selectedIngredientName})} onClick={this.handleSelectIngredient.bind(null, { name: trimmedSearchTerm })}>
                    <IngredientCard name={trimmedSearchTerm}/>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

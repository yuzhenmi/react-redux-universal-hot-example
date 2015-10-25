import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import { signOut } from 'redux/modules/currentUser';
import YumferClient from 'apis/YumferClient';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import * as modalActions from 'redux/modules/modal';
import classNames from 'classnames';
import IngredientCard from 'components/IngredientCard';
let sweetAlert;
if (__CLIENT__) {
  sweetAlert = require('sweetalert');
}

const initialState = {
  searchTerm: '',
  portionValue: '',
  portionUnit: '',
  selectedIngredient: null,
  isSearching: false,
  matchingIngredients: []
};

@connect(
  null,
  {
    closeModal: modalActions.closeModal
  }
)
export default class SelectInputIngredientModal extends Component {
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

  handleSelectIngredient = (ingredient) => {
    this.setState({ selectedIngredient: ingredient });
  }

  handleChangeSearchTerm = (event) => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    if (searchTerm.trim().length === 0) {
      this.setState(initialState);
      return;
    }
    this.search(searchTerm);
  }

  handleChangePortionValue = (event) => {
    this.setState({ portionValue: event.target.value });
  }

  handleChangePortionUnit = (event) => {
    this.setState({ portionUnit: event.target.value });
  }

  handleSubmit = () => {
    const { portionValue, portionUnit, selectedIngredient } = this.state;
    if (!selectedIngredient) {
      sweetAlert('Oops...', 'You didn\'t select an ingredient yet!', 'error');
      return;
    }
    if (!portionValue || !portionUnit) {
      sweetAlert('Oops...', 'Enter the quantity needed as numerical value and unit!', 'error');
      return;
    }

    const { onSelect } = this.props;
    const ingredient = Immutable.fromJS({...selectedIngredient, portionValue: Number(portionValue), portionUnit});
    onSelect(ingredient);
  }

  render() {
    const styles = require('./SelectInputIngredientModal.scss');
    const { selectedIngredient, matchingIngredients, searchTerm } = this.state;
    const selectedIngredientName = selectedIngredient ? selectedIngredient.name : '';
    let trimmedSearchTerm = searchTerm.trim().toLowerCase();
    trimmedSearchTerm = trimmedSearchTerm.charAt(0).toUpperCase() + trimmedSearchTerm.slice(1);
    let searchTermHasExactMatch = false;
    return (
      <section className={styles.selectInputIngredientModal}>
        <div className={styles.heading}>
          <h2>Add an ingredient</h2>
          <button type="button" className={styles.closeModal} onClick={this.handleClickCloseModal}>&#215;</button>
        </div>
        <div className={styles.body}>
          <div className={styles.searchContainer}>
            <label>I need...</label>
            <input type="text" className={styles.searchTerm} placeholder="Potato, Sugar, Milk, etc." onChange={this.handleChangeSearchTerm} />
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
          <div className={styles.portionContainer}>
            <label>In what quantity?</label>
            <input type="text" className={styles.portionValue} placeholder="1, 3, 500, etc." onChange={this.handleChangePortionValue} />
            <input type="text" className={styles.portionUnit} placeholder="lb, teaspoons, mL, etc." onChange={this.handleChangePortionUnit} />
          </div>
          <div className={styles.actionsContainer}>
            <button type="button" className={styles.submit} onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      </section>
    );
  }
}

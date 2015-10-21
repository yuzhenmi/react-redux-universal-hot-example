import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import { signOut } from 'redux/modules/currentUser';
import YumferClient from 'apis/YumferClient';
import Immutable from 'immutable';

const initialState = {
  searchTerm: '',
  isSearching: false,
  matchingIngredients: []
};

export default class SelectOutputIngredientModal extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
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

  handleSelectIngredient = (selectedIngredient) => {
    const { onSelect } = this.props;
    const ingredient = Immutable.fromJS({...selectedIngredient, portionValue: 0, portionUnit: ''});
    onSelect(ingredient);
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
        <div>
          <input type="text" placeholder="e.g. Tomato" onChange={this.handleChangeSearchTerm} />
        </div>
        <ul>
          {matchingIngredients.map((ingredient, ingredientIndex) => {
            const name = ingredient.name;
            if (name.toLowerCase() === trimmedSearchTerm.toLowerCase()) {
              searchTermHasExactMatch = true;
            }
            return (
              <li key={ingredientIndex}>
                {name === selectedIngredientName && (
                  <button type="button" className={styles.selected} onClick={this.handleSelectIngredient.bind(null, ingredient)}>{name}</button>
                )}
                {name === selectedIngredientName || (
                  <button type="button" onClick={this.handleSelectIngredient.bind(null, ingredient)}>{name}</button>
                )}
              </li>
            );
          })}
          {trimmedSearchTerm.length > 0 && !searchTermHasExactMatch && (
            <li>
              {trimmedSearchTerm.toLowerCase() === selectedIngredientName.toLowerCase() && (
                <button type="button" className={styles.selected} onClick={this.handleSelectIngredient.bind(null, { name: trimmedSearchTerm })}>{trimmedSearchTerm}</button>
              )}
              {trimmedSearchTerm.toLowerCase() === selectedIngredientName.toLowerCase() || (
                <button type="button" onClick={this.handleSelectIngredient.bind(null, { name: trimmedSearchTerm })}>{trimmedSearchTerm}</button>
              )}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

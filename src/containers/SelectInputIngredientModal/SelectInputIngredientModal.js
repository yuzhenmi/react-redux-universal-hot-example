import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import { signOut } from 'redux/modules/currentUser';
import YumferClient from 'apis/YumferClient';
import Immutable from 'immutable';

const initialState = {
  searchTerm: '',
  portionValue: '',
  portionUnit: '',
  selectedIngredient: null,
  isSearching: false,
  matchingIngredients: []
};

export default class SelectInputIngredientModal extends Component {
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
    if (!selectedIngredient || !portionValue || !portionUnit) {
      alert('Please make sure to choose an ingredient and enter the portion value and unit.');
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
      <div className={styles.selectInputIngredientModal}>
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
        <div>
          <label>How much of this do we need?</label>
          <input type="text" placeholder="e.g. 1" onChange={this.handleChangePortionValue} />
          <input type="text" placeholder="e.g. lb" onChange={this.handleChangePortionUnit} />
        </div>
        <div>
          <button type="button" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

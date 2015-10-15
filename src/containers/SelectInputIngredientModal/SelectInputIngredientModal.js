import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSearchTerm } as selectInputIngredientModalActions from 'redux/modules/selectInputIngredientModal';
import Immutable from 'immutable';

@connect(
  state => {
    return {
      searchTerm: state.selectInputIngredientModal.get('searchTerm'),
      matchingIngredients: state.selectInputIngredientModal.get('matchingIngredients'),
      isSearching: state.selectInputIngredientModal.get('isSearching')
    };
  },
  {
    setSearchTerm: selectInputIngredientModalActions.setSearchTerm
  }
)
export default class SelectInputIngredientModal extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,

    searchTerm: PropTypes.string.isRequired,
    matchingIngredients: PropTypes.instanceOf(Immutable.List),
    isSearching: PropTypes.bool.isRequired,

    setSearchTerm: PropTypes.func.isRequired
  };

  handleSelectIngredient = (ingredient) => {
    const { onSelect } = this.props;
    onSelect(ingredient);
  }

  handleChangeSearchTerm = (event) => {
    const { setSearchTerm } = this.props;
    setSearchTerm(event.target.value);
  }

  render() {
    const styles = require('./SelectInputIngredientModal.scss');
    const { matchingIngredients, searchTerm } = this.props;
    return (
      <div className={styles.selectInputIngredientModal}>
        <div>
          <input type="text" placeholder="e.g. Tomato" value={searchTerm} onChange={this.handleChangeSearchTerm} />
        </div>
        <ul>
          {matchingIngredients.map((ingredient, ingredientIndex) => {
            const name = ingredient.get('name');
            return (
              <li key={ingredientIndex}>
                <button type="button" onClick={this.handleSelectIngredient.bind(null, ingredient)}>{name}</button>
              </li>
            );
          })}
        </ul>
        <div>
          <label>How much of this do we need?</label>
          <input type="text" placeholder="e.g. 1" />
          <input type="text" placeholder="e.g. lb" />
        </div>
      </div>
    );
  }
}

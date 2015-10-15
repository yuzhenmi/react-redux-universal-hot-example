import React, { Component, PropTypes } from 'react';

export default class SelectOutputIngredientModal extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  handleSelectIngredient = (ingredient) => {
    const {onSelect} = this.props;
    onSelect(ingredient);
  }

  render() {
    const styles = require('./SelectOutputIngredientModal.scss');
    return (
      <div className={styles.selectOutputIngredientModal}>
        <ul>
          {require('immutable').fromJS([{name: 'Cucumber'}, {name: 'Tomato'}]).map((ingredient, ingredientIndex) => {
            const name = ingredient.get('name');
            return (
              <li key={ingredientIndex}>
                <button type="button" onClick={this.handleSelectIngredient.bind(null, ingredient)}>{name}</button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

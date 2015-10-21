import React, { PropTypes } from 'react';

export default function IngredientCard({name, portionValue, portionUnit}) {
  return (
    <div>
      <div>{name}</div>
      {!!portionValue && !!portionUnit && (
        <div>
          <span>{portionValue}</span>
          <span>{portionUnit}</span>
        </div>
      )}
    </div>
  );
}

IngredientCard.propTypes = {
  name: PropTypes.string.isRequired,
  portionValue: PropTypes.number,
  portionUnit: PropTypes.string
};

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { goToPreviousStep, goToNextStep, setRecipeName, setRecipeSummary,
  submitNewRecipe, setRecipeStepMethod, addRecipeStepInputIngredient,
  addRecipeStepOutputIngredient } as newRecipeActions from 'redux/modules/newRecipe';
import Immutable from 'immutable';
import IngredientCard from 'components/IngredientCard';
import SelectInputIngredientModal from 'containers/SelectInputIngredientModal';
import SelectOutputIngredientModal from 'containers/SelectOutputIngredientModal';
import { openModal, closeModal } as modalActions from 'redux/modules/modal';

@connect(
  state => {
    return {
      currentStep: state.newRecipe.get('currentStep'),
      recipeName: state.newRecipe.get('recipeName'),
      recipeSummary: state.newRecipe.get('recipeSummary'),
      recipeSteps: state.newRecipe.get('recipeSteps')
    };
  },
  {
    goToPreviousStep: newRecipeActions.goToPreviousStep,
    goToNextStep: newRecipeActions.goToNextStep,
    setRecipeName: newRecipeActions.setRecipeName,
    setRecipeSummary: newRecipeActions.setRecipeSummary,
    submitNewRecipe: newRecipeActions.submitNewRecipe,
    setRecipeStepMethod: newRecipeActions.setRecipeStepMethod,
    addRecipeStepInputIngredient: newRecipeActions.addRecipeStepInputIngredient,
    addRecipeStepOutputIngredient: newRecipeActions.addRecipeStepOutputIngredient,
    openModal: modalActions.openModal,
    closeModal: modalActions.closeModal
  }
)
export default class NewRecipe extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    recipeName: PropTypes.string.isRequired,
    recipeSummary: PropTypes.string.isRequired,
    recipeSteps: PropTypes.instanceOf(Immutable.List),

    goToPreviousStep: PropTypes.func.isRequired,
    goToNextStep: PropTypes.func.isRequired,
    setRecipeName: PropTypes.func.isRequired,
    setRecipeSummary: PropTypes.func.isRequired,
    submitNewRecipe: PropTypes.func.isRequired,
    setRecipeStepMethod: PropTypes.func.isRequired,
    addRecipeStepInputIngredient: PropTypes.func.isRequired,
    addRecipeStepOutputIngredient: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  handleClickGoToPreviousStep = () => {
    const {goToPreviousStep} = this.props;
    goToPreviousStep();
  }

  handleClickGoToNextStep = () => {
    const {goToNextStep} = this.props;
    goToNextStep();
  }

  handleChangeRecipeName = (event) => {
    const {setRecipeName} = this.props;
    setRecipeName(event.target.value);
  }

  handleChangeRecipeSummary = (event) => {
    const {setRecipeSummary} = this.props;
    setRecipeSummary(event.target.value);
  }

  handleChangeRecipeStepMethod = (recipeStepIndex, event) => {
    const {setRecipeStepMethod} = this.props;
    setRecipeStepMethod(recipeStepIndex, event.target.value);
  }

  handleClickAddRecipeStepInputIngredient = (recipeStepIndex) => {
    const {openModal} = this.props;
    openModal(SelectInputIngredientModal, 'SelectInputIngredientModal', { onSelect: this.handleSelectInputIngredient.bind(this, recipeStepIndex) });
  }

  handleClickAddRecipeStepOutputIngredient = (recipeStepIndex) => {
    const {openModal} = this.props;
    openModal(SelectOutputIngredientModal, 'SelectOutputIngredientModal', { onSelect: this.handleSelectOutputIngredient.bind(this, recipeStepIndex) });
  }

  handleSelectInputIngredient = (recipeStepIndex, inputIngredient) => {
    const {closeModal} = this.props;
    closeModal('SelectInputIngredientModal');
    const {addRecipeStepInputIngredient} = this.props;
    addRecipeStepInputIngredient(recipeStepIndex, inputIngredient);
  }

  handleSelectOutputIngredient = (recipeStepIndex, outputIngredient) => {
    const {closeModal} = this.props;
    closeModal('SelectOutputIngredientModal');
    const {addRecipeStepOutputIngredient} = this.props;
    addRecipeStepOutputIngredient(recipeStepIndex, outputIngredient);
  }

  render() {
    const { currentStep, recipeName, recipeSummary, recipeSteps } = this.props;
    const styles = require('./NewRecipe.scss');
    return (
      <div className={styles.newRecipe}>
        {currentStep === 1 && (
          <div>
            <label>What's the name of your recipe?</label>
            <button type="button">Example</button>
            <input type="text" value={recipeName} onChange={this.handleChangeRecipeName} />
            <button type="button" onClick={this.handleClickGoToNextStep}>Next</button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <label>What can you say about your recipe?</label>
            <button type="button">Example</button>
            <textarea value={recipeSummary} onChange={this.handleChangeRecipeSummary} />
            <button type="button" onClick={this.handleClickGoToPreviousStep}>Back</button>
            <button type="button" onClick={this.handleClickGoToNextStep}>Next</button>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <label>Let's write down the steps for your recipe!</label>
            <button type="button">Example</button>
            <ul>
              {recipeSteps.map((recipeStep, recipeStepIndex) => {
                const inputIngredients = recipeStep.get('inputIngredients');
                const method = recipeStep.get('method');
                const outputIngredients = recipeStep.get('outputIngredients');
                return (
                  <li key={recipeStepIndex}>
                    <div>
                      <h3>Step {recipeStepIndex + 1}</h3>
                    </div>
                    <div>
                      <div>
                        <label>Which ingredients do you need for this step?</label>
                        <ul>
                          {inputIngredients.map((inputIngredient, inputIngredientIndex) => {
                            const name = inputIngredient.get('name');
                            const portionValue = inputIngredient.get('portionValue');
                            const portionUnit = inputIngredient.get('portionUnit');
                            return (
                              <li key={inputIngredientIndex}>
                                <IngredientCard name={name} portionValue={portionValue} portionUnit={portionUnit} />
                              </li>
                            );
                          })}
                          <li>
                            <button type="button" onClick={this.handleClickAddRecipeStepInputIngredient.bind(this, recipeStepIndex)}>+</button>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <label>What do you do with the ingredients?</label>
                        <input type="text" value={method} onChange={this.handleChangeRecipeStepMethod.bind(this, recipeStepIndex)} />
                      </div>
                      <div>
                        <label>What gets produced from this step?</label>
                        <ul>
                          {outputIngredients.map((outputIngredient, outputIngredientIndex) => {
                            const name = outputIngredient.get('name');
                            const portionValue = outputIngredient.get('portionValue');
                            const portionUnit = outputIngredient.get('portionUnit');
                            return (
                              <li key={outputIngredientIndex}>
                                <IngredientCard name={name} portionValue={portionValue} portionUnit={portionUnit} />
                              </li>
                            );
                          })}
                          <li>
                            <button type="button" onClick={this.handleClickAddRecipeStepOutputIngredient.bind(this, recipeStepIndex)}>+</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={this.handleClickGoToPreviousStep}>Back</button>
            <button type="button">Save This Recipe</button>
          </div>
        )}
      </div>
    );
  }
}

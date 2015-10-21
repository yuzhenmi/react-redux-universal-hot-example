import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as newRecipeActions from 'redux/modules/newRecipe';
import Immutable from 'immutable';
import IngredientCard from 'components/IngredientCard';
import SelectInputIngredientModal from 'containers/SelectInputIngredientModal';
import SelectOutputIngredientModal from 'containers/SelectOutputIngredientModal';
import * as modalActions from 'redux/modules/modal';
import classNames from 'classnames';

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
        <div className={styles.background}/>
        <div className={styles.stepIndicatorsContainer}>
          <span className={classNames(styles.stepIndicator, {[styles.currentStepIndicator]: currentStep === 1})}>1</span>
          <span className={classNames(styles.stepIndicator, {[styles.currentStepIndicator]: currentStep === 2})}>2</span>
          <span className={classNames(styles.stepIndicator, {[styles.currentStepIndicator]: currentStep === 3})}>3</span>
        </div>
        <div className={styles.stepsContainer}>
          {currentStep === 1 && (
            <section className={classNames(styles.step, styles.step1)}>
              <h3>What's the name of your recipe?</h3>
              <div className={styles.example}>
                <button type="button">Example</button>
              </div>
              <input type="text" className={styles.recipeName} value={recipeName} onChange={this.handleChangeRecipeName} />
              <div className={styles.buttonsContainer}>
                <button type="button" className={styles.next} onClick={this.handleClickGoToNextStep}>Next</button>
              </div>
            </section>
          )}
          {currentStep === 2 && (
            <section className={classNames(styles.step, styles.step2)}>
              <h3>What can you say about your recipe?</h3>
              <div className={styles.example}>
                <button type="button">Example</button>
              </div>
              <textarea className={styles.recipeSummary} rows={6} value={recipeSummary} onChange={this.handleChangeRecipeSummary} />
              <div className={styles.buttonsContainer}>
                <button type="button" className={styles.back} onClick={this.handleClickGoToPreviousStep}>Back</button>
                <button type="button" className={styles.next} onClick={this.handleClickGoToNextStep}>Next</button>
              </div>
            </section>
          )}
          {currentStep === 3 && (
            <section className={classNames(styles.step, styles.step3)}>
              <h3>Let's write down the steps for your recipe!</h3>
              <div className={styles.example}>
                <button type="button">Example</button>
              </div>
              <ul className={styles.recipeStepsContainer}>
                {recipeSteps.map((recipeStep, recipeStepIndex) => {
                  const inputIngredients = recipeStep.get('inputIngredients');
                  const method = recipeStep.get('method');
                  const outputIngredients = recipeStep.get('outputIngredients');
                  return (
                    <li key={recipeStepIndex}>
                      <div>
                        <h4>Step {recipeStepIndex + 1}</h4>
                      </div>
                      <div className={styles.inputIngredientsContainer}>
                        <label>Which ingredients do you need for this step?</label>
                        <ul className={styles.inputIngredientsList}>
                          {inputIngredients.map((inputIngredient, inputIngredientIndex) => {
                            const name = inputIngredient.get('name');
                            const portionValue = inputIngredient.get('portionValue');
                            const portionUnit = inputIngredient.get('portionUnit');
                            return (
                              <li className={styles.inputIngredientContainer} key={inputIngredientIndex}>
                                <IngredientCard name={name} portionValue={portionValue} portionUnit={portionUnit} />
                              </li>
                            );
                          })}
                          <li className={styles.inputIngredientContainer}>
                            <button type="button" className={styles.addInputIngredient} onClick={this.handleClickAddRecipeStepInputIngredient.bind(this, recipeStepIndex)}>
                              <span>+</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className={styles.methodContainer}>
                        <label>What do you do with the ingredients?</label>
                        <input type="text" className={styles.method} value={method} onChange={this.handleChangeRecipeStepMethod.bind(this, recipeStepIndex)} />
                      </div>
                      <div className={styles.outputIngredientsContainer}>
                        <label>What gets produced from this step?</label>
                        <ul className={styles.outputIngredientsList}>
                          {outputIngredients.map((outputIngredient, outputIngredientIndex) => {
                            const name = outputIngredient.get('name');
                            const portionValue = outputIngredient.get('portionValue');
                            const portionUnit = outputIngredient.get('portionUnit');
                            return (
                              <li className={styles.outputIngredientContainer} key={outputIngredientIndex}>
                                <IngredientCard name={name} portionValue={portionValue} portionUnit={portionUnit} />
                              </li>
                            );
                          })}
                          <li className={styles.outputIngredientContainer}>
                            <button type="button" className={styles.addOutputIngredient} onClick={this.handleClickAddRecipeStepOutputIngredient.bind(this, recipeStepIndex)}>
                              <span>+</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.buttonsContainer}>
                <button type="button" className={styles.back} onClick={this.handleClickGoToPreviousStep}>Back</button>
                <button type="button" className={styles.done}>Done!</button>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

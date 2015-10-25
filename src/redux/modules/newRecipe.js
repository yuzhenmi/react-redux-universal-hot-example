import Immutable from 'immutable';
import YumferClient from 'apis/YumferClient';
import createReducer from 'utils/createReducer';

const MODULE_NAMESPACE = 'yumfer/newRecipe';

export const GO_TO_PREVIOUS_STEP = `${MODULE_NAMESPACE}/GO_TO_PREVIOUS_STEP`;
export const GO_TO_NEXT_STEP = `${MODULE_NAMESPACE}/GO_TO_NEXT_STEP`;
export const SET_RECIPE_NAME = `${MODULE_NAMESPACE}/SET_RECIPE_NAME`;
export const SET_RECIPE_SUMMARY = `${MODULE_NAMESPACE}/SET_RECIPE_SUMMARY`;
export const ADD_RECIPE_STEP = `${MODULE_NAMESPACE}/ADD_RECIPE_STEP`;
export const REMOVE_RECIPE_STEP = `${MODULE_NAMESPACE}/REMOVE_RECIPE_STEP`;
export const ADD_RECIPE_STEP_INPUT_INGREDIENT = `${MODULE_NAMESPACE}/ADD_RECIPE_STEP_INPUT_INGREDIENT`;
export const REMOVE_RECIPE_STEP_INPUT_INGREDIENT = `${MODULE_NAMESPACE}/REMOVE_RECIPE_STEP_INPUT_INGREDIENT`;
export const SET_RECIPE_STEP_METHOD = `${MODULE_NAMESPACE}/SET_RECIPE_STEP_METHOD`;
export const ADD_RECIPE_STEP_OUTPUT_INGREDIENT = `${MODULE_NAMESPACE}/ADD_RECIPE_STEP_OUTPUT_INGREDIENT`;
export const REMOVE_RECIPE_STEP_OUTPUT_INGREDIENT = `${MODULE_NAMESPACE}/REMOVE_RECIPE_STEP_OUTPUT_INGREDIENT`;
export const SUBMIT_NEW_RECIPE = `${MODULE_NAMESPACE}/SUBMIT_NEW_RECIPE`;
export const SUBMIT_NEW_RECIPE_SUCCESS = `${MODULE_NAMESPACE}/SUBMIT_NEW_RECIPE_SUCCESS`;
export const SUBMIT_NEW_RECIPE_ERROR = `${MODULE_NAMESPACE}/SUBMIT_NEW_RECIPE_ERROR`;

const initialRecipeStepState = Immutable.fromJS({
  inputIngredients: [],
  method: '',
  outputIngredients: []
});

const initialState = Immutable.fromJS({
  currentStep: 1,
  recipeName: '',
  recipeSummary: '',
  recipeSteps: [initialRecipeStepState],
  isSubmitingNewRecipe: false
});

const handlers = {
  [GO_TO_PREVIOUS_STEP]: function handleGoToPreviousStep(state) {
    let currentStep = state.get('currentStep');
    if (currentStep > 1) {
      currentStep--;
    }
    return state.set('currentStep', currentStep);
  },

  [GO_TO_NEXT_STEP]: function handleGoToNextStep(state) {
    let currentStep = state.get('currentStep');
    if (currentStep < 3) {
      currentStep++;
    }
    return state.set('currentStep', currentStep);
  },

  [SET_RECIPE_NAME]: function handleSetRecipeName(state, action) {
    const {recipeName} = action;
    return state.set('recipeName', recipeName);
  },

  [SET_RECIPE_SUMMARY]: function handleSetRecipeSummary(state, action) {
    const {recipeSummary} = action;
    return state.set('recipeSummary', recipeSummary);
  },

  [ADD_RECIPE_STEP]: function handleAddRecipeStep(state) {
    const recipeSteps = state.get('recipeSteps').push(initialRecipeStepState);
    return state.set('recipeSteps', recipeSteps);
  },

  [REMOVE_RECIPE_STEP]: function handleRemoveRecipeStep(state, action) {
    const {recipeStepIndex} = action;
    const recipeSteps = state.get('recipeSteps').delete(recipeStepIndex);
    return state.set('recipeSteps', recipeSteps);
  },

  [ADD_RECIPE_STEP_INPUT_INGREDIENT]: function handleAddRecipeStepInputIngredient(state, action) {
    const {recipeStepIndex, inputIngredient} = action;
    const recipeSteps = state.get('recipeSteps');
    const recipeStep = recipeSteps.get(recipeStepIndex);
    const inputIngredients = recipeStep.get('inputIngredients');
    return state.set('recipeSteps', recipeSteps.set(recipeStepIndex, recipeStep.set('inputIngredients', inputIngredients.push(inputIngredient))));
  },

  [REMOVE_RECIPE_STEP_INPUT_INGREDIENT]: function handleRemoveRecipeStepInputIngredient(state, action) {
    const {recipeStepIndex, inputIngredientIndex} = action;
    const recipeSteps = state.get('recipeSteps');
    const recipeStep = recipeSteps.get(recipeStepIndex);
    const inputIngredients = recipeStep.get('inputIngredients');
    return state.set('recipeSteps', recipeSteps.set(recipeStepIndex, recipeStep.set('inputIngredients', inputIngredients.delete(inputIngredientIndex))));
  },

  [SET_RECIPE_STEP_METHOD]: function handleSetRecipeStepMethod(state, action) {
    const {recipeStepIndex, method} = action;
    const recipeSteps = state.get('recipeSteps');
    const recipeStep = recipeSteps.get(recipeStepIndex);
    return state.set('recipeSteps', recipeSteps.set(recipeStepIndex, recipeStep.set('method', method)));
  },

  [ADD_RECIPE_STEP_OUTPUT_INGREDIENT]: function handleAddRecipeStepOutputIngredient(state, action) {
    const {recipeStepIndex, outputIngredient} = action;
    const recipeSteps = state.get('recipeSteps');
    const recipeStep = recipeSteps.get(recipeStepIndex);
    const outputIngredients = recipeStep.get('outputIngredients');
    return state.set('recipeSteps', recipeSteps.set(recipeStepIndex, recipeStep.set('outputIngredients', outputIngredients.push(outputIngredient))));
  },

  [REMOVE_RECIPE_STEP_OUTPUT_INGREDIENT]: function handleRemoveRecipeStepOutputIngredient(state, action) {
    const {recipeStepIndex, outputIngredientIndex} = action;
    const recipeSteps = state.get('recipeSteps');
    const recipeStep = recipeSteps.get(recipeStepIndex);
    const outputIngredients = recipeStep.get('outputIngredients');
    return state.set('recipeSteps', recipeSteps.set(recipeStepIndex, recipeStep.set('outputIngredients', outputIngredients.delete(outputIngredientIndex))));
  },

  [SUBMIT_NEW_RECIPE]: function handleSubmitNewRecipe(state) {
    return state.set('isSubmitingNewRecipe', true);
  },

  [SUBMIT_NEW_RECIPE_SUCCESS]: function handleSubmitNewRecipeSuccess(state) {
    return state.set('isSubmitingNewRecipe', false);
  },

  [SUBMIT_NEW_RECIPE_ERROR]: function handleSubmitNewRecipeError(state) {
    return state.set('isSubmitingNewRecipe', false);
  }
};

export default createReducer(initialState, handlers);

export function goToPreviousStep() {
  return { type: GO_TO_PREVIOUS_STEP };
}

export function goToNextStep() {
  return { type: GO_TO_NEXT_STEP };
}

export function setRecipeName(recipeName) {
  return { type: SET_RECIPE_NAME, recipeName };
}

export function setRecipeSummary(recipeSummary) {
  return { type: SET_RECIPE_SUMMARY, recipeSummary };
}

export function addRecipeStep() {
  return { type: ADD_RECIPE_STEP };
}

export function removeRecipeStep(recipeStepIndex) {
  return { type: REMOVE_RECIPE_STEP, recipeStepIndex };
}

export function addRecipeStepInputIngredient(recipeStepIndex, inputIngredient) {
  return { type: ADD_RECIPE_STEP_INPUT_INGREDIENT, recipeStepIndex, inputIngredient };
}

export function removeRecipeStepInputIngredient(recipeStepIndex, inputIngredientIndex) {
  return { type: REMOVE_RECIPE_STEP_INPUT_INGREDIENT, recipeStepIndex, inputIngredientIndex };
}

export function setRecipeStepMethod(recipeStepIndex, method) {
  return { type: SET_RECIPE_STEP_METHOD, recipeStepIndex, method };
}

export function addRecipeStepOutputIngredient(recipeStepIndex, outputIngredient) {
  return { type: ADD_RECIPE_STEP_OUTPUT_INGREDIENT, recipeStepIndex, outputIngredient };
}

export function removeRecipeStepOutputIngredient(recipeStepIndex, outputIngredientIndex) {
  return { type: REMOVE_RECIPE_STEP_OUTPUT_INGREDIENT, recipeStepIndex, outputIngredientIndex };
}

export function submitNewRecipe(name, summary, steps) {
  return dispatch => {
    dispatch({ type: SUBMIT_NEW_RECIPE });
    YumferClient.submitNewRecipe({ name, summary, steps: steps.toJS() })
      .then(() => {
        dispatch({ type: SUBMIT_NEW_RECIPE_SUCCESS });
      }).then(response => {
        const {error} = response;
        dispatch({ type: SUBMIT_NEW_RECIPE_ERROR, error });
      });
  };
}

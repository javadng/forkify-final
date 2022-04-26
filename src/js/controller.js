import 'core-js';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import bookmarkView from './Views/bookmarkView.js';
import paginationView from './Views/paginationView.js';
import recipeView from './Views/recipeView.js';
import searchResultVeiw from './Views/searchResultView.js';
import searchVeiw from './Views/searchView.js';
import addRecipeView from './Views/addrecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipeLoad = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //  Spinner
    recipeView.renderSpinner();

    // Load recipe data
    await model.recipeLoad(id);

    recipeView.render(model.state.recipe);
    bookmarkView.update(model.state.bookmark);

    // update the result search to marke seleted one
    searchResultVeiw.update(model.getSearchResultsPage());
  } catch (err) {
    console.log(`💥${err}`);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // 1. Get the query
    const query = searchVeiw._getQuery();
    if (!query) throw new Error('The Query Not valid');

    // spinner (preloader)
    searchResultVeiw.renderSpinner();

    // 2. GET recipe from API
    await model.recipeSearchLoad(query);

    // 3. render results
    searchResultVeiw.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`💥${err}`);
    searchResultVeiw.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  // render New results
  searchResultVeiw.render(model.getSearchResultsPage(goToPage));

  // render new btns Pagination
  paginationView.render(model.state.search);
};

const controlSetBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // Upadte
  recipeView.update(model.state.recipe);

  // render bookmark
  bookmarkView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlServings = function (newServing) {
  model.updateServings(newServing);

  recipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render Spinner
    addRecipeView.renderSpinner();

    // add to state obj
    await model.uploadRecipe(newRecipe);

    // render new recipe to UI
    recipeView.render(model.state.recipe);

    // render succses message
    addRecipeView.renderMessage();

    // add to the bookmark
    bookmarkView.render(model.state.bookmark);

    // change ID in URl
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close Modal
    setTimeout(() => {
      addRecipeView.closeModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥 ${err}`);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerLoad(controlRecipeLoad);
  searchVeiw.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerBookmark(controlSetBookmark);
  recipeView.addHandlerUpdateServing(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    image: recipe.image_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    src: recipe.source_url,
    title: recipe.title,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
  };
};

export const recipeLoad = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObj(data);

    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const recipeSearchLoad = async function (query) {
  try {
    // 1. set query  ...
    state.search.query = query;

    // 2. Get Result
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    //3. set results to the state
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`💥💥${err}`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const addBookmark = function (recipe) {
  // add recipe to bookmark Array
  state.bookmark.push(recipe);

  // Set bookMark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistData();
};

export const deleteBookMark = function (id) {
  const index = state.bookmark.findIndex(rec => rec.id === id);
  state.bookmark.splice(index, 1);

  // NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistData();
};

export const persistData = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(',').map(el => el.trim());

      const [quantity, unit, description] = ingArr;

      return { quantity: quantity ? +quantity : null, unit, description };
    });

  const recipe = {
    title: newRecipe.title,
    publisher: newRecipe.publisher,
    image_url: newRecipe.image,
    source_url: newRecipe.sourceUrl,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObj(data);
  addBookmark(state.recipe);
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

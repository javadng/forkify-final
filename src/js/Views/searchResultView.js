import View from './View.js';
import previewView from './previewView.js';

class SearchResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We cannot FIND your recipe, Try another!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResultView();

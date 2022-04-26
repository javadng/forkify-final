import View from './View.js';
import icons from 'url:../../img/icons.svg';

class SearchView extends View {
  _parentElement = document.querySelector('.search');
  _errorMeesage = '';
  _message = '';

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  _getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
}

export default new SearchView();

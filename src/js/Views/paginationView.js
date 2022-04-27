import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = '';
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const Goto = +btn.dataset.goto;
      handler(Goto);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const pageNumber = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page one and there are other pages
    if (curPage === 1 && pageNumber > 1) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        <span class="pagination__pagenumber"> ${curPage} </span>
      `;
    }

    //other Pages
    if (curPage < pageNumber) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <span class="pagination__pagenumber"> ${curPage} </span>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // Last Page
    if (curPage === pageNumber && pageNumber > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <span class="pagination__pagenumber"> ${curPage} </span>
      `;
    }

    // Just one page
    return '';
  }
}

export default new PaginationView();

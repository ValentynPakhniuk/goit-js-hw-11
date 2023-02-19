
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import imagesGallery from './cards.js';
import FetchPixabay from './fetchPixabay.js';
import LoadMoreBtn from './loadMoreBtn.js';

const form = document.querySelector('.search-form');
const galleryCard = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

const fetchPixabay = new FetchPixabay();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', () => fetchArticles(true));

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const inputValue = form.elements.searchQuery.value.trim();
  fetchPixabay.searchQuery = inputValue;

  fetchPixabay.resetPage();
  clearGalleryList();
  loadMoreBtn.show();
  fetchArticles().finally(() => form.reset());
}

async function fetchArticles(isLoadMore) {
  loadMoreBtn.disable();

  try {
    const articles = await fetchPixabay.getPicture();

    if (articles.hits.length === 0)
      throw new Notiflix.Notify.failure(
        `"Sorry, there are no images matching your search query. Please try again."`
      );
    
    Notiflix.Notify.success(`"Hooray! We found ${articles.totalHits} images."`);

    const markup = articles.hits.reduce((acc, hit) => imagesGallery(hit) + acc, '');

    appendGalleryToList(markup);
    lightbox.refresh();

    let totalHits = articles.totalHits;
    let perPage = 40;
    let quotientPage = Math.floor(totalHits / perPage);
    let remainder = totalHits % perPage;
    if (remainder !== 0) {
      quotientPage = quotientPage + 1;
    }
    
    if (fetchPixabay.page > quotientPage) {
      onError();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    if (isLoadMore) {
      const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
    }
    loadMoreBtn.enable();
  } catch (err) {
    onError();
  }
}

function appendGalleryToList(markup) {
  galleryCard.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryList() {
  galleryCard.innerHTML = '';
}

function onError() {
  loadMoreBtn.hide();
}

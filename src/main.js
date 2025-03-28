import { fetchImagesFromAPI, handleError, handleInfo } from './js/pixabay-api.js';
import { renderImages } from './js/render-functions.js';

const elements = {
  form: document.getElementById('searchForm'),
  inputField: document.getElementById('searchInput'),
  gallery: document.getElementById('gallery'),
  loadMoreBtn: document.getElementById('loadMoreBtn'),
  loader: document.getElementById('loader'),
};

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

elements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  currentQuery = elements.inputField.value.trim();
  if (!currentQuery) return;

  currentPage = 1;
  elements.gallery.innerHTML = '';
  elements.loadMoreBtn.style.display = 'none';
  elements.loader.style.display = 'flex';
  
  try {
    const imagesData = await fetchImagesFromAPI(currentQuery, currentPage);
    totalHits = imagesData.totalHits;
    renderImages(imagesData);
    
    if (totalHits > 15) {
      elements.loadMoreBtn.style.display = 'block';
    } else if (imagesData.hits.length > 0 && imagesData.hits.length === totalHits) {
      handleInfo("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    elements.loader.style.display = 'none';
    elements.inputField.blur();
  }
});

elements.loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  elements.loadMoreBtn.style.display = 'none';
  elements.loader.style.display = 'flex';
  
  try {
    const imagesData = await fetchImagesFromAPI(currentQuery, currentPage);
    renderImages(imagesData, true);
    
    const loadedItems = currentPage * 15;
    if (loadedItems >= totalHits) {
      elements.loadMoreBtn.style.display = 'none';
      handleInfo("We're sorry, but you've reached the end of search results.");
    } else {
      elements.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    elements.loader.style.display = 'none';
  }
});
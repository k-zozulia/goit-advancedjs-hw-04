import { handleError } from './pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightboxInstance = null;

function renderImages({ totalHits, hits }, append = false) {
  const galleryContainer = document.getElementById('gallery');
  
  if (!append) {
    galleryContainer.innerHTML = '';
  }

  if (hits.length === 0) {
    handleError('Sorry, there are no images matching your search query. Please try again!');
    return;
  }

  hits.forEach(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }, index) => {
    const imageStats = [
      { title: 'Likes', value: likes },
      { title: 'Views', value: views },
      { title: 'Comments', value: comments },
      { title: 'Downloads', value: downloads },
    ];

    const imageInfoHTML = imageStats
      .map(({ title, value }) => `
        <div class="info-block">
          <span class="info-title">${title}</span>
          <span class="info-value">${value}</span>
        </div>
      `)
      .join('');

    const imageItem = document.createElement('li');
    imageItem.classList.add('gallery-item');

    imageItem.innerHTML = `
      <a href="${largeImageURL}" class="gallery-link">
        <div class="image-wrapper">
          <img
            src="${webformatURL}"
            alt="${tags}"
            class="gallery-image hidden"
          />
        </div>
      </a>
      <div class="gallery-info">
        ${imageInfoHTML}
      </div>
    `;

    const imgElement = imageItem.querySelector('.gallery-image');

    imgElement.onload = () => {
      imgElement.classList.remove('hidden');
    };

    galleryContainer.appendChild(imageItem);

    setTimeout(() => {
      imageItem.classList.add('fade-in');
    }, index * 100);
  });

  if (!lightboxInstance) {
    lightboxInstance = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      overlayOpacity: 0.8,
    });
  } else {
    lightboxInstance.refresh();
  }
}

export { renderImages };
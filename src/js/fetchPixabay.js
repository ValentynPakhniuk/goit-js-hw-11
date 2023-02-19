import axios from 'axios';

export default class FetchPixabay {
  constructor() {
    this.page = 1;
    this.searchQuery = "";
  }

  async getPicture() {
    const URL = `https://pixabay.com/api/?key=33663110-3ce3aee5a9ae3ad5b2e6971d2&q=${this.searchQuery}&per_page=40&page=${this.page}`;
    const response = await axios.get(URL);
    this.nextPage();
    return response.data;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
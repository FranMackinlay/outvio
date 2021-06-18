import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Api = {
  getBooks: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/books`);
      console.log(`res`, data.books[0]._id);
    } catch ({ response: { data, status } }) {
      console.log(`error`, data, status);
    }
  }
}

let counter = 0;

setInterval(() => {
  console.log(`counter`, counter);
  try {
    Api.getBooks();
  } catch (error) {
    console.log(`error`, error.message);
  }
  counter++;
}, 100);



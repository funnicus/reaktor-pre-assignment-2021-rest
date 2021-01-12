import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/product-info-list'

export const getProducts = async (product) => {
    const products = await axios.get(`${baseUrl}/${product}`);
    return products
}
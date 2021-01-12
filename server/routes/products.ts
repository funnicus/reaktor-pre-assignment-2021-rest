import express from 'express';
import axios from 'axios';
const productRouter = express.Router();

import { Product } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
productRouter.get('/api/products/:product', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://bad-api-assignment.reaktor.com/v2/products/${req.params.product}`);
        const data = apiResponse.data as Product[];
        res.json(data);
    } catch(err) {
        const result = (err as Error).message;
        console.log(result);
        res.status(500).json({ error: result });
    }
});

export default productRouter;
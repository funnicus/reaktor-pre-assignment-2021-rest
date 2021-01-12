import express from 'express';
import fs from 'fs';
const productInfoListRouter = express.Router();

import { Product } from '../../types';

productInfoListRouter.get("/", (_req, _res) => {
    console.log("ping");
});

productInfoListRouter.get('/:product', (req, res) => {
    const { product } = req.params;
    let productInfo;
    try {
        switch (product) {
            case 'beanies':
                productInfo = fs.readFileSync("./data_files/beanies.json", 'utf-8');
                productInfo = JSON.parse(productInfo) as Product[];
                break;
            case 'facemasks':
                productInfo = fs.readFileSync("./data_files/facemasks.json", 'utf-8');
                productInfo = JSON.parse(productInfo) as Product[];
                break;
            case 'gloves':
                productInfo = fs.readFileSync("./data_files/gloves.json", 'utf-8');
                productInfo = JSON.parse(productInfo) as Product[];
                break;
            default:
                throw new Error(`Could not get information for products: ${product}`);
        }
    } catch (e) {
        const result = (e as Error).message;
        console.error(result);
        res.status(500).json({ error: result });
    }
    res.status(200).json(productInfo);
});

export default productInfoListRouter;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const productInfoListRouter = express_1.default.Router();
productInfoListRouter.get("/", (_req, _res) => {
    console.log("ping");
});
productInfoListRouter.get('/:product', (req, res) => {
    const { product } = req.params;
    let productInfo;
    try {
        switch (product) {
            case 'beanies':
                productInfo = fs_1.default.readFileSync("./data_files/beanies.json", 'utf-8');
                productInfo = JSON.parse(productInfo);
                break;
            case 'facemasks':
                productInfo = fs_1.default.readFileSync("./data_files/facemasks.json", 'utf-8');
                productInfo = JSON.parse(productInfo);
                break;
            case 'gloves':
                productInfo = fs_1.default.readFileSync("./data_files/gloves.json", 'utf-8');
                productInfo = JSON.parse(productInfo);
                break;
            default:
                throw new Error(`Could not get information for products: ${product}`);
        }
    }
    catch (e) {
        const result = e.message;
        console.error(result);
        res.status(500).json({ error: result });
    }
    res.status(200).json(productInfo);
});
exports.default = productInfoListRouter;

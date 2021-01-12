"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const extractInStockValue = (datapayload) => {
    const indexStart = datapayload.indexOf('<INSTOCKVALUE>') + 14;
    const indexEnd = datapayload.indexOf('</INSTOCKVALUE>');
    const inStockValue = datapayload.substring(indexStart, indexEnd);
    return inStockValue;
};
const getProducts = (product) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiResponse = yield axios_1.default.get(`https://bad-api-assignment.reaktor.com/v2/products/${product}`);
        const data = apiResponse.data;
        //finding out every manufacturer from products
        const manufacturers = Array.from(new Set(data.map(p => p.manufacturer)));
        //Stroring all the awailability info from each manufacturer into an array so we dont have to make any more requests than necessary
        const awailability = yield Promise.all(manufacturers.map((manufacturer) => __awaiter(void 0, void 0, void 0, function* () {
            let res = yield axios_1.default.get(`https://bad-api-assignment.reaktor.com/v2/availability/${manufacturer}`);
            let info = res.data;
            //Handling the case where the server returns us the awailability as a string, which we don't want
            while (typeof info.response === "string") {
                res = yield axios_1.default.get(`https://bad-api-assignment.reaktor.com/v2/availability/${manufacturer}`);
                info = res.data;
            }
            return { manufacturer, info: info.response };
        })));
        //Data to be send back
        const productInfo = data.map(p => {
            //Finding the index in our array where the correct manufacturer awailability info is stored
            const index = awailability.findIndex(a => p.manufacturer === a.manufacturer);
            //Finding the awailability for the product with its id
            const awailInfo = awailability[index].info.find(i => i.id.toLowerCase() === p.id.toLowerCase());
            let awail;
            //in case nothing was found, set to no information, which shouldn't happen
            if (!awailInfo)
                awail = "no information";
            //extracting awailability using a function
            else
                awail = extractInStockValue(awailInfo.DATAPAYLOAD);
            const info = Object.assign(Object.assign({}, p), { awailability: awail });
            return info;
        });
        return productInfo;
    }
    catch (err) {
        const result = err.message;
        console.log(result);
    }
    return undefined;
});
exports.default = getProducts;

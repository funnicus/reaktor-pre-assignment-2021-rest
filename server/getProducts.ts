import axios from 'axios';
import { Product, ProductInfo, AwailabilityResponse } from '../types';

const extractInStockValue = (datapayload: string): string => {
    const indexStart = datapayload.indexOf('<INSTOCKVALUE>') + 14;
    const indexEnd = datapayload.indexOf('</INSTOCKVALUE>');

    const inStockValue = datapayload.substring(indexStart, indexEnd);
    return inStockValue;
};

const getProducts = async (product: string): Promise<ProductInfo[] | undefined>=> {
    try {
        const apiResponse = await axios.get(`https://bad-api-assignment.reaktor.com/v2/products/${product}`);
        const data = apiResponse.data as Product[];

        //finding out every manufacturer from products
        const manufacturers = Array.from(new Set(data.map(p => p.manufacturer)));

        //Stroring all the awailability info from each manufacturer into an array so we dont have to make any more requests than necessary
        const awailability = await Promise.all(manufacturers.map(async (manufacturer) => {
            let res = await axios.get(`https://bad-api-assignment.reaktor.com/v2/availability/${manufacturer}`);
            let info = res.data as AwailabilityResponse;
            //Handling the case where the server returns us the awailability as a string, which we don't want
            while(typeof info.response === "string"){
                res = await axios.get(`https://bad-api-assignment.reaktor.com/v2/availability/${manufacturer}`);
                info = res.data as AwailabilityResponse;
            }
            return { manufacturer, info: info.response };
        }));

        //Data to be send back
        const productInfo = data.map(p => {
            //Finding the index in our array where the correct manufacturer awailability info is stored
            const index = awailability.findIndex(a => p.manufacturer === a.manufacturer);
            //Finding the awailability for the product with its id
            const awailInfo = awailability[index].info.find(i => i.id.toLowerCase() === p.id.toLowerCase()); 
            let awail: string;
            //in case nothing was found, set to no information, which shouldn't happen
            if(!awailInfo) awail = "no information";
            //extracting awailability using a function
            else awail = extractInStockValue(awailInfo.DATAPAYLOAD);
            const info: ProductInfo = { 
                ...p, 
                awailability: awail
            };
            return info;
        });
        return productInfo;
    } catch (err) {
        const result = (err as Error).message;
        console.log(result);
    }
    return undefined;
};

export default getProducts;
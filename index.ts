import express from 'express';
import cors from 'cors';
import fs from 'fs';

import getProducts from './server/getProducts';
import productInfoListRouter from './server/routes/productInfoList';
import productRouter from './server/routes/products';
import manufacturerRouter from './server/routes/manufacturers';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/product-info-list", productInfoListRouter);
app.use("/api/products", productRouter);
app.use("/api/manufacturers", manufacturerRouter);

const reactApp = express.static('./client/build');
app.use(reactApp);

const PORT = 3001;

//Get all the information for every product category and save them into files...
setInterval(() => {
    const writeDataToFiles = async () => {
        try {
            console.log("Here");
            const beanies = await getProducts('beanies');
            const gloves = await getProducts('gloves');
            const facemasks = await getProducts('facemasks');
            console.log("ready!");
    
            fs.writeFileSync('./data_files/beanies.json', JSON.stringify(beanies));
            fs.writeFileSync('./data_files/gloves.json', JSON.stringify(gloves));
            fs.writeFileSync('./data_files/facemasks.json', JSON.stringify(facemasks));
        } catch (err) {
            console.error((err as Error).message);
        }
    };
    void writeDataToFiles();
}, 1000 * 60 * 5); //update every 5 minutes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
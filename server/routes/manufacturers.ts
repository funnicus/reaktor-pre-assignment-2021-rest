import express from 'express';
import axios from 'axios';
const manufacturerRouter = express.Router();

import { Awailability } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
manufacturerRouter.get('/api/awailability/:manufacturer', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://bad-api-assignment.reaktor.com/v2/availability/${req.params.manufacturer}`);
        const data = apiResponse.data as Awailability;
        res.json(data);
    } catch (err) {
        const result = (err as Error).message;
        console.log(result);
        res.status(500).json({ error: result });
    }
});

export default manufacturerRouter;
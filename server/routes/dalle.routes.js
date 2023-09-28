import * as dotenv from 'dotenv';
import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
// import { OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from DAll_E ROUTES' });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        const image = response.data.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Something Went Wrong' });
    }
});

export default router;

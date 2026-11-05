import 'dotenv/config';
import { env } from '../env/index.js';
import { app } from './app.js';

app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT} 🚀`);
});

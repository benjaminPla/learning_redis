import fetch from 'node-fetch';
import express from 'express';
import redis from 'redis';

const app = express();
app.use(express.json());
const redisClient = redis.createClient(); // default port = 6379
await redisClient.connect()
  .catch(err => console.log(err))
  .finally(() => console.log('redis on!'));

app.get('/photos', async (req, res) => {
  // ANOTHER ALTERNATIVE: await redisClient.get('photos', () => {});
  const redisExists = await redisClient.exists('photos');
  if (redisExists) {
    console.log('redisExists');
    const photos = await redisClient.get('photos');
    res.json(JSON.parse(photos));
  } else {
    console.log('!redisExists');
    const data = await fetch('https://jsonplaceholder.typicode.com/photos')
      .then(res => res.json())
      .catch(e => console.log(e));
    redisClient.set('photos', JSON.stringify(data));
    redisClient.expire('photos', 100);
    res.json(data);
  };
});

app.listen('3340', () => console.log('API on port: 3340'));

// https://flaviocopes.com/how-to-use-redis-nodejs/

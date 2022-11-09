import solution from '../index.js';

const port = 8080;
solution().listen(8080, () => {
  console.log('listening on port 8080');
});

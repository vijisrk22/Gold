const fs = require('fs');
const https = require('https');

https.get('https://www.malabargoldanddiamonds.com/in/pan-india/en/product-list.html', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('malabar.html', data);
    console.log('Saved malabar.html');
  });
});

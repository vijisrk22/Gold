
const cheerio = require('cheerio');

async function test() {
  const url = 'https://www.malabargoldanddiamonds.com/in/pan-india/en/product-list.html';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('HTML length:', html.length);
  const livegoldrate = $('#livegoldrate');
  console.log('Live gold rate element found:', livegoldrate.length > 0);
  console.log('Live gold rate text:', livegoldrate.text());
  
  // Find span
  const span = $('#livegoldrate span');
  console.log('Spans found inside #livegoldrate:', span.length);
  span.each((i, el) => {
    console.log(`Span ${i} classes:`, $(el).attr('class'), 'Text:', $(el).text());
  });
}

test();

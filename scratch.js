(async () => {
  try {
    const res = await fetch('https://api.lalithaajewellery.com/public/pricings/latest?state_id=df30f5aa-75b6-4766-8317-25cf4eaf43a6', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log(`[${res.status}]`);
    if (res.ok) {
      const text = await res.text();
      console.log("RESPONSE:", text);
    } else {
      console.log(await res.text());
    }
  } catch (err) {
    console.error(err);
  }
})();

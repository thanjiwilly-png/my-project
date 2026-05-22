(async () => {
  const endpoints = [
    { method: 'GET', url: 'http://localhost:3000/' },
    { method: 'GET', url: 'http://localhost:3000/api/health' },
    { method: 'POST', url: 'http://localhost:3000/api/echo', body: { hello: 'world' } },
    { method: 'POST', url: 'http://localhost:3000/user', body: { email: 'thanjiwilly' } },
    { method: 'GET', url: 'http://localhost:3000/user/willy/profile' }
  ];

  for (const ep of endpoints) {
    try {
      const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
      if (ep.body) opts.body = JSON.stringify(ep.body);
      const res = await fetch(ep.url, opts);
      const text = await res.text();
      console.log('----');
      console.log(`${ep.method} ${ep.url} -> ${res.status}`);
      console.log(text);
    } catch (err) {
      console.error('Error calling', ep.url, err.message);
    }
  }
})();

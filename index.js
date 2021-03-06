
const toRedirectToBlog = [
  'la-boucherie-responsable-de-benjamin-darnaud',
  'beau-fort-le-premier-resto-fromagerie-de-paris',
  'patrice-chapon-lance-la-deuxieme-edition-du-concours-de-la-meilleure-mousse-aux-chocolat-amateur',
  'defi-de-chef-le-ceviche-de-cabillaud-par-gaetan-gentil',
  'lello-le-gout-de-la-sardaigne',
  'la-fabrique-givree',
  'vivre-damour-et-deau-fraiche-cest-bien-vivre-damour-et-de-bonne-bouffe-cest-mieux',
  'la-tomme-aux-fleurs',
  'la-ptite-epicerie',
  'dans-la-famille-brie-le-brisilic',
  'pitaya',
  'le-kitchen-cafe',
  'chef-bosviel-de-linstitut-restaurant-ecole-paul-bocuse',
  'jean-luc-vianey',
  'la-creme-de-la-cremerie-lyonnaise',
  'le-gnocchi-fourre-burrata',
  'boucheriebello',
  'didier-lassagne',
];

const toBlog = [
  'wp-admin',
  'wp-content',
  'wp-json',
  'category',
  'xmlrpc.php',
  'feed',
  'comments',
  'wp-includes',
  'portfolio',
  'blog',
  'contact',
  'mentions-legales',
  'wp-login.php',
];

const HOSTS = {
  app: 'storage.googleapis.com/shop.nelio.io',
};

/**
 * Fetch and log a given request object
 * @param {Request} request
 */
const isBlogArticle = (request) => {
  const requestArticle = request.url.split('/')[3];
  return url => requestArticle === url;
};

const isBlog = (request) => {
  const requestArticle = request.url.split('/')[3];
  return url => requestArticle.indexOf(url) === 0;
};

async function handleRequest(request) {
  const originHost = request.url.split('/')[2];


  if (originHost === 'shop.nelio.io') {
    // shop nelio is now www
    return Response.redirect(
      `https://www.nelio.io/${request.url.split('/').splice(3).join('/')}`,
      301,
    );
  }

  if (toRedirectToBlog.find(isBlogArticle(request))) {
    // old blog article in www.nelio.io/pitaya is now www.nelio.io/blog/pitaya
    return Response.redirect(
      `https://${originHost}/blog/${request.url.split('/').splice(3).join('/')}`,
      301,
    );
  }

  if (toBlog.find(isBlog(request))) {
    return fetch(new Request(
      `https://${originHost}/${request.url.split('/').splice(3).join('/')}`,
      request,
    ));
  }

  const next = request.url.split('/').splice(3).join('/') || 'index.html';
  const response = await fetch(
    `https://${HOSTS.app}/${next}`,
  );

  const res = response.clone();
  if (res.status === 404) {
    return fetch(
      `https://${HOSTS.app}/index.html`,
    );
  }
  return res;
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

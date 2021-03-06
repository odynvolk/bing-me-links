"use strict";

const _ = require("lodash");
const cheerio = require("cheerio");
const config = require("exp-config");
const rp = require("request-promise");
const sanitizeHtml = require("sanitize-html");
const sleep = require("sleep");

const logger = require("./lib/logger");

const sleepTimeMin = config.sleepTime && config.sleepTime.min || 0;
const sleepTimeMax = config.sleepTime && config.sleepTime.max || 0;

const bingMeLinks = {};

bingMeLinks.searchBaidu = function*(query, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 10) {
    const $ = yield searchRequestBaidu(query, first, proxy);

    const as = $("a.c-showurl");
    _.each(as, (a) => {
      const link = resolveBaiduUrl($(a).attr("href"));
      if (link) links.push(link);
    });

    sleep.sleep(_.random(sleepTimeMin, sleepTimeMax));

    currentPage++;
    nextExists = $(".n").length > 0;

    first += 10;
  }

  return yield links;
};

bingMeLinks.searchBing = function*(query, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 10) {
    const $ = yield searchRequestBing(query, first, proxy);

    const as = $("#b_results .b_algo h2 a");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(sleepTimeMin, sleepTimeMax));

    currentPage++;
    nextExists = $(".sw_next").length > 0;

    first += 50;
  }

  return yield links;
};

bingMeLinks.searchStartPage = function*(query, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 10) {
    const $ = yield searchRequestStartPage(query, first, proxy);

    const as = $(".web_regular_results h3 a");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(sleepTimeMin, sleepTimeMax));

    currentPage++;
    nextExists = $("#nextnavbar").length > 0;

    first += 10;
  }

  return yield links;
};

bingMeLinks.searchYahoo = function*(query, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 15) {
    const $ = yield searchRequestYahoo(query, first, proxy);

    const as = $("#web a.ac-algo");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(sleepTimeMin, sleepTimeMax));

    currentPage++;
    nextExists = $("a.next").length > 0;

    first += 30;
  }

  return yield links;
};

bingMeLinks.searchQwant = function*(query, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 6) {
    const items = yield searchRequestQwant(query, first, proxy);
    _.each(items, (item) => {
      links.push(item.url);
    });

    sleep.sleep(_.random(sleepTimeMin, sleepTimeMax));

    currentPage++;
    nextExists = items.length > 9;

    first += 10;
  }

  return yield links;
};

bingMeLinks.searchWebcrawler = function*(query, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 10) {
    const $ = yield searchRequestWebcrawler(query, first, proxy);

    const as = $(".results a.title");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(sleepTimeMin, sleepTimeMax));

    currentPage++;
    nextExists = $("a.nextprev").length > 0;

    first += 1;
  }

  return yield links;
};

function searchRequestBaidu(query, first = 0, proxy) {
  const opts = {
    url: `http://www.baidu.com/s?pn=${first}&wd=${encodeURIComponent(query)}`,
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (proxy) opts.proxy = proxy;
  logger.info(`Searching Baidu with [${query}] offset ${first}`);

  return rp.get(opts)
    .then((data) => {
      return cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      }));
    });
}

function resolveBaiduUrl(url, proxy) {
  const opts = {
    url: url,
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (proxy) opts.proxy = proxy;

  return rp.get(opts)
    .then((data) => {
      const match = data.match(/"http:\/\/.*"/);
      if (match) return match[0].replace(/"/g, "");
    });
}

function searchRequestBing(query, first = 0, proxy) {
  const opts = {
    url: `http://www.bing.com/search?first=${first}&count=50&q=${encodeURIComponent(query)}`,
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (proxy) opts.proxy = proxy;
  logger.info(`Searching Bing with [${query}] offset ${first}`);

  return rp.get(opts)
    .then((data) => {
      return cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      }));
    });
}

let previousQid;

function searchRequestStartPage(query, first = 0, proxy) {
  const opts = {
    uri: "https://www.startpage.com/do/asearch",
    form: {
      cat: "web",
      cmd: "process_search",
      language: "english",
      query: query,
      startat: first,
      hmb: 1,
      t: "air",
      nj: 0
    },
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (previousQid) opts.form.qid = previousQid;

  if (proxy) opts.proxy = proxy;
  logger.info(`Searching StartPage with [${query}] offset ${first}`);

  return rp.post(opts)
    .then((data) => {
      const $ = cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      }));

      if ($("#nextnavbar").length > 0) {
        const qid = $("#nextnavbar form input[name=\"qid\"]");
        previousQid = qid.attr("value");
      }

      return $;
    });
}

function searchRequestYahoo(query, first = 0, proxy) {
  const opts = {
    url: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}&n=30&b=${first}`,
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (proxy) opts.proxy = proxy;
  logger.info(`Searching Yahoo with [${query}] offset ${first}`);

  return rp.get(opts)
    .then((data) => {
      return Promise.resolve(cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      })));
    });
}

function searchRequestQwant(query, first = 0, proxy) {
  const opts = {
    url: `https://api.qwant.com/api/search/web?count=10&offset=${first}&q=${encodeURIComponent(query)}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:48.0) Gecko/20100101 Firefox/48.0"
    },
    resolveWithFullResponse: true
  };
  if (proxy) opts.proxy = proxy;
  logger.info(`Searching Qwant with [${query}] offset ${first}`);

  return rp.get(opts)
    .then((data) => {
      return Promise.resolve(JSON.parse(data.body).data.result.items);
    });
}

function searchRequestWebcrawler(query, first = 0, proxy) {
  const opts = {
    url: `http://www.webcrawler.com/serp?q=${encodeURIComponent(query)}&page=${first}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:48.0) Gecko/20100101 Firefox/48.0"
    }
  };
  if (proxy) opts.proxy = proxy;
  logger.info(`Searching Webcrawler with [${query}] offset ${first}`);

  return rp.get(opts)
    .then((data) => {
      return cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      }));
    });
}

function randomUserAgent() {
  return _.random([
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/534.48.3 (KHTML, like Gecko) Version/5.1 Safari/534.48.3",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
    "Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.17) Gecko/20110420 Firefox/3.6.17",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media",
    "Opera/9.80 (X11; Linux i686; U; en) Presto/2.9.168 Version/11.50",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:27.0) Gecko/20100101 Firefox/27.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:48.0) Gecko/20100101 Firefox/48.0"
  ]);
}

module.exports = bingMeLinks;

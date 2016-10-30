"use strict";

const _ = require("lodash");
const cheerio = require("cheerio");
const rp = require("request-promise");
const sanitizeHtml = require("sanitize-html");
const sleep = require("sleep");

function* search(engine = "bing", keyword, first = 0, proxy) {
  if (engine === "bing") return yield searchBing(keyword, first, proxy);
  else return yield searchYahoo(keyword, first, proxy);
}

function* searchBing(keyword, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 10) {
    const $ = yield searchRequestBing(keyword, first, proxy);

    const as = $("#b_results .b_algo h2 a");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(2, 5));

    currentPage++;
    nextExists = $(".sw_next").length > 0;

    first += 50;
  }

  return yield links;
}

function* searchYahoo(keyword, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 15) {
    const $ = yield searchRequestYahoo(keyword, first, proxy);

    const as = $("#web a.ac-algo");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(2, 5));

    currentPage++;
    nextExists = $("a.next").length > 0;

    first += 30;
  }

  return yield links;
}

function searchRequestBing(keyword, first = 0, proxy) {
  const opts = {
    url: `http://www.bing.com/search?first=${first}&count=50&q=${encodeURIComponent(keyword)}`,
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (proxy) opts.proxy = proxy;

  return rp.get(opts)
    .then((data) => {
      return cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      }));
    });
}

function searchRequestYahoo(keyword, first = 0, proxy) {
  const opts = {
    url: `https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&n=30&b=${first}`,
    headers: {
      "User-Agent": randomUserAgent()
    }
  };
  if (proxy) opts.proxy = proxy;

  return rp.get(opts)
    .then((data) => {
      return Promise.resolve(cheerio.load(sanitizeHtml(data, {
        allowedTags: false,
        allowedAttributes: false
      })));
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
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
  ]);
}

module.exports.search = search;

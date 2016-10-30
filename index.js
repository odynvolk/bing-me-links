"use strict";

const _ = require("lodash");
const cheerio = require("cheerio");
const rp = require("request-promise");
const sanitizeHtml = require("sanitize-html");
const sleep = require("sleep");

function* search(keyword, first = 0, proxy) {
  const links = [];
  let nextExists = true;
  let currentPage = 0;

  while (nextExists && currentPage < 10) {
    const $ = yield searchRequest(keyword, first, proxy);

    const as = $("#b_results .b_algo h2 a");
    _.each(as, (a) => {
      links.push($(a).attr("href"));
    });

    sleep.sleep(_.random(2, 5));

    currentPage++;
    nextExists = $(".sw_next").length > 0;

    first += 50;
  }

  return links;
}

function searchRequest(keyword, first = 0, proxy) {
  const opts = {
    url: `http://www.bing.com/search?first=${first}&count=50&q=${keyword}`
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

module.exports.search = search;

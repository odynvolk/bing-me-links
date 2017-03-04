"use strict";

const expect = require("chai").expect;
const vo = require("vo");

const bingMeLinks = require("../index");

describe("bing me links", () => {
  it("should return found links for query from baidu", (done) => {
    const query = "javascript";

    const search = vo(bingMeLinks.searchBaidu(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(20);
        expect(response).to.include("http://www.w3school.com.cn/js/");
        expect(response).to.include("http://www.baike.com/wiki/javascript");
        expect(response).to.include("http://bbs.csdn.net/forums/JavaScript/");

        done();
      });
  });

  it("should return found links for query from bing", (done) => {
    const query = "javascript";

    const search = vo(bingMeLinks.searchBing(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(60);
        expect(response).to.include("https://www.javascript.com/");
        expect(response).to.include("http://www.javascriptkit.com/");
        expect(response).to.include("http://knockoutjs.com/");

        done();
      });
  });

  it("should return found links for query with url from bing", (done) => {
    const query = "http://www.thefreedictionary.com/question+mark";

    const search = vo(bingMeLinks.searchBing(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(20);
        expect(response).to.include("http://legal-dictionary.thefreedictionary.com/question+mark");
        expect(response).to.include("https://en.wikipedia.org/wiki/Question_mark");

        done();
      });
  });

  it("should return found links for query from startpage", (done) => {
    const query = "javascript";

    const search = vo(bingMeLinks.searchStartPage(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(60);
        expect(response).to.include("https://www.javascript.com/");
        expect(response).to.include("https://github.com/airbnb/javascript");
        expect(response).to.include("https://codecanyon.net/category/javascript");

        done();
      });
  });

  it("should return found links for query with url from startpage", (done) => {
    const query = "http://www.thefreedictionary.com/question+mark";

    const search = vo(bingMeLinks.searchStartPage(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(20);
        expect(response).to.include("http://www.thefreedictionary.com/punctuation+mark");
        expect(response).to.include("https://en.wikipedia.org/wiki/Leading_question");

        done();
      });
  });
  it("should return found links for query from yahoo", (done) => {
    const query = "javascript";

    const search = vo(bingMeLinks.searchYahoo(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(60);
        expect(response).to.include("https://www.javascript.com/try");
        expect(response).to.include("https://www.npmjs.com/");
        expect(response).to.include("http://javascript.info/");

        done();
      });
  });

  it("should return found links for query from qwant", (done) => {
    const query = "javascript";

    const search = vo(bingMeLinks.searchQwant(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(20);
        expect(response).to.include("https://www.javascript.com/");
        expect(response).to.include("http://www.javascriptkit.com/");
        expect(response).to.include("http://www.w3schools.com/js/js_comparisons.asp");

        done();
      });
  });

});

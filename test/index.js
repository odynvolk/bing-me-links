"use strict";

const expect = require("chai").expect;
const vo = require("vo");

const bingMeLinks = require("../index");

describe("bing me links", () => {
  it("should return found links for keyword from bing", (done) => {
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

  it("should return found links for keyword with url from bing", (done) => {
    const query = "http://www.thefreedictionary.com/question+mark";

    const search = vo(bingMeLinks.searchBing(query));
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(20);
        expect(response).to.include("http://legal-dictionary.thefreedictionary.com/question+mark");
        expect(response).to.include("https://en.wikipedia.org/wiki/Question_mar");

        done();
      });
  });

  it("should return found links for keyword from yahoo", (done) => {
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

});

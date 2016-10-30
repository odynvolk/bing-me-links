"use strict";

const expect = require("chai").expect;
const vo = require("vo");

const bingMeLinks = require("../index.js");

describe("bing me links", () => {
  it("should return found links for keyword", (done) => {
    const keyword = "javascript";

    const search = vo(bingMeLinks.search)(keyword);
    vo(search)
      .then((response) => {
        expect(response).to.exist;
        expect(response.length).to.be.above(60);
        expect(response[1]).to.include("https://www.javascript.com/");
        expect(response).to.include("http://www.javascriptkit.com/");

        done();
      });
  });
});

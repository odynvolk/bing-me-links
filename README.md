# bing-me-links
> A simple node module for links from the Bing, StartPage, Yahoo and Qwant search engines.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm install bing-me-links --save
```

## Usage

BingMeLinks uses the [exp-config](https://github.com/ExpressenAB/exp-config) module for handling its' configuration in JSON files. 

```js

const bingMeLinks = require("bing-me-links");
const vo = require("vo");

const query = "javascript";  
const bing = vo(bingMeLinks.searchBing(query));
vo(bing)
  .then((links) => {
    //=> ["http://whatever1", "http://whatever2"]
  });

const startPage = vo(bingMeLinks.searchStartPage(query));
vo(yahoo)
  .then((links) => {
    //=> ["http://whatever1", "http://whatever2"]
  });
  
const yahoo = vo(bingMeLinks.searchYahoo(query));
vo(yahoo)
  .then((links) => {
    //=> ["http://whatever1", "http://whatever2"]
  });

const qwant = vo(bingMeLinks.searchQwant(query));
vo(qwant)
  .then((links) => {
    //=> ["http://whatever1", "http://whatever2"]
  });  
````

## Running tests

Install dev dependencies:

```sh
$ npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/odynvolk/bing-me-links/issues/new)

## Author

+ [github/odynvolk](https://github.com/odynvolk)

## License

Released under the MIT license.


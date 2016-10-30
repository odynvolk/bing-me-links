# bing-me-links
> A simple node module for links from the Bing and Yahoo search engines.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm bing-me-links --save
```

## Usage

```js

const bingMeLinks = require("bing-me-links");
const vo = require("vo");

const engine = "bing";
const keyword = "javascript";  
const search = vo(bingMeLinks.search(engine, keyword));
vo(search)
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


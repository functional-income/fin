<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# saasify-faas-proxy

> Customizable FaaS proxy which can be deployed in front of a [Saasify](https://saasify.sh) FaaS.

[![NPM](https://img.shields.io/npm/v/saasify-faas-proxy.svg)](https://www.npmjs.com/package/saasify-faas-proxy) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save saasify-faas-proxy
```

## Intro

This package is meant for advanced customization of Saasify FaaS where you want to hide the Saasify API in your own white-labeled API endpoints.

As an example, instead of your API users's referencing: `https://ssfy.sh/username/project/servicePath`, you could have them reference `https://myapi.io/servicePath`.

This is useful for two main reasons:

1.  It's shorter than the default Saasify FaaS URLs.
2.  It doesn't reference Saasify at all so your API can stay on-brand.

It also allows you to add additional custom `servicePath` transformations like forwarding `https://myapi.io` to some default service `https://ssfy.sh/username/project/defaultServicePath`.

## Koa

This package requires you tu use [Koa](https://koajs.com), but it should be easy to convert the logic to work with other Node.js webservers.

## Usage

This example forwards all requests to the default `faasUrl` (`https://ssfy.sh`), without changing the URL `path`.

```js
const Koa = require('koa')
const proxy = require('saasify-faas-proxy')

const app = new Koa()

app.use(proxy())

app.listen(3000)
```

This example forwards all requests to the default `faasUrl` (`https://ssfy.sh`), prefixing the URL `path` via our deployment's identifier `foo/hello-world`.

In this example, `foo` would be the username and `hello-world` would be the project name. The deployment version would implicitly be the `latest` published version.

```js
const Koa = require('koa')
const proxy = require('saasify-faas-proxy')

const app = new Koa()

app.use(
  proxy({
    getPath: (ctx) => `foo/hello-world/${ctx.req.path}`
  })
)

app.listen(3000)
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### [getSaasifyFaasProxy](https://git@github.com/:saasify-sh/saasify/blob/f99fc39640379c6b0554aae66a5eba5485797493/packages/saasify-faas-proxy/index.js#L24-L114)

Koa proxy middleware meant for easily setting up custom API proxies in front of Saasify.

By default, `opts.getPath = (ctx) => ctx.req.path` which uses the incoming request's path
as the target path without any transforms.

-   `opts` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Config options.
    -   `opts.faasUrl` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Base URL to proxy FaaS requests downstream. (optional, default `'https://ssfy.sh'`)
    -   `opts.logger` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Logger (console or winston instancd). (optional, default `console`)
    -   `opts.getPath` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Function to extract the target URL's path from the given request context.

## Related

-   [saasify](https://saasify.sh) - Saasify is the easiest way to launch your own SaaS.

## License

MIT © [Saasify](https://saasify.sh)
[header](_header.md ':include')

# Project Configuration

Project files are named `saasify.json` and should be placed at the root of your project similar to how `package.json` files work.

## Debugging

You can quickly check if your `saasify.json` is valid by running `saasify debug` from within your project's directory.

<p align="center">
  <img src="./_media/undraw/bug_fixing.svg" alt="Debugging" width="200" />
</p>

## Specification

`saasify.json` should be a valid JSON file that conforms to the following TypeScript pseudocode:

> This config may look complicated, but **most of the fields are optional with sensible defaults**. Start with a really simple config that just specifies your `openapi` spec and only customize things further once you're ready to publish your SaaS product.

```ts
class Config {
  // project name
  name?: string

  // Path to a local OpenAPI JSON file or an inline OpenAPI spec
  openapi: string | object

  // optional pricing config
  pricingPlans?: PricingPlan[]

  // optional version info
  saasifyVersion?: number = 1
  version?: string = '0.1.0'

  // optional metadata
  description?: string
  keywords?: string[]

  // optional response header config
  headers?: object
  immutable?: boolean

  // optional external auth provider config (google, github, twitter, etc)
  authProviders?: AuthProviderMap

  // optional saas marketing site config
  saas?: object

  // optional API endpoint config
  services?: Service[]

  // optional stripe webhooks
  webhooks?: Webhook[]

  // optional proxy customization
  // 'passive' => all calls will pass through with metadata as headers
  // 'active' => saasify will block all calls with invalid or inactive subscriptions
  proxyMode?: string = 'active'
}
```

Note that the only **required** property is to point to a valid `openapi` spec.

## Simple Example

```json
{
  "name": "hello-world",
  "openapi": "./hello-world-openapi.json"
}
```

## Advanced Example

This config file customizes the main `/parseIngredients` endpoint, configures Stripe pricing, and customizes the auto-generated SaaS web client with a custom logo, text, and brand colors.

```json
{
  "name": "zestful",
  "openapi": "./zestful-openapi.json",
  "services": [
    {
      "path": "/parseIngredients",
      "immutable": true,
      "examples": [
        {
          "name": "Basic",
          "input": {
            "ingredients": ["2 1/2 tablespoons finely chopped parsley"]
          }
        }
      ]
    }
  ],
  "pricingPlans": [
    {
      "name": "Trial",
      "amount": 0,
      "rateLimit": {
        "requestsInterval": "1d",
        "requestsMaxPerInterval": 30
      }
    },
    {
      "name": "Pro",
      "amount": 0,
      "rateLimit": null,
      "requests": {
        "amount": 2
      }
    }
  ],
  "saas": {
    "name": "Zestful API",
    "heading": "**Parse Recipe Ingredients**",
    "subheading": "An elegant API to turn plain recipe strings into beautiful, structured JSON.",
    "repo": "https://github.com/saasify-sh/zestful",
    "logo": "./media/logo.png",
    "favicon": "./media/favicon.ico",
    "theme": {
      "name": "waves",
      "backgroundImage": "./media/bg.jpg",
      "buttonStyle": "rounded",
      "color": "#ff6e6c",
      "wave": false,
      "gradientDark": false,
      "codeBlockDark": true
    },
    "sections": {
      "navHeader": {
        "displayName": false
      }
    }
  }
}
```

Here is the [live SaaS product](https://zestful.saasify.sh ':target=_blank') generated from this config.

Any local media files pointed to by your config will be automatically uploaded to cloud storage when you run `saasify deploy`.

## Properties

#### name

Project name. If not provided, this will default to the containing folder's name.

`name` cannot contain underscores or dots. Validation regex `/^[a-zA-Z0-9-]{3,64}$/`.

#### openapi

**Required** Path to a local OpenAPI JSON file or an inline OpenAPI spec.

**[OpenAPI](https://swagger.io/specification/ ':target=_blank')** is a formal spec used to define your API's HTTP endpoints, inputs, and outputs. Note that OpenAPI v3 was previously called **Swagger** v1 and v2.

Most of the time you shouldn't have to write these OpenAPI specs yourself or understand really anything about the format.

Refer to our [OpenAPI guide](openapi.md) for more details on generating an OpenAPI spec for your API.

#### pricingPlans

Optional array of `PricingPlan` objects to fully customize the pricing of your product.

Refer to our [pricing guide](pricing.md) for details on pricing configuration including examples of setting up common billing models.

#### saasifyVersion

Optional `string` platform version. The only allowable value is currently `1`.

#### version

Optional `string` project semver version. Will be used by deployments during publishing.

Defaults to `0.1.0`.

#### description

Optional `string` project description.

#### keywords

Optional `string[]` project keywords for SEO.

#### headers

Optional `object` containing additional headers to add to all API responses.

#### immutable

Optional `boolean` (default `false`) specifies that your API's endpoints are all pure and immutable, meaning that they always return the same output for a given input.

Saasify's API gateway is able to aggressively cache `immutable` API responses which translates to a better experience for your customers and less load on your downstream API's servers.

#### authProviders

Optional mapping to customize external OAuth providers that your customers will be able to authenticate with. Some example providers include `google`, `github`, `twitter`, and `spotify`.

This is an advanced feature that's intended to simplify building SaaS products that integrate with third-party services.

Refer to our [providers guide](providers.md) for details.

#### services

Optional array of `Service` objects that customize your API's HTTP endpoints.

Refer to our [services guide](services.md) for details.

#### webhooks

Optional array of `Webhook` objects to hook up to [Stripe's webhooks](https://stripe.com/docs/webhooks).

Saasify will pass through normal, unsigned Stripe webhooks for events that are associated with your project.

If `events` is empty or undefined, it will default to `['customer.subscription.updated']`. This is the most important webhook which will inform you when a customer's subscription has been updated. Most of the time, you'll want to listen for the [subscription status](https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses) changing.

The webhook's `POST` body will have the exact same structure as the original Stripe event, with the addition of Saasify-specific customer info in `event.data.customer`.

```ts
class Webhook {
  url: string
  events?: string[]
}
```

#### saas

Optional customization for the auto-generated SaaS web client.

##### saas.name

Optional display name for the title of the SaaS website.

##### saas.repo

Optional link to the public repository containing the source code for this project.

Note that linking to GitHub issues is a good starting point for providing basic support for your SaaS product.

##### saas.heading

Optional main intro heading in the hero section of the website.

##### saas.subheading

Optional sub-heading in the hero section of the website.

##### saas.logo

Optional path to a local `png` or `svg` image file that will be used as the main logo for the SaaS website.

Path should be relative to the config file. E.g., `'./media/logo.png'`.

##### saas.favicon

Optional path to a local `png` or `ico` image file that will be used as the favicon for the SaaS website.

Path should be relative to the config file. E.g., `'./media/favicon.ico'`.

##### saas.features

Optional array of product features that will be listed on the SaaS website's homepage.

Each feature must have a `name`, `desc`, and `icon`.

The `name` is the feature's title (should be no longer than a few words). The `desc` is the feature's description (should be one to two sentences). The `icon` is the feature's image, preferably in SVG format.

The `icon` may be any of the following:

- A path to a local `png` or `svg` image file that will be uploaded by Saasify.
- A URL to a remote `png` or `svg` image file.

We recommend using [Undraw](https://undraw.co/illustrations ':target=_blank') SVG icons to get started.

##### saas.theme

Optional theme overrides for fine-grained control over the look & feel of the auto-generated SaaS website.

###### saas.theme.name

Name of built-in SaaS theme to use for the SaaS website.

The themes currently available are `waves` (default) and `okta`.

For more info on these themes and theme customization, see [themes](./themes.md).

Note that in the future, we'll be adding much more fine-grained control over theme customization, including a WYSIWYG web editor.

<p align="center">
  <img src="./_media/undraw/product_teardown.svg" alt="Configuration" width="200" />
</p>

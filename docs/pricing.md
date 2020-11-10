[header](_header.md ':include')

# Pricing

> All billing and payment-related features are securely handled by [Stripe](https://stripe.com).

Saasify supports most of Stripe's billing models. This includes:

- Recurring subscriptions
- Multiple pricing plans
- Metered and licensed billing
- Billing based on the number of requests in an invoice period (metered billing)
- Billing based on a flat monthly amount (licensed billing)
- Per-plan pricing tiers for metered billing
- Per-plan rate limits
- Per-plan service enabling / disabling
- Per-plan service customization (e.g., watermark images for users on the free plan)
- Support for coupons
- ...

We've found that these features should cover the vast majority of billing models you may want to use, but if you run into edge cases, please let us know.

## Examples

### Default Pricing

The default pricing for new Saasify projects uses two tiers: **Free** and **Unlimited**.

The default free plan is rate-limited and publicly accessible which is important to let users test out your product as easily as possible. The default free plan's public rate limit is to allow 1000 requests every 1 hour.

The default unlimited plan charges a base monthly fee of `$0.99` USD and then tracks the number of API calls via metered billing, charging `$0.0004` per request.

<p align="center">
  <img src="./_media/pricing-default.jpg" alt="Default pricing" />
</p>

### Licensed Pricing

Here is an example of three pricing plans using what's known as licensed billing. Here, we charge customers subscribed to a plan a set amount every month regardless of usage.

When a customer subscribes to a plan, they receive a **license** to use your API.

<p align="center">
  <img src="./_media/pricing-licensed.jpg" alt="Licensed pricing" />
</p>

### Advanced Pricing

Saasify supports many more advanced pricing models, including mixing base licensing fees with metered billing based on usage.

This is what a more advanced pricing setup could look like.

<p align="center">
  <img src="./_media/pricing-advanced.jpg" alt="Advanced pricing" />
</p>

## Constraints

- Projects must have a minimum of 2 plans and a maximum of 5 plans.
- The first pricing plan must be a publicly accessible free plan.
- All other pricing plans must be paid and require authentication.
- All prices are specified in USD cents.
- Saasify also inherits any constraints required by Stripe.

These constraints were chosen to simplify the most common SaaS use cases, but if you have a use case that conflicts with them, please let us know.

## Schema

Pricing plans are defined by the following TypeScript schema.

```ts
class Config {
  // saasify.json properties...

  // optional pricing config
  pricingPlans?: PricingPlan[]
  enableCoupons?: boolean
}

class PricingPlan {
  // display name of this pricing plan
  name: string

  // by default, this is inferred from the plan name
  slug?: string

  // optional display description
  desc?: string

  // whether or not this plan requires authentication
  auth?: boolean

  // UI-only list of features to display for this plan (supports Markdown)
  features?: string[]

  // base amount to charge per month (licensed billing)
  // 99 = $0.99
  // 499 = $4.99
  // 2999 = $29.99
  amount?: number = 0

  // optional metered billing per request
  requests?: PricingPlanMeteredConfig

  // optional rate limit to enforce on this plan
  rateLimit?: RateLimit
}

class PricingPlanMeteredConfig {
  // amount to charge for each request in USD cents (metered billing)
  // 100 = $1.00
  // 2 = $0.02
  // 0.05 = $0.0005
  amount?: number

  // more advanced per-plan tiered pricing options
  billingScheme?: string = 'per_unit' // | tiered
  tiers?: PricingPlanTier[]
  tiersMode?: string = 'graduated' // | volume
}

class PricingPlanTier {
  unitAmount?: number
  flatAmount?: number
  upTo: string
}

class RateLimit {
  // whether or not this rate limit is enabled
  enabled?: boolean = true

  // interval given either in seconds or as a human-readable string
  requestsInterval?: number | string = '1h'

  // maximum number of requests allowed per rate limit interval
  requestsMaxPerInterval?: number = 1000
}
```

Saasify's pricing plan schemas are based directly on Stripe's subscription billing model.

Note that Saasify uses camelCase for property names whereas Stripe uses snake_case. Converting between the two should be straightforward, but please let us know if you have any questions.

## Coupons

To enable coupons / discounts / promo codes for your product, set `enableCoupons` to `true` in your config and then [create your coupons in your Stripe dashboard](https://stripe.com/docs/billing/subscriptions/discounts).

Saasify will check for verify that a given coupon code exists and is valid on your Stripe account before applying it to a customer subscription.

<p align="center">
  <img src="./_media/undraw/stripe_payments.svg" alt="Stripe" width="200" />
</p>

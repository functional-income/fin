// NOTE: this is just a convenient pseudocode reference that should be kept
// in sync with the corresponding JSON Schema. The JSON Schema is actually
// used as the source of truth for validation within the saasify cli.

class Config {
  // project name
  name?: string

  // URL to your backend API in production
  // (overrides the SAASIFY_BACKEND_URL environment variable)
  backendUrl?: string

  // URL to your backend API in development
  // (overrides the SAASIFY_BACKEND_DEV_URL environment variable)
  backendDevUrl?: string

  // optional pricing config
  pricingPlans?: PricingPlan[]
  enableCoupons?: boolean

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

  // optional path to a local OpenAPI JSON file or a URL to a remote OpenAPI JSON spec
  // that describes your API
  openapi?: string

  // optional API endpoint config
  services?: Service[]

  // optional stripe webhooks
  webhooks?: Webhook[]

  // optional proxy customization
  // 'passive' => all calls will pass through with metadata as headers
  // 'active' => saasify will block all calls with invalid or inactive subscriptions
  proxyMode?: string = 'active'
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

  // number of days to enable a free trial before charging
  trialPeriodDays?: number

  // optional metered billing to charge per request
  requests?: PricingPlanMetricConfig

  // optional metered billing to charge per custom metrics
  metrics?: PricingPlanMetricConfig[]

  // optional rate limit to enforce on this plan
  rateLimit?: RateLimit | string
}

class PricingPlanMetricConfig {
  // amount to charge for each unit in USD cents
  // 100 = $1.00
  // 2 = $0.02
  // 0.05 = $0.0005
  amount?: number

  name?: string
  label?: string
  unitLabel?: string

  // metered vs licensed billing for this metric
  usageType?: string = 'metered' // | licensed

  // more advanced per-plan tiered pricing options
  billingScheme?: string = 'per_unit' // | tiered
  tiers?: PricingPlanTier[]
  tiersMode?: string = 'graduated' // | volume

  // optional rate limit to enforce for this metric
  rateLimit?: RateLimit | string
}

class PricingPlanTier {
  unitAmount?: number
  flatAmount?: number
  upTo: number | string
}

class Service {
  path?: string
  httpMethod?: string = 'GET'

  name?: string
  examples?: Example[]

  headers?: object
  immutable?: boolean

  // whether to report calls to this service (only applicable to metered billing)
  reportUsage?: boolean = true

  // disable or customize this service's rate limits (defaults to the active pricing plan's rate limits)
  rateLimit?: null | RateLimit

  // customize this service depending on the active pricing plan
  pricingPlanConfig?: PricingPlanServiceConfigMap

  // @deprecated
  src?: string
  config?: object
}

class PricingPlanServiceConfigMap {
  // map of pricing plan slug to service config overrides for a given plan
  [plan: string]: PricingPlanServiceConfig
}

class PricingPlanServiceConfig {
  // whether this service is enabled for a given pricing plan
  enabled?: boolean

  // whether to report calls to this service on a given pricing plan (for metered usage)
  reportUsage?: boolean

  // disable or customize this service's rate limits for a given pricing plan
  rateLimit?: null | RateLimit
}

class Example {
  name: string
  description?: string
  input: object
  inputContentType?: string = 'application/json'
  snippet?: Snippet
  output?: any // only necessary if you want to mock output and not use the real output from your API
}

class RateLimit {
  // whether or not this rate limit is enabled
  enabled?: boolean = true

  // interval given either in seconds or as a human-readable string
  requestsInterval?: number | string = '1h'

  // maximum number of requests allowed per rate limit interval
  requestsMaxPerInterval?: number = 1000
}

class SaaS {
  name?: string
  repo?: string
  heading?: string
  subheading?: string
  logo?: string
  logoLight?: string
  favicon?: string
  features?: Feature[]
  sections?: object
  theme?: Theme
  socialShare?: object

  // TODO: deprecate this
  webapp?: string | WebApp
}

class WebApp {
  url: string
  devUrl?: string

  // TODO: in the future, we should support deploying static webapps automatically via ZEIT now
}

class Theme {
  name?: string
}

class Feature {
  name: string
  desc: string
  icon: string
}

class Webhook {
  url: string
  events?: string[]
}

class Snippet {
  language: string
  label: string
  code: string
  exclusive?: boolean = false
}

class AuthProviderMap {
  github?: AuthProviderConfig
  google?: AuthProviderConfig
  spotify?: AuthProviderConfig
  linkedin?: AuthProviderConfig
  twitter?: AuthProviderConfig

  // default auth provider is email & password
  default?: AuthProviderConfig
}

class AuthProviderConfig {
  enabled?: boolean
  required?: boolean

  clientId?: string
  clientSecret?: string

  scopes?: string[]
}

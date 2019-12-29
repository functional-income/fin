// NOTE: this is just a convenient pseudocode reference that should be kept
// in sync with the corresponding JSON Schema. The JSON Schema is actually
// used as the source of truth for validation within the saasify cli.

class Config {
  saasifyVersion?: number = 1
  version?: string = 0.1.0
  name?: string
  description?: string
  package?: string
  language?: string
  amountPerBase?: number = 99
  amountPerRequest?: number = 0.04
  amountPerCompute?: number = 0.34
  amountPerBandwidth?: number = 20
  authRateLimit?: RateLimit
  noAuthRateLimit?: RateLimit
  coupons?: Coupon[]
  build?: object
  env?: object
  saas?: object
  services: Service[]
}

class Service {
  src?: string
  run?: string
  name?: string
  timeout?: number = 0
  examples?: Example[]
  config?: object
  GET?: boolean
  POST?: boolean
  headers?: object
}

class Example {
  name: string
  description?: string
  input: object
  inputContentType?: string = 'application/json'
}

class RateLimit {
  requests?: boolean = true
  requestsInterval?: number = 60000
  requestsMaxPerInterval?: number = 1000
}

class SaaS {
  name?: string
  repo?: string
  heading?: string
  subheading?: string
  logo?: string
  favicon?: string
  features?: Feature[]
  sections?: object
  theme?: Theme
}

class Theme {
  name?: string
  '@primary-color'?: string
  '@section-bg-color'?: string
  '@section-fg-color'?: string
}

class Feature {
  name: string
  desc: string
  icon: string
}

class Coupon {
  name?: string

  currency?: string
  amount_off?: number
  percent_off?: number

  duration: string
  duration_in_months?: number

  redeem_by?: string
  max_redemptions?: number
}

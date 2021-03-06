import React, { Component } from 'react'
import { Section, PricingPlan, theme } from 'react-saasify'

import { DialogManager } from '../../lib/DialogManager'

import styles from './styles.module.css'

const plans = [
  {
    slug: 'early-adopter',
    name: 'Early Adopter',
    isFree: false,
    type: 'primary',
    features: [
      "We're looking to partner with **ambitious indie makers** to help get your SaaS ideas off the ground.",
      'As part of this partnership, we offer **free consulting** from our team of SaaS experts.',
      'You can think of us as a very focused **incubator for API-first SaaS products**.',
      "We're a **fully remote** organization, so location doesn't matter.",
      "We'll help you refine your idea, **launch an MVP**, validate and iterate, and market your product.",
      'This partnership includes a **20% monetization fee**.'
    ],
    desc: 'FREE FOR NOW',
    price: '$0',
    interval: 'mo',
    cta: 'Request Access',
    onClickCTA: (event) => {
      event.preventDefault()
      DialogManager.isSignupDialogOpen = true
    }
  }
  // {
  //   slug: 'custom',
  //   name: 'Custom',
  //   isFree: false,
  //   type: 'secondary',
  //   features: [
  //     '- Hosted, customizable SaaS website',
  //     '- Subscription billing via Stripe',
  //     '- Unlimited users and API calls',
  //     '- Interactive developer docs',
  //     '- Metrics & analytics dashboard',
  //     '- Boilerplate legal docs',
  //     '- **Monetization fee is negotiable**',
  //     '- Our dev team will help build your SaaS',
  //     '- Mentorship from experienced SaaS experts',
  //     '- Custom feature development',
  //     '- Custom marketing campaigns',
  //     '- **The absolute quickest way to launch your SaaS**'
  //   ],
  //   desc: 'GET IN TOUCH',
  //   price: '$0',
  //   interval: 'mo',
  //   cta: 'Get a Quote',
  //   ctaLink: 'mailto:support@saasify.sh?subject=Custom%20SaaS%20Quote'
  // }
]

export class PricingSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='pricing'
        title='Pricing'
        className={theme(styles, 'pricing', className)}
        subtitle={
          <span>
            Free. Unlimited. <b>Pay as you Grow.</b>
          </span>
        }
        {...rest}
      >
        <div className={theme(styles, 'plans')}>
          {plans.map((plan) => (
            <PricingPlan
              className={theme(styles, 'plan')}
              key={plan.slug}
              plan={plan}
            />
          ))}
        </div>

        <div className={theme(styles, 'footer')}>
          <p>
            * The monetization fee covers Stripe fees, hosting costs, unlimited
            users and API requests, global response caching, customer support,
            and continued feature development.
          </p>

          <p>
            * We offer special pricing for open source projects, academic use
            cases, and non-profits. Please{' '}
            <a href='mailto:support@saasify.sh'>get in touch</a> to learn more.
          </p>
        </div>
      </Section>
    )
  }
}

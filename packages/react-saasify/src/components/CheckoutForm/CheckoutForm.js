import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import stripeCouponToString from 'stripe-coupon-to-string'

import {
  StripeProvider,
  Elements,
  CardElement,
  injectStripe
} from 'react-stripe-elements'

import { observer, inject } from 'mobx-react'
import { Button, Icon, Tooltip } from 'lib/antd'
import env from 'lib/env'
import API from 'lib/api'

import styles from './styles.module.css'

const createOptions = (fontSize = 16) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

@inject('auth')
@inject('config')
@observer
export class CheckoutForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    action: PropTypes.node,
    footer: PropTypes.node,
    className: PropTypes.string,
    auth: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
  }

  render() {
    return (
      <StripeProvider apiKey={env.stripePublicKey}>
        <Elements>
          <CheckoutFormImpl {...this.props} />
        </Elements>
      </StripeProvider>
    )
  }
}

@injectStripe
class CheckoutFormImpl extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    stripe: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    action: PropTypes.node,
    footer: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    loading: false
  }

  state = {
    coupon: null
  }

  render() {
    const { config, loading, title, action, footer, className } = this.props
    const { coupon } = this.state

    return (
      <form
        className={theme(styles, 'form', className, theme(styles, 'light'))}
        onSubmit={this._onSubmit}
      >
        {title && <h2 className={theme(styles, 'title')}>{title}</h2>}

        <label className={theme(styles, 'label')}>
          Name
          <input
            className={theme(styles, 'input')}
            name='name'
            type='text'
            placeholder='John Doe'
            required
          />
        </label>

        <label className={theme(styles, 'label')}>
          Card Details
          <Tooltip
            placement='right'
            title='All payment info is securely handled by Stripe.'
          >
            <Icon className={theme(styles, 'detail')} type='question-circle' />
          </Tooltip>
          <CardElement {...createOptions()} />
        </label>

        {config?.deployment?.enableCoupons && (
          <label className={theme(styles, 'label')}>
            Promo Code
            <input
              className={theme(styles, 'input')}
              name='coupon'
              type='text'
              placeholder='Optional'
              onChange={this._onChangeCoupon}
            />
          </label>
        )}

        {coupon &&
          (coupon.valid ? (
            <p>
              <i>{stripeCouponToString(coupon)}</i>
            </p>
          ) : (
            <p>This coupon is no longer valid.</p>
          ))}

        {action && (
          <Button
            type='primary'
            htmlType='submit'
            className={theme(styles, 'submit')}
            loading={loading}
          >
            {action}
          </Button>
        )}

        {footer}
      </form>
    )
  }

  _onSubmit = async (e) => {
    e.preventDefault()

    const name = e.target.name.value
    const coupon = e.target.coupon && e.target.coupon.value
    this.props.onSubmit({ name, coupon, stripe: this.props.stripe })
  }

  _onChangeCoupon = async (e) => {
    const consumerId = this.props.auth.consumer?.id
    const couponId = e.target.value

    try {
      const coupon = await API.getCouponForConsumer(consumerId, couponId)
      this.setState({ coupon })
    } catch (err) {
      console.error(err)
      this.setState({ coupon: null })
    }
  }
}

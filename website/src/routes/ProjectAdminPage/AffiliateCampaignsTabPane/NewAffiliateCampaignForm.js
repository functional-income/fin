import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { observer } from 'mobx-react'
import { observable } from 'mobx'
import {
  API,
  Button,
  Form,
  Input,
  InputNumber,
  Tooltip,
  notification
} from 'react-saasify'

import styles from './styles.module.css'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

@Form.create()
@observer
export class NewAffiliateCampaignForm extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
  }

  _campaign = {
    name: '',
    coupon: '',
    commissionPercent: 50,
    maxCommissionsPerCustomer: 0,
    referralExpirationWindowDays: 30,
    pendingCommissionWindowDays: 30
  }

  @observable
  _loading = false

  render() {
    const { form, onCancel } = this.props
    const { getFieldDecorator } = form

    return (
      <Form className={styles.form} onSubmit={this._onSubmit}>
        <Form.Item label='Campaign Name' {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please enter a name for your campaign.'
              }
            ],
            initialValue: this._campaign.name
          })(<Input placeholder='Launch Campaign' />)}
        </Form.Item>

        <Form.Item label='Commission' {...formItemLayout}>
          {getFieldDecorator('commissionPercent', {
            rules: [
              {
                required: true,
                message: 'Please enter a commission percentage.'
              }
            ],
            initialValue: this._campaign.commissionPercent
          })(
            <InputNumber
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
            />
          )}
        </Form.Item>

        <Form.Item
          label={
            <Tooltip title='Max number of commissions per customer. Set to 0 to apply commissions for lifetime of customers.'>
              Max Commissions
            </Tooltip>
          }
          {...formItemLayout}
        >
          {getFieldDecorator('maxCommissionsPerCustomer', {
            rules: [
              {
                required: true,
                message: 'This field is required.'
              }
            ],
            initialValue: this._campaign.maxCommissionsPerCustomer
          })(<InputNumber min={0} />)}
        </Form.Item>

        <Form.Item
          label={
            <Tooltip title='Number of days before a visit from an affiliate link expires when considering whether to attribute that customer to the affiliate.'>
              Referral Expiration
            </Tooltip>
          }
          {...formItemLayout}
        >
          {getFieldDecorator('referralExpirationWindowDays', {
            rules: [
              {
                required: true,
                message: 'This field is required.'
              }
            ],
            initialValue: this._campaign.referralExpirationWindowDays
          })(<InputNumber min={1} />)}
        </Form.Item>

        <Form.Item label='Coupon' {...formItemLayout}>
          {getFieldDecorator('coupon', {
            initialValue: this._campaign.coupon
          })(<Input placeholder='OPTIONAL_STRIPE_COUPON' />)}
        </Form.Item>

        <div className={styles.footer}>
          <Button type='secondary' onClick={onCancel}>
            Cancel
          </Button>

          <Button
            type='primary'
            htmlType='submit'
            className={styles.submit}
            onClick={this._onSubmit}
          >
            Create Campaign
          </Button>
        </div>
      </Form>
    )
  }

  _onSubmit = (event) => {
    event.preventDefault()

    this.props.form.validateFields((err, data) => {
      if (!err) {
        this._loading = true

        API.createAffiliateCampaign({
          ...data,
          project: this.props.project.id
        })
          .then((result) => {
            notification.success({
              message: `Created Affiliate Campaign.`,
              description: (
                <>
                  <p>Your new affiliate campaign is now live: {result.name}.</p>

                  <p>
                    Share your campaign's URL with potential affiliates to get
                    started.{' '}
                    <a
                      href={result.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {result.url}
                    </a>
                  </p>
                </>
              )
            })

            this.props.onDone(result)
          })
          .catch((err) => {
            console.error(err)
            this._loading = false

            notification.error({
              message: 'Error creating campaign',
              description: err?.response?.data?.error || err.message
            })
          })
      }
    })
  }
}

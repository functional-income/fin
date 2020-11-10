import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { observer, inject } from 'mobx-react'
import { Button, Popconfirm, Table, Tag, Tooltip, notification } from 'lib/antd'

import { Section } from '../Section'

import API from 'lib/api'
import theme from 'lib/theme'

import styles from './styles.module.css'

@inject('auth')
@observer
export class SubscriptionSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    copiedTextToClipboard: false,
    isLoadingUnsubscribe: false,
    isLoadingRefreshAuthToken: false
  }

  componentWillUnmount() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  render() {
    const { auth, ...rest } = this.props

    const {
      copiedTextToClipboard,
      isLoadingUnsubscribe,
      isLoadingRefreshAuthToken
    } = this.state

    const hasSubscription =
      auth.consumer &&
      auth.consumer.enabled &&
      auth.consumer.plan &&
      auth.consumer.plan !== 'free'

    const columns = [
      {
        title: 'Plan',
        dataIndex: 'plan',
        render: (plan) => <Link to='/pricing'>{plan}</Link>
      },
      auth.consumer?.status && {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => (
          <Tooltip title='Stripe subscription status'>
            <span>{status}</span>
          </Tooltip>
        )
      },
      {
        title: 'Enabled',
        dataIndex: 'enabled',
        render: (enabled) =>
          enabled ? (
            <Tag color='blue'>Enabled</Tag>
          ) : (
            <Tag color='magenta'>Disabled</Tag>
          )
      },
      {
        title: 'Created',
        dataIndex: 'subscribed',
        render: (date) => (date ? format(new Date(date), 'MM/dd/yyyy') : '')
      },
      {
        title: 'Auth Token',
        key: 'token',
        render: () =>
          auth.consumer?.enabled &&
          auth.consumer?.token && (
            <Tooltip
              placement='top'
              title={copiedTextToClipboard ? 'Copied!' : 'Copy to clipboard'}
            >
              <Button
                className={styles.tokenButton}
                type='primary'
                ghost
                onClick={this._onClickCopyToken}
              >
                {`${auth.consumer.token.substr(0, 8)} ...`}
              </Button>
            </Tooltip>
          )
      },
      {
        title: 'Refresh Auth Token',
        key: 'refresh',
        render: () => (
          <Fragment>
            {auth.consumer?.enabled && auth.consumer?.token && (
              <Button
                type='ghost'
                icon='reload'
                loading={isLoadingRefreshAuthToken}
                onClick={this._onClickRefreshAuthToken}
                block
              >
                Refresh Token
              </Button>
            )}
          </Fragment>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: () => (
          <Fragment>
            {hasSubscription ? (
              <Popconfirm
                placement='top'
                title='Are you sure you want to cancel your subscription?'
                okText='Yes'
                cancelText='No'
                onConfirm={this._onConfirmUnsubscribe}
              >
                <Button type='default' loading={isLoadingUnsubscribe} block>
                  Cancel
                </Button>
              </Popconfirm>
            ) : (
              <Button type='primary' href='/pricing' block>
                Upgrade
              </Button>
            )}
          </Fragment>
        )
      }
    ].filter(Boolean)

    const dataSource = [
      {
        id: auth.user.id,
        enabled: !!auth.consumer?.enabled,
        status: auth.consumer?.status,
        plan: auth.consumer?.plan || 'free',
        subscribed: auth.consumer?.createdAt
      }
    ]

    return (
      <Section id='subscription' title='Subscription' {...rest}>
        <div className={theme(styles, 'body')}>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataSource}
            pagination={false}
            locale={{
              emptyText: 'No Subscription'
            }}
          />
        </div>
      </Section>
    )
  }

  _onClickCopyToken = () => {
    const { token } = this.props.auth.consumer
    copyTextToClipboard(token)

    this.setState({ copiedTextToClipboard: true })
    this._clearCopyTimeout()
    this._copyTimeout = setTimeout(this._onCopyTimeout, 3000)
  }

  _onCopyTimeout = () => {
    this._clearCopyTimeout()
    this.setState({ copiedTextToClipboard: false })
  }

  _clearCopyTimeout = () => {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  _onConfirmUnsubscribe = () => {
    this.setState({ isLoadingUnsubscribe: true })

    API.removeConsumer(this.props.auth.consumer).then(
      () => {
        this.props.auth.consumer = null

        notification.success({
          message: 'Subscription canceled',
          duration: 0,
          description: (
            <span>
              <p>
                Your subscription has been canceled. If you have any pending
                charges, they will be billed at the end of the current billing
                cycle.
              </p>

              <p>It may take a few minutes for this change to take effect.</p>
            </span>
          )
        })

        this.setState({ isLoadingUnsubscribe: false })
      },
      (err) => {
        console.warn(err)

        notification.error({
          message: 'Error canceling subscription',
          description: err?.response?.data?.error || err.error?.message,
          duration: 0
        })

        this.setState({ isLoadingUnsubscribe: false })
      }
    )
  }

  _onClickRefreshAuthToken = () => {
    this.setState({ isLoadingRefreshAuthToken: true })

    API.updateConsumer(this.props.auth.consumer).then(
      (consumer) => {
        this.props.auth.consumer = consumer

        notification.success({
          message: 'Auth token refreshed',
          description: (
            <span>
              <p>
                Your auth token has been refreshed. Your old token is now
                invalid.
              </p>

              <p>It may take a few minutes for this change to take effect.</p>
            </span>
          )
        })

        this.setState({ isLoadingRefreshAuthToken: false })
      },
      (err) => {
        console.warn(err)

        notification.error({
          message: 'Error refreshing auth token',
          description: err?.response?.data?.error || err.error?.message,
          duration: 0
        })

        this.setState({ isLoadingRefreshAuthToken: false })
      }
    )
  }
}

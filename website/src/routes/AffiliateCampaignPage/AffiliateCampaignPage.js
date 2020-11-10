import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { API, Loading } from 'react-saasify'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import { Paper, NavHeader } from 'components'

import styles from './styles.module.css'

@withRouter
@observer
export class AffiliateCampaignPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  }

  @observable
  _campaign = null

  @observable
  _affiliate = null

  @observable
  _loading = true

  @observable
  _error = false

  componentDidMount() {
    this._reset()
  }

  render() {
    return (
      <div className={styles.page}>
        <NavHeader fixed />

        <div className={styles.content}>
          <Paper className={styles.body}>
            {this._loading ? (
              <Loading />
            ) : this._error ? (
              <p>Error loading affiliate campaign.</p>
            ) : (
              <>
                <h2>Affiliate Campaign {this._campaign.name}</h2>
              </>
            )}
          </Paper>
        </div>
      </div>
    )
  }

  async _reset() {
    const { match } = this.props
    const { campaignId } = match.params

    this._loading = true

    try {
      const [campaign, affiliate] = await Promise.all([
        API.getAffiliateCampaign(campaignId, {
          populate: 'project'
        }),
        API.getAffiliateByCampaign(campaignId).catch(() => {
          // assume affiliate doesn't exist
          // TODO: handle other possible errors
          return null
        })
      ])
      console.log('campaign', campaign)
      console.log('affiliate', affiliate)

      this._campaign = campaign
      this._affiliate = affiliate
      this._error = false
      this._loading = false
    } catch (err) {
      console.error(err)

      this._error = true
      this._loading = false
    }
  }
}

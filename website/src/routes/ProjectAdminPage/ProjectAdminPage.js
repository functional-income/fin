import React, { Component } from 'react'
import { API, theme } from 'react-saasify'
import { withRouter } from 'react-router'
import { withTracker } from 'lib/with-tracker'
import { observer } from 'mobx-react'
import { observable, computed } from 'mobx'
import { Route, Switch } from 'react-router-dom'

import {
  NavHeader,
  NavFooter,
  Paper,
  ScrollToTopOnMount,
  Section,
  TabBar
} from 'components'

// import { AuditLogTabPane } from './AuditLogTabPane'
import { AnalyticsTabPane } from './AnalyticsTabPane'
import { HomeTabPane } from './HomeTabPane'
import { CustomersTabPane } from './CustomersTabPane'
import { SettingsTabPane } from './SettingsTabPane'
import { AffiliateCampaignsTabPane } from './AffiliateCampaignsTabPane'

import styles from './styles.module.css'

@withTracker
@withRouter
@observer
export class ProjectAdminPage extends Component {
  @observable
  _project = null

  @observable
  _loading = true

  @observable
  _error = false

  @computed get _name() {
    if (this._project) {
      const { lastPublishedDeployment } = this._project

      if (lastPublishedDeployment?.saas?.name) {
        return lastPublishedDeployment?.saas?.name
      }

      return this._project.name
    }

    return 'Project'
  }

  get _projectId() {
    const { namespace, projectName } = this.props.match.params
    return `${namespace}/${projectName}`
  }

  componentDidMount() {
    this._reset()
  }

  render() {
    const { match } = this.props

    const tabs = [
      {
        key: 'overview',
        label: 'Overview',
        to: match.url,
        icon: { type: 'home' }
      },
      {
        key: 'analytics',
        label: 'Analytics',
        to: `${match.url}/analytics`,
        icon: { type: 'dashboard' }
      },
      // {
      //   key: 'audit-log',
      //   label: 'Audit Log',
      //   to: `${match.url}/audit-log`,
      //   icon: { type: 'schedule' }
      // },
      {
        key: 'customers',
        label: 'Customers',
        to: `${match.url}/customers`,
        icon: { type: 'user' }
      },
      {
        key: 'affiliate-campaigns',
        label: 'Affiliates',
        to: `${match.url}/affiliate-campaigns`,
        icon: { type: 'link' }
      },
      {
        key: 'settings',
        label: 'Settings',
        to: `${match.url}/settings`,
        icon: { type: 'setting' }
      }
    ]

    return (
      <div className={theme(styles, 'project-admin-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <Section
          id='project-admin'
          title={this._name}
          className={theme(styles, 'body')}
          contentClassName={theme(styles, 'content')}
        >
          <Paper className={theme(styles, 'paper')}>
            <TabBar tabs={tabs} />

            {this._project && (
              <Switch>
                <Route path={`${match.path}`} exact>
                  <HomeTabPane project={this._project} />
                </Route>

                <Route path={`${match.path}/analytics`} exact>
                  <AnalyticsTabPane project={this._project} />
                </Route>

                {/* <Route path={`${match.path}/audit-log`} exact>
                  <AuditLogTabPane project={this._project} />
                </Route> */}

                <Route path={`${match.path}/customers`} exact>
                  <CustomersTabPane project={this._project} />
                </Route>

                <Route path={`${match.path}/affiliate-campaigns`} exact>
                  <AffiliateCampaignsTabPane project={this._project} />
                </Route>

                <Route path={`${match.path}/settings`} exact>
                  <SettingsTabPane project={this._project} />
                </Route>
              </Switch>
            )}
          </Paper>
        </Section>

        <NavFooter />
      </div>
    )
  }

  async _reset() {
    const projectId = this._projectId

    // currently unused since we need to fetch the project directly in order to
    // receive private fields
    // if (EventEmitter.project && EventEmitter.project.id === projectId) {
    //   this._project = EventEmitter.project
    //   EventEmitter.project = null
    //
    //   this._loading = false
    //   this._error = false
    // }

    this._project = null
    this._loading = true
    this._error = false

    try {
      const project = await API.getProject(projectId, {
        populate: 'lastPublishedDeployment'
      })
      console.log('project', project)

      this._project = project
      this._loading = false
    } catch (err) {
      console.error(err)

      this._error = true
      this._loading = false
    }
  }
}

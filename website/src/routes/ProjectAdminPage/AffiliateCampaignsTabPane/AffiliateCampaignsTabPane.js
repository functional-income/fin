import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { format } from 'date-fns'

import { API, Button, Modal, Table, Tag, Tooltip } from 'react-saasify'
import { TabPane } from 'components'

import { NewAffiliateCampaignForm } from './NewAffiliateCampaignForm'

import styles from './styles.module.css'

@observer
export class AffiliateCampaignsTabPane extends Component {
  columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (timestamp) => (
        <Tooltip
          title={format(new Date(timestamp), 'MM/dd/yyyy HH:mm:ss OOOO')}
        >
          {format(new Date(timestamp), 'MM/dd/yyyy')}
        </Tooltip>
      )
    },
    {
      title: 'Commission',
      dataIndex: 'commissionPercent',
      render: (commissionPercent) => `${commissionPercent}%`
    },
    {
      title: 'Coupon',
      dataIndex: 'coupon'
    },
    {
      title: 'Affiliates',
      dataIndex: 'numAffiliates'
    },
    {
      title: 'Visitors',
      dataIndex: 'numVisitors'
    },
    {
      title: 'Leads',
      dataIndex: 'numLeads'
    },
    {
      title: 'Conversions',
      dataIndex: 'numConversions'
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
      title: 'URL',
      dataIndex: 'url',
      width: 'calc(min(15em, 15vw))',
      ellipsis: true,
      render: (url, campaign) => {
        if (campaign.enabled) {
          return (
            <Tooltip title={url}>
              <a href={url} target='_blank' rel='noopener noreferrer'>
                {url}
              </a>
            </Tooltip>
          )
        } else {
          return null
        }
      }
    }
  ]

  state = {
    data: [],
    pagination: {
      pageSize: 25
    },
    loading: true,
    isOpenAddNewCampaignModal: false
  }

  componentDidMount() {
    this._fetch()
  }

  render() {
    const { project } = this.props
    const { data, pagination, loading, isOpenAddNewCampaignModal } = this.state

    return (
      <TabPane className={styles.body}>
        <h4 className={styles.h4}>Affiliate Campaigns</h4>

        <div className={styles.actions}>
          <Button
            type='secondary'
            icon='reload'
            loading={loading}
            onClick={this._onRefresh}
          >
            Refresh
          </Button>

          <Button type='primary' onClick={this._onOpenAddNewCampaignModal}>
            Add New Campaign
          </Button>
        </div>

        <Table
          columns={this.columns}
          rowKey='id'
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this._handleTableChange}
          locale={{
            emptyText: 'No Campaigns'
          }}
        />

        <Modal
          title='Add New Campaign'
          visible={isOpenAddNewCampaignModal}
          footer={null}
          width={800}
          onCancel={this._onCloseAddNewCampaignModal}
        >
          {isOpenAddNewCampaignModal && (
            <NewAffiliateCampaignForm
              project={project}
              onCancel={this._onCloseAddNewCampaignModal}
              onDone={this._onDoneAddNewCampaignModal}
            />
          )}
        </Modal>
      </TabPane>
    )
  }

  _handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({ pagination: pager })

    this._fetch({
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  _fetch = async (params = {}) => {
    let { data, pagination } = this.state

    if (params.reset) {
      data = []
      params.page = 0
    }

    const offset = (params.page || 0) * pagination.pageSize

    if (!params.page || offset >= data.length) {
      this.setState({ loading: true })

      const params = { limit: 25, offset }

      try {
        const items = await API.listAffiliateCampaigns({
          ...params,
          where: {
            project: this.props.project.id
          }
        })

        const pagination = { ...this.state.pagination }

        if (!items.length) {
          pagination.total = data.length
        } else {
          data = data.concat(items)
          pagination.total = data.length
        }

        this.setState({
          loading: false,
          data,
          pagination
        })
      } catch (err) {
        console.error('error loading', err)
        this.setState({
          loading: false
        })
      }
    }
  }

  _onRefresh = () => {
    this._fetch({ reset: true })
  }

  _onOpenAddNewCampaignModal = () => {
    this.setState({ isOpenAddNewCampaignModal: true })
  }

  _onDoneAddNewCampaignModal = () => {
    this._onRefresh()
    this._onCloseAddNewCampaignModal()
  }

  _onCloseAddNewCampaignModal = () => {
    this.setState({ isOpenAddNewCampaignModal: false })
  }
}

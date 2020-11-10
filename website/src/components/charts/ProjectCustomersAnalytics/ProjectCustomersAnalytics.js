import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { format } from 'date-fns'
import { Select, Tag, Tooltip } from 'react-saasify'
import cs from 'classnames'

import { DataChart } from '../DataChart'
import { DataStatistic } from '../DataStatistic'
import { DataTable } from '../DataTable'
import { getQuery } from './ProjectCustomersQuery'

import styles from './styles.module.css'

const dateRanges = [
  'All time',
  'Today',
  'Yesterday',
  'This week',
  'This month',
  'This quarter',
  'This year',
  'Last 7 days',
  'Last 30 days',
  'Last week',
  'Last month',
  'Last quarter',
  'Last year'
]
const granularities = ['hour', 'day', 'week']

const metrics = [
  {
    label: 'Customers',
    measures: ['Consumers.count'],
    numberRenderProps: {
      precision: 0
    }
  }
]

const measureToLabel = {
  'Consumers.count': 'Customers'
}

@observer
export class ProjectCustomersAnalytics extends React.Component {
  @observable
  _dateRange = 'All time'

  @observable
  _granularity = 'week'

  @observable
  _metric = 'Customers'

  render() {
    const { project, ...rest } = this.props
    if (!project) {
      return
    }

    const selectedMetric = metrics.find(
      (metric) => metric.label === this._metric
    )

    return (
      <div {...rest}>
        <h4 className={styles.h4}>Customer Analytics</h4>

        <div className={styles.header}>
          <div className={styles.dateRange}>
            <div className={styles.label}>Time Range</div>

            <Select value={this._dateRange} onChange={this._onChangeDateRange}>
              {dateRanges.map((dateRange) => (
                <Select.Option key={dateRange} value={dateRange}>
                  {dateRange}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className={styles.granularity}>
            <div className={styles.label}>Granularity</div>

            <Select
              value={this._granularity}
              onChange={this._onChangeGranularity}
            >
              {granularities.map((granularity) => (
                <Select.Option key={granularity} value={granularity}>
                  {granularity}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.metrics}>
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={cs(
                styles.metric,
                metric.label === this._metric && styles.activeMetric
              )}
              onClick={() => {
                this._metric = metric.label
              }}
            >
              <h4 className={styles.label}>{metric.label}</h4>

              <DataStatistic
                {...metric.numberRenderProps}
                query={getQuery({
                  projectId: project.id,
                  dateRange: this._dateRange,
                  measures: metric.measures
                })}
              />
            </div>
          ))}
        </div>

        <div className={styles.chart}>
          <DataChart
            {...selectedMetric.lineRenderProps}
            measureToLabel={measureToLabel}
            query={getQuery({
              projectId: project.id,
              dateRange: this._dateRange,
              granularity: this._granularity,
              measures: selectedMetric.measures
            })}
          />
        </div>

        <div className={styles.chart}>
          <h4 className={styles.h4}>Customers</h4>

          <DataTable
            rowKey='Consumers.id'
            query={getQuery({
              projectId: project.id,
              dateRange: this._dateRange,
              granularity: null,
              dimensions: [
                'Consumers.id',
                'Consumers.createdAt',
                'Consumers.username',
                'Consumers.email',
                'Consumers.plan',
                'Consumers.status',
                'Consumers.enabled'
              ],
              order: {
                'Consumers.createdAt': 'desc'
              }
            })}
            totalMeasure='Consumers.count'
            columnTransforms={{
              'Consumers.id': (c) => ({
                ...c,
                render: (id) => <pre>{id}</pre>
              }),
              'Consumers.createdAt': (c) => ({
                ...c,
                render: (v) => format(new Date(v), 'yyyy-MM-dd h:mm a')
              }),
              'Consumers.status': (c) => ({
                ...c,
                render: (status) =>
                  status && (
                    <Tooltip title='Stripe subscription status'>
                      <span>{status}</span>
                    </Tooltip>
                  )
              }),
              'Consumers.enabled': (c) => ({
                ...c,
                render: (enabled) =>
                  enabled ? (
                    <Tag color='blue'>Enabled</Tag>
                  ) : (
                    <Tag color='magenta'>Disabled</Tag>
                  )
              })
            }}
          />
        </div>
      </div>
    )
  }

  _onChangeDateRange = (dateRange) => {
    this._dateRange = dateRange
  }

  _onChangeGranularity = (granularity) => {
    this._granularity = granularity
  }
}

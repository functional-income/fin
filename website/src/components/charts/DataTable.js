import React from 'react'
import { Table } from 'react-saasify'
import { QueryRenderer } from '@cubejs-client/react'
import { cubejsApi } from 'lib/cube'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

const transformTableColumns = (columns, columnTransforms) => {
  return columns
    .map((c) => {
      const column = {
        ...c,
        title: c.shortTitle || c.title,
        dataIndex: c.key
      }

      if (columnTransforms) {
        const transform = columnTransforms[c.key]
        if (transform) {
          return transform(column)
        }
      }

      return column
    })
    .filter(Boolean)
}

const tableRender = ({
  resultSet,
  columnTransforms,
  rowKey = 'id',
  ...rest
}) => {
  let columns = []
  let dataSource = []

  if (resultSet) {
    columns = transformTableColumns(resultSet.tableColumns(), columnTransforms)
    dataSource = resultSet.tablePivot()
  }

  return (
    <Table
      pagination={false}
      bordered
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      {...rest}
    />
  )
}

@observer
export class DataTable extends React.Component {
  @observable
  _pagination = {
    pageSize: this.props.pageSize || 10,
    current: 1
  }

  _lastResultSet = null

  render() {
    const { query, totalMeasure, pageSize, ...rest } = this.props

    return (
      <QueryRenderer
        queries={{
          totals: {
            ...query,
            measures: [totalMeasure],
            dimensions: [],
            timeDimensions: query.timeDimensions?.map((dimension) => ({
              ...dimension,
              granularity: null
            }))
          },
          main: {
            ...query,
            limit: this._pagination.pageSize,
            offset: this._pagination.pageSize * (this._pagination.current - 1)
          }
        }}
        cubejsApi={cubejsApi}
        render={this._renderTable(tableRender, {
          ...rest,
          pagination: this._pagination,
          onChange: this._onChange
        })}
      />
    )
  }

  _renderTable = (Component, props) => ({ resultSet, error, loadingState }) => {
    if (error) {
      // TODO
      return error.toString()
    } else if (resultSet) {
      if (resultSet.totals) {
        const totals = resultSet.totals.totalRow()
        if (totals) {
          this._pagination.total = totals[this.props.totalMeasure] || 0
        } else {
          this._pagination.total = 0
        }
      }

      if (resultSet.main) {
        this._lastResultSet = resultSet.main
      }
    }

    return (
      <Component
        resultSet={this._lastResultSet}
        {...props}
        loading={loadingState.isLoading}
      />
    )
  }

  _onChange = (pagination) => {
    this._pagination.current = pagination.current
  }
}

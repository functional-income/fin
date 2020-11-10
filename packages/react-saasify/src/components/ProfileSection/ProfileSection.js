import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { format } from 'date-fns'
import { observer, inject } from 'mobx-react'
import { Avatar, Table } from 'lib/antd'

import { Section } from '../Section'

import theme from 'lib/theme'

import styles from './styles.module.css'

@inject('auth')
@observer
export class ProfileSection extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const { auth, ...rest } = this.props

    const columns = [
      {
        title: 'Avatar',
        dataIndex: 'image',
        render: (image) =>
          image ? (
            <Avatar src={image} className={theme(styles, 'avatar')} />
          ) : (
            <Avatar icon='user' className={theme(styles, 'avatar')} />
          )
      },
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Email',
        dataIndex: 'email'
      },
      {
        title: 'Joined',
        dataIndex: 'joined',
        render: (date) => format(new Date(date), 'MM/dd/yyyy')
      }
    ].filter(Boolean)

    const dataSource = [
      {
        id: auth.user.id,
        username: auth.user.username,
        email: auth.user.email,
        image: auth.user.image,
        joined: auth.user.createdAt
      }
    ]

    return (
      <Section id='profile' title='Profile' {...rest}>
        <div className={theme(styles, 'body')}>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataSource}
            pagination={false}
          />
        </div>
      </Section>
    )
  }
}

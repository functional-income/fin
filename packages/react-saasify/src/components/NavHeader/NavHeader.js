import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import raf from 'raf'

import { observer, inject } from 'mobx-react'

import { CTAButton } from '../CTAButton'
import { Button, Dropdown, Icon, Menu } from 'lib/antd'
import { Logo } from '../Logo'

import Link from './Link'
import styles from './styles.module.css'

const isServer = typeof window === 'undefined'

@inject('config')
@inject('auth')
@observer
export class NavHeader extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    fixed: PropTypes.bool
  }

  static defaultProps = {
    fixed: false
  }

  state = {
    attached: isServer || window.scrollY > 0,
    expanded: false,
    width: isServer ? 1000 : window.clientWidth || window.innerWidth
  }

  componentDidMount() {
    if (!isServer) {
      window.addEventListener('scroll', this._onScroll)
      window.addEventListener('resize', this._onResize)
      this._onReset()
    }
  }

  componentWillUnmount() {
    if (!isServer) {
      window.removeEventListener('scroll', this._onScroll)
      window.removeEventListener('resize', this._onResize)
    }

    if (this._resetRaf) {
      raf.cancel(this._resetRaf)
      this._resetRaf = null
    }
  }

  render() {
    const { auth, config, fixed, className } = this.props
    const { attached, expanded, width } = this.state

    // TODO: some of these config.* properties should be moved to the navHeader section
    const sections = config?.deployment?.saas?.sections

    let actions = config.header?.actions || []
    if (typeof actions === 'function') {
      actions = actions({ config, auth, fixed, attached })
    }

    const actionsMenu = actions && auth.isAuthenticated && (
      <Menu onClick={(e) => console.log(e)}>
        {actions.map((action, index) => {
          if (typeof action === 'function') {
            action = action({ config, auth, fixed, attached })
            if (!action) return null
          }

          const { key, to, href, label, icon, ...rest } = action
          const validKey = action.key || action.to || action.href || index

          return (
            <Menu.Item key={validKey}>
              <Link key={validKey} to={to} href={href} {...rest}>
                {icon && <Icon type={icon} className={styles.icon} />}
                {label}
              </Link>
            </Menu.Item>
          )
        })}
      </Menu>
    )

    return (
      <header
        className={theme(
          styles,
          'nav-header',
          attached || fixed ? theme(styles, 'attached') : null,
          expanded ? theme(styles, 'expanded') : null,
          className
        )}
        style={{
          background:
            attached || fixed || expanded
              ? theme['@section-fg-color']
              : 'transparent',
          paddingBottom: expanded ? 24 : undefined
        }}
      >
        <div className={theme(styles, 'content')}>
          <div className={theme(styles, 'primary')}>
            <Link to='/'>
              {config.logo && sections?.navHeader?.logo !== false && (
                <span className={theme(styles, 'logo-image')}>
                  <Logo className={theme(styles, 'logo')} />
                  <Logo
                    className={theme(
                      styles,
                      'logo',
                      theme(styles, 'logo--light')
                    )}
                    light
                  />
                </span>
              )}

              {config.logo &&
                config?.header?.displayName !== false &&
                sections?.navHeader?.displayName !== false && (
                  <span className={theme(styles, 'logo-text')}>
                    {config?.deployment?.saas?.headerName
                      ? config.deployment.saas.headerName
                      : config?.name}
                  </span>
                )}
            </Link>

            <div className={theme(styles, 'burger')}>
              <Button
                type='secondary'
                onClick={this._onToggleMainNav}
                icon='menu'
              />
            </div>
          </div>

          <div className={theme(styles, 'content-body')}>
            <div className={theme(styles, 'links')}>
              {config.header.links.map((link) => {
                if (typeof link === 'function') {
                  link = link({ config, auth, fixed, attached })
                  if (!link) return null
                }

                const { label, icon, ...rest } = link

                return (
                  <Link key={link.to || link.href} {...rest}>
                    {label}
                  </Link>
                )
              })}
            </div>

            {actions ? (
              (expanded && width < 768) || !auth.isAuthenticated ? (
                <div className={theme(styles, 'actions')}>
                  {actions.map((action, index) => {
                    if (typeof action === 'function') {
                      action = action({ config, auth, fixed, attached })
                      if (!action) return null
                    }

                    const { key, to, href, label, icon, ...rest } = action
                    const validKey =
                      action.key || action.to || action.href || index
                    const isLink = to || href
                    const className = theme(styles, 'action')
                    const buttonClassName = isLink ? null : className

                    const button = (
                      <CTAButton
                        key={validKey}
                        inline
                        className={buttonClassName}
                        {...rest}
                      >
                        {label}
                      </CTAButton>
                    )

                    if (to || href) {
                      return (
                        <Link
                          className={className}
                          key={validKey}
                          to={to}
                          href={href}
                        >
                          {button}
                        </Link>
                      )
                    } else {
                      return button
                    }
                  })}
                </div>
              ) : (
                <Dropdown
                  placement='bottomRight'
                  trigger={['click']}
                  overlay={actionsMenu}
                >
                  <Button type='secondary'>
                    <Icon type='user' />
                    {auth.user.username}
                    <Icon type='down' />
                  </Button>
                </Dropdown>
              )
            ) : null}
          </div>
        </div>
      </header>
    )
  }

  _onToggleMainNav = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  _onScroll = () => {
    if (!this._resetRaf) {
      this._resetRaf = raf(this._onReset)
    }
  }

  _onResize = () => {
    if (!this._resetRaf) {
      this._resetRaf = raf(this._onReset)
    }
  }

  _onReset = () => {
    this._resetRaf = null

    this.setState({
      attached: isServer || window.scrollY > 0,
      width: window.clientWidth || window.innerWidth
    })
  }
}

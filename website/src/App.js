import React, { Component } from 'react'
import BodyClassName from 'react-body-classname'

import { toJS } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import {
  AuthManager,
  ThemeManager,
  AuthenticatedRoute,
  theme,

  // third-party auth flow
  AuthGitHubPage,
  AuthGooglePage,
  AuthSpotifyPage,
  AuthLinkedInPage,
  AuthTwitterPage,
  AuthStripePage
} from 'react-saasify'

import { SignupDialog } from './components'

import {
  // marketing site
  HomePage,
  AboutPage,
  PricingPage,
  TermsPage,
  PrivacyPage,
  NotFoundPage,

  // beta pages
  OnboardingPage,
  EmailConfirmedPage,

  // auth flow
  LoginPage,
  LogoutPage,
  SignupPage,

  // maker webapp
  DashboardPage,
  ProjectAdminPage,
  AccountPage,
  AffiliateCampaignPage
} from './routes'

import { DialogManager } from './lib/DialogManager'
import logo from './assets/logo-horiz-white@4x.png'

import styles from './styles.module.css'

const saasifyConfig = {
  name: 'Saasify',
  logo,
  ctaText: 'Request Access',
  ctaTextInline: 'Request Access',
  header: {
    displayName: false,
    links: [
      {
        label: 'About',
        to: '/about'
      },
      {
        label: 'Docs',
        href: 'https://docs.saasify.sh/#/README'
      },
      {
        label: 'Pricing',
        to: '/pricing'
      },
      {
        label: 'GitHub',
        href: 'https://github.com/saasify-sh/saasify',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    ],
    actions: ({ auth }) =>
      auth.isAuthenticated
        ? [
            {
              to: '/dashboard',
              type: 'primary',
              icon: 'home',
              label: 'Dashboard'
            },
            {
              to: '/account',
              type: 'secondary',
              icon: 'setting',
              label: 'Account'
            },
            {
              to: '/logout',
              type: 'secondary',
              icon: 'logout',
              label: 'Log out'
            }
          ]
        : [
            {
              to: '/login',
              type: 'secondary',
              label: 'Log in'
            },
            {
              type: 'primary',
              onClick: () => {
                DialogManager.isSignupDialogOpen = true
              },
              label: 'Request Access'
            }
          ]
  },
  footer: {
    columns: [
      {
        label: 'Product',
        links: [
          {
            label: 'Home',
            to: '/'
          },
          {
            label: 'Docs',
            href: 'https://docs.saasify.sh/#/README'
          },
          {
            label: 'Pricing',
            to: '/pricing'
          },
          {
            label: 'Use Cases',
            href: 'https://docs.saasify.sh/#/use-cases'
          },
          {
            label: 'Examples',
            href: 'https://docs.saasify.sh/#/examples'
          }
        ]
      },
      {
        label: 'Company',
        links: [
          {
            label: 'About',
            to: '/about'
          },
          {
            label: 'Blog',
            href: 'https://blog.saasify.sh'
          },
          {
            label: 'Resources',
            href: 'https://docs.saasify.sh/#/resources'
          },
          {
            label: 'Terms',
            to: '/terms'
          },
          {
            label: 'Privacy',
            to: '/privacy'
          }
        ]
      },
      {
        label: 'Support',
        links: [
          {
            label: 'GitHub',
            href: 'https://github.com/saasify-sh/saasify',
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          {
            label: 'Slack',
            href: 'https://slack.saasify.sh'
          },
          {
            label: 'Email',
            href: 'mailto:support@saasify.sh'
          }
        ]
      }
    ]
  }
}

@observer
export default class App extends Component {
  render() {
    const { isSignupDialogOpen } = DialogManager
    const fonts = toJS(ThemeManager.theme.fonts)
    const themeClassName = `theme-${ThemeManager.theme['@name']}`

    return (
      <Router>
        <Provider auth={AuthManager} config={saasifyConfig}>
          <Helmet>
            {fonts &&
              fonts.map((font) => (
                <link
                  key={font}
                  href={`https://fonts.googleapis.com/css?family=${font}&display=swap`}
                  rel='stylesheet'
                />
              ))}
          </Helmet>

          <BodyClassName className={theme(styles, themeClassName, styles.body)}>
            <>
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route path='/about' component={AboutPage} />
                <Route path='/pricing' component={PricingPage} />

                <Route path='/terms' component={TermsPage} />
                <Route path='/privacy' component={PrivacyPage} />

                <Route path='/onboarding' component={OnboardingPage} />
                <Route path='/email-confirmed' component={EmailConfirmedPage} />

                <Route path='/login' component={LoginPage} />
                <Route path='/signup' component={SignupPage} />
                <AuthenticatedRoute path='/logout' component={LogoutPage} />

                <Route path='/auth/github' component={AuthGitHubPage} />
                <Route path='/auth/google' component={AuthGooglePage} />
                <Route path='/auth/spotify' component={AuthSpotifyPage} />
                <Route path='/auth/linkedin' component={AuthLinkedInPage} />
                <Route path='/auth/twitter' component={AuthTwitterPage} />
                <Route path='/auth/stripe' component={AuthStripePage} />

                <AuthenticatedRoute
                  path='/affiliate-campaigns/:campaignId'
                  component={AffiliateCampaignPage}
                />

                <AuthenticatedRoute
                  exact
                  path='/dashboard'
                  component={DashboardPage}
                />

                <AuthenticatedRoute
                  path='/maker/projects/:namespace/:projectName'
                  component={ProjectAdminPage}
                />

                <AuthenticatedRoute path='/account' component={AccountPage} />

                <Route component={NotFoundPage} />
              </Switch>

              {isSignupDialogOpen && (
                <SignupDialog
                  isOpen={isSignupDialogOpen}
                  onClose={this._onCloseSignupDialog}
                />
              )}
            </>
          </BodyClassName>
        </Provider>
      </Router>
    )
  }

  _onOpenSignupDialog = () => {
    DialogManager.isSignupDialogOpen = true
  }

  _onCloseSignupDialog = () => {
    DialogManager.isSignupDialogOpen = false
  }
}

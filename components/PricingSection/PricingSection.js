import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class PricingSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Pricing
              </h1>

              <div className={styles.subtitle}>
                Free. Unlimited. <b>Pay as you Grow.</b>
              </div>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}

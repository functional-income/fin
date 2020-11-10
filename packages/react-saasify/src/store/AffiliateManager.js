import { observable } from 'mobx'

import LocalStore from 'store/LocalStore'

const AFFILIATE_STORE_KEY = 'SaasifyAffiliate'

class AffiliateManagerClass {
  @observable
  affiliate = null

  @observable
  isBootstrapping = true

  constructor() {
    this._bootstrappingP = new Promise((resolve) => {
      LocalStore.get(AFFILIATE_STORE_KEY).then(
        (affilite) => {
          this.affilite = affilite
          this.isBootstrapping = false
          setTimeout(resolve)
        },
        () => {
          this.isBootstrapping = false
          setTimeout(resolve)
        }
      )
    })
  }

  get bootstrappingP() {
    return this._bootstrappingP
  }

  async init(via) {
    if (!via) {
      const url = new URL(window.location.href)
      via = url.searchParams.get('via')

      if (!via) {
        return
      }
    }

    console.log(`AffiliateManager.init [${via}]`)
    await this._bootstrappingP

    await LocalStore.set(AFFILIATE_STORE_KEY, via)
    this.affiliate = via
  }
}

export const AffiliateManager = observable(new AffiliateManagerClass())

window.affiliate = AffiliateManager
export default AffiliateManager

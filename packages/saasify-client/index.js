'use strict'

const axios = require('axios')
const qs = require('qs')
const isBuffer = require('is-buffer')
const isStream = require('is-stream')

const defaultBaseUrl = 'https://api.saasify.sh'

module.exports = class SaasifyClient {
  constructor(opts = {}) {
    const { baseUrl = defaultBaseUrl, user, token, teamId, teamSlug } = opts

    this._baseUrl = baseUrl
    this._user = user
    this._token = token
    this._teamId = teamId
    this._teamSlug = teamSlug

    if (!!user !== !!token) {
      throw new Error('user must be passed if and only if token is passed')
    }

    this._reset()
  }

  get isAuthenticated() {
    return !!this._token
  }

  get user() {
    return this._user
  }

  get token() {
    return this._token
  }

  get teamId() {
    return this._teamId
  }

  get teamSlug() {
    return this._teamSlug
  }

  get baseUrl() {
    return this._baseUrl
  }

  set user(user) {
    this._user = user
    this._reset()
  }

  set token(token) {
    this._token = token
    this._reset()
  }

  set teamId(teamId) {
    this._teamId = teamId
    this._reset()
  }

  // --------------------------------------------------------------------------
  // Auth
  // --------------------------------------------------------------------------

  async signin(data) {
    return this._request({
      url: `/1/auth/signin`,
      method: 'put',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async signup(data) {
    return this._request({
      url: `/1/auth/signup`,
      method: 'post',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async signupForBeta(data) {
    return this._request({
      url: `/1/auth/signup-for-beta`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async authWithGitHub(data) {
    return this._request({
      url: `/1/auth/github`,
      method: 'put',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async getGoogleAuthUrl(params = {}) {
    return this._request({
      url: `/1/auth/google/url`,
      method: 'get',
      params
    }).then((res) => res.data)
  }

  async authWithGoogle(data, params) {
    return this._request({
      url: `/1/auth/google`,
      method: 'put',
      params: {
        ...this._params,
        ...params
      },
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async authWithStripe(data) {
    return this._request({
      url: `/1/auth/stripe`,
      method: 'put',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async authWithSpotify(data) {
    return this._request({
      url: `/1/auth/spotify`,
      method: 'put',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async authWithLinkedIn(data) {
    return this._request({
      url: `/1/auth/linkedin`,
      method: 'put',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async getTwitterAuthUrl(params = {}) {
    return this._request({
      url: `/1/auth/twitter/url`,
      method: 'get',
      params
    }).then((res) => {
      console.log(res)
      return res.data
    })
  }

  async authWithTwitter(data) {
    return this._request({
      url: `/1/auth/twitter`,
      method: 'put',
      params: this._params,
      data
    })
      .then((res) => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        this._teamId = undefined
        this._teamSlug = undefined
        return data
      })
  }

  async signout() {
    this._token = null
    this._user = null
    this._teamId = undefined
    this._teamSlug = undefined
  }

  // --------------------------------------------------------------------------
  // Users
  // --------------------------------------------------------------------------

  async getMe() {
    return this._request({
      url: `/1/me`,
      params: this._params
    }).then((res) => res.data)
  }

  async updateMe(data) {
    return this._request({
      url: `/1/me`,
      method: 'put',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Projects
  // --------------------------------------------------------------------------

  async createProject(data) {
    return this._request({
      url: `/1/projects`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async getProject(id, opts = {}) {
    return this._request({
      url: `/1/projects/${id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async updateProject(project) {
    return this._request({
      url: `/1/projects/${project.id}`,
      method: 'put',
      params: this._params,
      data: project
    }).then((res) => res.data)
  }

  // enables stripe connect for a given project
  // (must be the project's owner and must have stripe connect enabled on your acct)
  async enableStripeConnectForProject(project) {
    return this._request({
      url: `/1/projects/connect/${project.id}`,
      method: 'put',
      params: this._params
    }).then((res) => res.data)
  }

  async getProjectByAlias(alias, opts = {}) {
    return this._request({
      url: `/1/projects/alias/${alias}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async listProjects(opts) {
    return this._request({
      url: `/1/projects`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Providers
  // --------------------------------------------------------------------------

  async getProvider(project) {
    return this._request({
      url: `/1/projects/provider/${project.id}`,
      params: this._params
    }).then((res) => res.data)
  }

  async updateProvider(project) {
    return this._request({
      url: `/1/projects/provider/${project.id}`,
      params: this._params,
      method: 'put'
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Consumers
  // --------------------------------------------------------------------------

  async createConsumer(data) {
    return this._request({
      url: `/1/consumers`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async getConsumer(id) {
    return this._request({
      url: `/1/consumers/${id}`,
      params: this._params
    }).then((res) => res.data)
  }

  async removeConsumer(consumer) {
    return this._request({
      url: `/1/consumers/${consumer.id}`,
      params: this._params,
      method: 'delete'
    }).then((res) => res.data)
  }

  async updateConsumer(consumer) {
    return this._request({
      url: `/1/consumers/${consumer.id}`,
      params: this._params,
      method: 'put'
    }).then((res) => res.data)
  }

  async getConsumerByProject(projectId, opts) {
    return this._request({
      url: `/1/consumers/projects/${projectId}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async listConsumers(opts) {
    return this._request({
      url: `/1/consumers`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async getCouponForConsumer(consumerId, couponId, opts) {
    return this._request({
      url: `/1/consumers/${consumerId}/coupons/${couponId}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Deployments
  // --------------------------------------------------------------------------

  // TODO: possibly increase the timeout for this HTTP call until the backend
  // deployment initialization is changed to be async
  async createDeployment(data) {
    return this._request({
      url: `/1/deployments`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async getDeployment(id, opts = {}) {
    return this._request({
      url: `/1/deployments/${id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async updateDeployment(deployment) {
    return this._request({
      url: `/1/deployments/${deployment.id}`,
      method: 'put',
      params: this._params,
      data: deployment
    }).then((res) => res.data)
  }

  async removeDeployment(id) {
    return this._request({
      url: `/1/deployments/${id}`,
      method: 'delete',
      params: this._params
    }).then((res) => res.data)
  }

  async listDeployments(where = {}, opts = {}) {
    return this._request({
      url: `/1/deployments`,
      params: {
        ...this._params,
        where,
        ...opts
      }
    }).then((res) => res.data)
  }

  async publishDeployment(deploymentId, data) {
    return this._request({
      url: `/1/deployments/publish/${deploymentId}`,
      method: 'put',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Teams
  // --------------------------------------------------------------------------

  async createTeam(data) {
    return this._request({
      url: `/1/teams`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async getTeam(id, opts = {}) {
    return this._request({
      url: `/1/teams/${id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async updateTeam(team) {
    return this._request({
      url: `/1/teams/${team.id}`,
      method: 'put',
      params: this._params,
      data: team
    }).then((res) => res.data)
  }

  async removeTeam(teamId) {
    return this._request({
      url: `/1/teams/${teamId}`,
      params: this._params,
      method: 'delete'
    }).then((res) => res.data)
  }

  async listTeams(where = {}, opts = {}) {
    return this._request({
      url: `/1/teams`,
      params: {
        ...this._params,
        where,
        ...opts
      }
    }).then((res) => res.data)
  }

  async inviteTeamMember(teamId, member) {
    return this._request({
      url: `/1/teams/${teamId}/members`,
      method: 'post',
      params: this._params,
      data: member
    }).then((res) => res.data)
  }

  async updateTeamMember(teamId, member) {
    return this._request({
      url: `/1/teams/${teamId}/members/${member.username}`,
      method: 'put',
      params: this._params,
      data: member
    }).then((res) => res.data)
  }

  async removeTeamMember(teamId, member) {
    return this._request({
      url: `/1/teams/${teamId}/members/${member.username}`,
      params: this._params,
      method: 'delete'
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Logs
  // --------------------------------------------------------------------------

  async getLogs(identifier, opts) {
    return this._request({
      url: `/1/logs`,
      method: 'put',
      params: this._params,
      data: {
        ...opts,
        identifier
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Billing
  // --------------------------------------------------------------------------

  async getBilling() {
    return this._request({
      url: `/1/billing`,
      params: this._params
    }).then((res) => res.data)
  }

  async getBillingAccount() {
    return this._request({
      url: `/1/billing/account`,
      params: this._params
    }).then((res) => res.data)
  }

  async getBillingDashboard() {
    return this._request({
      url: `/1/billing/dashboard`,
      params: this._params
    }).then((res) => res.data)
  }

  async listBillingSources() {
    return this._request({
      url: `/1/billing/sources`,
      params: this._params
    }).then((res) => res.data)
  }

  async addBillingSource(data) {
    return this._request({
      url: `/1/billing/sources`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async removeBillingSource(id) {
    return this._request({
      url: `/1/billing/sources/${id}`,
      method: 'delete',
      params: this._params
    }).then((res) => res.data)
  }

  async setDefaultBillingSource(id) {
    return this._request({
      url: `/1/billing/sources/${id}/set-default`,
      method: 'put',
      params: this._params
    }).then((res) => res.data)
  }

  async listBillingInvoices(opts = {}) {
    return this._request({
      url: `/1/billing/invoices`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async listBillingInvoicesForConsumer(consumer, opts = {}) {
    return this._request({
      url: `/1/billing/invoices/${consumer.id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async listBillingUsageForConsumer(consumer, opts = {}) {
    return this._request({
      url: `/1/billing/usage/${consumer.id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Secrets
  // --------------------------------------------------------------------------

  async listSecrets() {
    return this._request({
      url: `/1/secrets`,
      params: this._params
    }).then((res) => res.data)
  }

  async addSecret(name, value) {
    return this._request({
      url: `/1/secrets`,
      method: 'post',
      params: this._params,
      data: {
        name,
        value
      }
    }).then((res) => res.data)
  }

  async removeSecret(name) {
    return this._request({
      url: `/1/secrets/${name}`,
      method: 'delete',
      params: this._params
    }).then((res) => res.data)
  }

  async renameSecret(name, newName) {
    return this._request({
      url: `/1/secrets/${name}`,
      method: 'put',
      params: this._params,
      data: {
        name: newName
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Search
  // --------------------------------------------------------------------------

  async searchProjects(query, opts = {}) {
    return this._request({
      url: `/1/search/projects`,
      params: {
        ...this._params,
        query,
        ...opts
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Affiliate Campaigns
  // --------------------------------------------------------------------------

  async createAffiliateCampaign(data) {
    return this._request({
      url: `/1/affiliate-campaigns`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async getAffiliateCampaign(id, opts) {
    return this._request({
      url: `/1/affiliate-campaigns/${id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async updateAffiliateCampaign(campaign) {
    return this._request({
      url: `/1/affiliate-campaigns/${campaign.id}`,
      params: this._params,
      method: 'put'
    }).then((res) => res.data)
  }

  async listAffiliateCampaigns(opts) {
    return this._request({
      url: `/1/affiliate-campaigns`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Affiliates
  // --------------------------------------------------------------------------

  async createAffiliate(data) {
    return this._request({
      url: `/1/affiliates`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  async getAffiliate(id, opts) {
    return this._request({
      url: `/1/affiliates/${id}`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async getAffiliateByCampaign(campaignId, opts) {
    return this._request({
      url: `/1/affiliate-campaigns/${campaignId}/affiliate`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  async updateAffiliate(affiliate) {
    return this._request({
      url: `/1/affiliates/${affiliate.id}`,
      params: this._params,
      method: 'put'
    }).then((res) => res.data)
  }

  async listAffiliates(opts) {
    return this._request({
      url: `/1/affiliates`,
      params: {
        ...this._params,
        ...opts
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Uploads
  // --------------------------------------------------------------------------

  /**
   * @param {File|Buffer|Stream} input - Data to upload
   * - [File](https://developer.mozilla.org/en-US/docs/Web/API/File) in browser
   * - [Buffer](https://nodejs.org/api/buffer.html) in Node.js
   * - [Stream](https://nodejs.org/api/stream.html) in Node.js
   */
  async upload(input, opts = {}) {
    let type = opts.type
    let name = opts.name

    if (!isBuffer(input) && !isStream(input)) {
      type = input.type
      name = input.name
    }

    if (!type) {
      throw new Error('upload requires a valid mime type')
    }

    const { key, uploadUrl, url } = await this._getUploadRequest({
      type,
      name
    })

    console.log('upload', { key, uploadUrl, url, type, name })

    await axios.put(uploadUrl, input, {
      onUploadProgress: (event) => {
        if (opts.onUploadProgress) {
          const progress = Math.floor((event.loaded * 100) / event.total)
          opts.onUploadProgress(progress)
        }
      },
      headers: {
        'content-type': type
      }
    })

    await this._request({
      url: `/1/uploads/finalize`,
      method: 'put',
      data: {
        key
      }
    })

    return url
  }

  async _getUploadRequest(data) {
    return this._request({
      url: `/1/uploads`,
      method: 'post',
      params: this._params,
      data
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  _reset() {
    const headers = {}
    this._params = {}

    if (this._token) {
      headers.authorization = `Bearer ${this._token}`
    }

    if (this._teamId) {
      this._params.teamId = this._teamId
    }

    this._request = axios.create({
      baseURL: this._baseUrl,
      responseType: 'json',
      headers,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      }
    })
  }
}

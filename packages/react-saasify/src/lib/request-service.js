import axios from 'axios'

export default async ({ auth, service, data }) => {
  const authHeaders = {}

  if (auth.consumer) {
    authHeaders.authorization = auth.consumer.token
  }

  const payload = {}

  if (service.POST) {
    payload.data = data
  } else {
    payload.params = data
  }

  const options = {
    method: service.POST ? 'POST' : 'GET',
    url: service.url,
    headers: {
      'content-type': 'application/json',
      ...authHeaders
    },
    responseType: 'arraybuffer',
    ...payload
  }

  try {
    const response = await axios.request(options)

    // NB not used until we add 429 to options via validateStatus method
    if (response.status === 429) {
      return { hitRateLimit: true }
    }

    const outputContentType = response.headers['content-type']
    let output

    if (outputContentType.startsWith('application/json')) {
      output = JSON.parse(Buffer.from(response.data, 'binary').toString())
    } else if (outputContentType.startsWith('image')) {
      output = Buffer.from(response.data, 'binary').toString('base64')
    }

    return {
      output,
      outputContentType,
      response
    }
  } catch (e) {
    return { outputError: e.message }
  }
}

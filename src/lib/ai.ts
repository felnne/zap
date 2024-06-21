import axios from 'axios'

import { getSetting } from '@/lib/data'

export async function summariseAbstract(abstract: string): Promise<string> {
  /*
   * Summarises a long abstract to a shorter length summary
   *
   * Uses the OpenAI proxy to avoid exposing the API key to the client.
   */
  const url = getSetting('app_open_ai_proxy_endpoint')
  const model = getSetting('app_open_ai_model')
  const prompt =
    "You help create discovery metadata, that is information that allows prospective users of data products to evaluate whether they’ll meet their needs (what it’s about, recent enough, in the right area, etc.). Specifically you will be provided with abstracts for products and you will return (with no other information) a summary version that is 2 (3 at most) short sentences for use in search results. NEVER say who manages/sponsors a product or start with variations of 'This dataset provides'."

  const data = {
    model: model,
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: abstract,
      },
    ],
  }

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data.choices[0].message.content
  } catch (error: any) {
    throw new Error('OpenAI Proxy error')
  }
}

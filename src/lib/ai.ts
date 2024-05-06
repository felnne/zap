import OpenAI from 'openai'

import { getSetting } from '@/lib/data'

export async function summariseAbstract(abstract: string): Promise<string> {
  /*
   * Summarises a long abstract to a shorter length summary
   */
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_API_KEY || import.meta.env.VITE_OPENAI_API_KEY_ZAP,
    dangerouslyAllowBrowser: true,
    organization: getSetting('open_ai_org'),
    project: getSetting('open_ai_project'),
  })

  const systemPrompt =
    'You help create discovery metadata, that is information that allows prospective users of data products to evaluate whether they’ll meet their needs (what it’s about, recent enough, in the right area, etc.). Specifically you will be provided with abstracts for products and you will return (with no other information) a summary version that is 3 sentences at most for use in search results.'

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: abstract },
    ],
    model: 'gpt-3.5-turbo',
  })

  return completion.choices[0].message.content || '[AI Error]'
}

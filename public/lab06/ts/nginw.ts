/**
    Accepts text {content} extracted from HTML.
    Uses regex to parse and transform that content into JSON.
    Returns a JSON object of that content.
*/

import { Entry } from './models.js'

export function renderFeed (entry: Entry) : string {
  return `
        <div class="title-bar side-header"><a href="javascript:goHome();">${entry.dt}</a></div>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${entry.movie}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${entry.song}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <br /><br />
    `
}

export function renderBody (entry: Entry) : string {
  return `
    <span class="category highlight">${entry.category.toUpperCase()}</span>
    <div class="title">${entry.title}</div>
    <div class="title-date">🕒 ${entry.dt}</div>
    ${entry.body}
  `
}

export function parseText (editorText: string) : {} {
  console.log(editorText)

  const patterns = [
    // /<id>(?<id>.*)<\/id>/,
    // /<author>(?<author>.*)<\/author>/,
    // /<uid>(?<uid>.*)<\/uid>/,
    // /<email>(?<email>.*)<\/email>/,
    // /<song>(?<song>.*)<\/song>/,
    // /<movie>(?<movie>.*)<\/movie>/,
    /<title>(?<title>.*)<\/title>/,
    // /<category>(?<category>.*)<\/category>/,
    // /<tags>(?<tags>.*)<\/tags>/,
    // /<datetime>(?<tags>.*)<\/datetime>/,
    /<\/datetime>(?<body>.*)$/
  ]

  const re = new RegExp(patterns.map(pattern => pattern.source).join('.*'), 'gs')
  const matches = re.exec(editorText)

  return {
    title: matches?.groups?.title?.trim() ?? 'Untitled.',
    content: matches?.groups?.body?.trim() ?? 'No body.'
  }
}

export function transformText (content: string) : Entry {
  // We assume:
  // The first line will always be our movie trailer and
  // the second line will always be our song.

  // let re = /<movie>(.*)<\/movie>.*<song>(.*)<\/song>/gs // "global" and "single line"
  // let matches = re.exec(content)
  // console.log('>> matches', matches)
  // const movie: string = matches?.[1] ?? 'No movie specified.'
  // const song: string = matches?.[2] ?? 'No song specified.'

  // let re = /<movie>(?<movie>.*)<\/movie>.*<song>(?<song>.*)<\/song>/gs // "global" and "single line"
  // let matches = re.exec(content)
  // console.log('>> match', matches)
  // const movie: string = matches?.groups?.movie ?? 'No movie specified.'
  // const song: string = matches?.groups?.song ?? 'No song specified.'

  const patterns = [
    /<movie>(?<movie>.*)<\/movie>/,
    /<song>(?<song>.*)<\/song>/,
    /<title>(?<title>.*)<\/title>/,
    /<category>(?<category>.*)<\/category>/,
    /<\/datetime>(?<body>.*)$/
  ]

  const re = new RegExp(patterns.map(pattern => pattern.source).join('.*'), 'gs')
  // console.log('>> re:', re)

  const matches = re.exec(content)
  // console.log('>> match', matches)
  const dt = new Date()
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }

  let body: string = matches?.groups?.body?.trim() ?? 'No body.'

  /**
   * Get the word count of the body.
  */
  const wordCount: number = body.split(/\s+/).length
  // console.log('>>>> body split arr:', body.split(' '))

  /**
   *  Perform the formatting.
  */
  body = body.replaceAll(/### .*?\n\n/g, match => `<h3>${match.slice(4, -2)}</h3>`)
  // console.log('>>> BODY:', body)
  // body = body.replaceAll(/_.*_/g, '<em>$&</em>') // Almost works but doesn't eliminate the underscores. :(
  body = body.replaceAll(/_.*?_/g, match => `<em>${match.slice(1, -1)}</em>`)
  body = body.replaceAll(/\*\*.*?\*\*/g, match => `<strong>${match.slice(2, -2)}</strong>`) // Use RegEx-- but need to escape!
  body = body.replaceAll(/\n/g, '<br />')
  // body = '<br />' + body

  // console.log('>> BODY:', body)

  const entry: Entry = {
    movie: matches?.groups?.movie ?? 'No movie specified.',
    song: matches?.groups?.song ?? 'No song specified.',
    title: matches?.groups?.title ?? 'Untitled',
    category: matches?.groups?.category ?? 'Uncategorized',
    dt: dt.toLocaleTimeString('en-us', options),
    body: body,
    wordCount: wordCount
  }
  // console.log('>> article', article)
  return entry
}

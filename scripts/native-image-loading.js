'use strict'

const cheerio = require('cheerio')

hexo.extend.filter.register('after_render:html', html => {
  const $ = cheerio.load(html, { decodeEntities: false })
  const postCovers = $('#recent-posts img.post-bg')

  $('img').each((_, image) => {
    const element = $(image)
    if (!element.attr('decoding')) element.attr('decoding', 'async')
    if (!element.attr('loading')) element.attr('loading', 'lazy')
  })

  if (postCovers.length > 0) {
    const firstCover = postCovers.first()
    firstCover.attr('loading', 'eager')
    firstCover.attr('fetchpriority', 'high')
  }

  return $.html()
}, 99999)

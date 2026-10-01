const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const cheerio = require('cheerio')

const publicIndex = path.join(__dirname, '..', 'public', 'index.html')
const html = fs.readFileSync(publicIndex, 'utf8')
const $ = cheerio.load(html)
const generatedPostDir = path.join(__dirname, '..', 'public', 'posts')
const generatedPostFile = fs.readdirSync(generatedPostDir).find(file => file.endsWith('.html'))
assert.ok(generatedPostFile, 'expected at least one generated article page')
const articleHtml = fs.readFileSync(path.join(generatedPostDir, generatedPostFile), 'utf8')

const isRemote = value => /^(?:https?:)?\/\//i.test(value || '')

test('post covers expose real image URLs without a JavaScript-only placeholder', () => {
  const covers = $('#recent-posts img.post-bg').toArray()
  assert.ok(covers.length > 0, 'expected generated homepage post covers')

  for (const cover of covers) {
    const element = $(cover)
    const src = element.attr('src') || ''
    assert.ok(!src.startsWith('data:image/gif'), `cover still uses a transparent placeholder: ${element.attr('alt')}`)
    assert.equal(element.attr('data-lazy-src'), undefined, `cover still depends on JavaScript lazyload: ${element.attr('alt')}`)
    assert.match(element.attr('loading') || '', /^(?:eager|lazy)$/, `cover has no native loading policy: ${element.attr('alt')}`)
  }
})

test('remote scripts never block the critical parsing path', () => {
  const blockingRemoteScripts = $('script[src]').toArray().filter(script => {
    const element = $(script)
    if (!isRemote(element.attr('src'))) return false
    return element.attr('async') === undefined &&
      element.attr('defer') === undefined &&
      element.attr('type') !== 'module'
  }).map(script => $(script).attr('src'))

  assert.deepEqual(blockingRemoteScripts, [])
})

test('Pace is local and bounded by readable and PJAX completion events', () => {
  const paceScripts = $('script[src]').toArray()
    .map(script => $(script).attr('src'))
    .filter(src => /pace/i.test(src || ''))

  assert.ok(paceScripts.length > 0, 'Pace visual progress indicator must remain enabled')
  assert.ok(paceScripts.every(src => !isRemote(src)), `Pace is still remote: ${paceScripts.join(', ')}`)

  const paceBridge = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'pace-bridge.js'), 'utf8')
  assert.match(paceBridge, /DOMContentLoaded/)
  assert.doesNotMatch(paceBridge, /Pace\.done/)
  assert.match(paceBridge, /pace-active/)
  assert.match(paceBridge, /pjax:complete/)
  assert.match(paceBridge, /pjax:error/)
  assert.match(html, /restartOnPushState:false/)
})

test('the generated site does not request visitor IP geolocation', () => {
  assert.equal($('script[src="/js/notice.js"]').length, 0)
  assert.doesNotMatch(html, /apis\.map\.qq\.com\/ws\/location\/v1\/ip/)
})

test('the approved visual and reading components remain present', () => {
  assert.match(html, /id=["']swiper_container["']/, 'homepage recommendation carousel disappeared')
  assert.ok($('#canvas_nest').length > 0, 'canvas background effect disappeared')
  assert.ok($('script[src*="fancybox"]').length > 0, 'Fancybox image viewer disappeared')
  assert.match(html, /new Pjax\s*\(/, 'PJAX navigation disappeared')
  assert.ok($('.waline-comment-count').length > 0, 'Waline comment counts disappeared')
  assert.ok($('link[href="/vendor/cardlistpost.min.css"]').length > 0, 'double-row card styling disappeared')
  assert.doesNotMatch(html, /Butterfly-double-row-display/, 'double-row cards still depend on a remote stylesheet')
})

test('the recommendation carousel is configured for the homepage only', () => {
  assert.match(html, /var epage = '\/'/, 'homepage carousel route is not scoped to /')
  assert.match(articleHtml, /var epage = '\/'/, 'article pages can still execute the homepage-only carousel')
})

test('persistent right-side controls bind only once across PJAX executions', () => {
  const customScript = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'custom.js'), 'utf8')
  assert.match(customScript, /customScrollBound/)
  assert.match(customScript, /customToggleBound/)
  assert.match(customScript, /customChartBound/)
})

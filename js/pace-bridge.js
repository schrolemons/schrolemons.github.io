(() => {
  let fallbackTimer
  let hideTimer

  const getElements = () => ({
    root: document.querySelector('.pace'),
    progress: document.querySelector('.pace-progress')
  })

  const setProgress = (progress, value) => {
    if (!progress) return
    progress.style.transform = `translate3d(${value}%, 0, 0)`
    progress.setAttribute('data-progress-text', `${value}%`)
    progress.setAttribute('data-progress', value < 10 ? `0${value}` : `${Math.min(value, 99)}`)
  }

  const finish = () => {
    window.clearTimeout(fallbackTimer)
    window.clearTimeout(hideTimer)
    const { root, progress } = getElements()
    if (!root) return
    setProgress(progress, 100)
    hideTimer = window.setTimeout(() => {
      root.classList.remove('pace-active')
      root.classList.add('pace-inactive')
      document.body.classList.remove('pace-running')
      document.body.classList.add('pace-done')
    }, 120)
  }

  const start = () => {
    window.clearTimeout(fallbackTimer)
    window.clearTimeout(hideTimer)
    const { root, progress } = getElements()
    if (!root) return
    root.classList.remove('pace-inactive')
    root.classList.add('pace-active')
    document.body.classList.remove('pace-done')
    document.body.classList.add('pace-running')
    setProgress(progress, 12)
    fallbackTimer = window.setTimeout(finish, 5000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finish, { once: true })
  } else {
    finish()
  }

  document.addEventListener('pjax:send', start)
  document.addEventListener('pjax:complete', finish)
  document.addEventListener('pjax:error', finish)
})()

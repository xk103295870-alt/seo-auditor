const url = process.argv[2] || 'https://www.weinuo.work/'
const key = process.env.GOOGLE_PAGESPEED_API_KEY
const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
apiUrl.searchParams.set('url', url)
apiUrl.searchParams.set('strategy', 'mobile')
apiUrl.searchParams.set('category', 'PERFORMANCE')
apiUrl.searchParams.set('category', 'ACCESSIBILITY')
apiUrl.searchParams.set('category', 'BEST_PRACTICES')
apiUrl.searchParams.set('category', 'SEO')
if (key) apiUrl.searchParams.set('key', key)

console.log('URL:', apiUrl.toString().replace(key || '', key ? '***' : ''))

fetch(apiUrl.toString())
  .then(async (res) => {
    console.log('status:', res.status)
    const body = await res.text()
    if (!res.ok) {
      console.error('error body:', body.slice(0, 500))
      process.exit(1)
    }
    const data = JSON.parse(body)
    console.log('categories:', JSON.stringify(data.lighthouseResult?.categories, null, 2))
    console.log('metrics:', JSON.stringify(data.loadingExperience?.metrics, null, 2))
  })
  .catch((err) => {
    console.error('fetch error:', err.message)
    process.exit(1)
  })

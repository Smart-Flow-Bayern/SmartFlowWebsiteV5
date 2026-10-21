import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { JsonLd } from '@/components/seo/JsonLd'

describe('JsonLd', () => {
  it('escapes < so a value cannot close the script tag', () => {
    const html = renderToStaticMarkup(<JsonLd data={[{ name: '</script><img src=x>' }]} />)
    expect(html).toContain('\\u003c/script')
    expect(html).not.toContain('</script><img')
    expect(html.match(/<\/script/g)).toHaveLength(1)
  })
})

import { describe, it, expect } from 'vitest'
import { useHeaderLinks, useFooterLinks } from '~/composables/useNavigation'

describe('Navigation links', () => {
  it('exposes the Templates page in the header links', () => {
    const { headerLinks } = useHeaderLinks()

    const templates = headerLinks.value.find(
      (link) => link.label === 'Templates',
    )
    expect(templates).toBeDefined()
    expect(templates?.to).toBe('/templates')
  })

  it('exposes the Templates page in the footer Ecosystem group', () => {
    const { footerLinks } = useFooterLinks()

    const ecosystem = footerLinks.find((group) => group.label === 'Ecosystem')
    expect(ecosystem).toBeDefined()

    const templates = ecosystem?.children.find(
      (link) => link.label === 'Templates',
    )
    expect(templates).toBeDefined()
    expect(templates?.to).toBe('/templates')
  })
})

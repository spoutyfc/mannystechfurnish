'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { trackEvent, type SiteEvent } from './analytics'

type Props = ComponentProps<'a'> & {
  href: string
  event: SiteEvent
  /** Where on the site the link sits, e.g. "home-hero". */
  location: string
}

/** A link that records one conversion event when it is followed. */
export function TrackedLink({ href, event, location, onClick, ...rest }: Props) {
  const handle: Props['onClick'] = (e) => {
    trackEvent(event, { location })
    onClick?.(e)
  }
  if (href.startsWith('/')) {
    return <Link href={href} onClick={handle} {...rest} />
  }
  return <a href={href} onClick={handle} {...rest} />
}

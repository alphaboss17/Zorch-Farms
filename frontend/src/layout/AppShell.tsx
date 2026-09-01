import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { RequestDrawer } from '../features/request/RequestDrawer'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <RequestDrawer />
    </>
  )
}

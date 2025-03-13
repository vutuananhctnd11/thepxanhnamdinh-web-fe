import React from 'react'
import Footer from './Footer'
import Header from './Header'

const Layout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="flex-1"/>

      <main className="flex-2">{children}</main>

      <Footer/>
    </div>
  )
}

export default Layout

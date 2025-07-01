import React from 'react'

const Footer = () => {
  return (
    <footer className='text-center px-4 font-medium text-sm h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex justify-center items-center bg-gray-50'>
      <p>&copy; {new Date().getFullYear()} Jubilee General. All rights reserved.</p>
    </footer>
  )
}

export default Footer;
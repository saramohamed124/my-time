'use client';

import React from 'react'
import Image from 'next/image';

// gif
import not_found from '@/app/assets/vedio/not_found.gif';

const NotFound = () => {
  return (
    <div className='my-5 text-center'>
      <p className=' text-3xl text-[#535FFD] font-bold'>!هذه الصفحة غير متاحة</p>
      <Image src={not_found} alt="not found" className='w-1/2 h-1/2 mx-auto mt-10'/>
    </div>
  )
}

export default NotFound

import Image from 'next/image'
import React from 'react'

// img
import inprogress from '@/app/assets/imgs/inprogress.png'

const InProgress = () => {
  return (
    <article className='w-full flex justify-center flex-col items-center my-4 mx-auto'>
        <h2 className='text-[#F78522] font-bold text-2xl md:text-4xl my-4'>هذه الصفحة قيد التطوير</h2>
      <Image className='max-w-full' src={inprogress} alt='inprogress' width={350} height={350}/>
    </article>
  )
}

export default InProgress

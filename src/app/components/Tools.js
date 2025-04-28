import Image from 'next/image'
// icons
import figma from '@/app/assets/icons/figma.svg'
import html from '@/app/assets/icons/html.svg'
import css from '@/app/assets/icons/css.svg'
import tailwindcss from '@/app/assets/icons/tailwindcss.svg'
import js from '@/app/assets/icons/js.svg'
import reactjs from '@/app/assets/icons/reactjs.svg'
import next from '@/app/assets/icons/next.svg'
import redux from '@/app/assets/icons/redux.svg'
import firebase from '@/app/assets/icons/firebase.svg'
import nodejs from '@/app/assets/icons/nodejs.svg'
import mongodb from '@/app/assets/icons/mongodb.svg'
import expressjs from '@/app/assets/icons/expressjs.svg'
import npm from '@/app/assets/icons/npm.svg'

export default function Tools() {
    const tools = [
        {
            id: 0,
            icon: figma,
        },
        {
            id: 1,
            icon: html,
        },
        {
            id: 2,
            icon: css,
        },
        {
            id: 3,
            icon: tailwindcss,
        },
        {
            id: 4,
            icon: js,
        },
        {
            id: 5,
            icon: reactjs,
        },
        {
            id: 6,
            icon: next,
        },
        {
            id: 7,
            icon: firebase,
        },
        {
            id: 8,
            icon: nodejs,
        },
        {
            id: 9,
            icon: expressjs,
        },
        {
            id: 10,
            icon: mongodb,
        },
        {
            id: 11,
            icon: npm,
        },
        {
            id: 12,
            icon: redux,
        },
    ];
    return(
        <section className='bg-white flex gap-10 flex-wrap justify-center items-center p-5'>
            {tools.map(tool => (
                <Image key={tool.id} src={tool.icon} width={50} height={50} alt='html'/>
            ))}
        </section>
    )
}
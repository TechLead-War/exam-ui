import React from 'react'
interface Props {
    desc?: string;
    tags?: string[];
    title?: string
}


const Description = ({ desc, title, tags }: Props) => {
    return (
        <div className=' w-full'>
                <span className='font-bold'>{title}</span>
            <p className='text-md overflow-x-hidden w-auto text-black flex whitespace-pre-line '>
                {desc}
            </p>
        </div>
    )
}

export default Description
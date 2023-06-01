import { MouseEvent } from 'react'
import { IconCirclePlus } from '@tabler/icons-react'

const InsertButton = ({ text, onClick }: { text: string, onClick: (e: MouseEvent) => void }) => {
  return (
    <div className="flex" onClick={onClick}>
        <IconCirclePlus
            color='#00EE33'
            size={24}
        />
        {text}
    </div>
  )
}

export default InsertButton
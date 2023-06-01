import { ChangeEvent } from 'react'

const UnderlinedInput = ({ name, value, onChange, ...props }: { name: string, value: string, onChange: (e: ChangeEvent) => any }) => {
  return (
    <input
      value={value}
      onChange={onChange} 
      placeholder={name}
      className="border-b-2 border-slate-200 focus:border-slate-600 focus:outline-none transition-colors"
      {...props}
    ></input>
  )
}

export default UnderlinedInput
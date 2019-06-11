import React from 'react'
import styled from 'styled-components'

type Props = {
  checked: boolean
  label: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}

const RadioButton = ({ checked, label, name, onChange, value }: Props) => {
  return (
    <Wrapper>
      <Input type="radio" checked={checked} name={name} onChange={onChange} value={value} />
      <label>{label}</label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-left: 16px;
`

const Input = styled.input`
  cursor: pointer;
  margin-right: 8px;
`

export default RadioButton

import React from 'react'
import styled from 'styled-components'

type Props = {
  bg?: string
  className?: string
  color?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button: React.FC<Props> = ({ bg = '#fff', children, className, color = '#000', onClick }) => (
  <Btn bg={bg} color={color} className={className} onClick={onClick}>
    {children}
  </Btn>
)

const Btn = styled.button<{ bg: string; color: string }>`
  background-color: ${props => props.bg};
  border-radius: 4px;
  border: ${props => props.bg !== '#fff' && 'none'};
  color: ${props => props.color};
  cursor: pointer;
  font-size: 0.75rem;
  height: 32px;
  padding: 8px 20px;
`

export default Button

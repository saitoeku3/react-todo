import React, { useState } from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import TaskEditModal from './Modal'
import { Task } from '../context/task'

type Props = {
  className?: string
  edited?: boolean
  task: Task
  toggleCheck: () => void
}

const Card = ({ className, task, toggleCheck }: Props) => {
  const { deadline, isDone, title } = task
  const [edited, setEdited] = useState<boolean>(false)
  const [hovered, setHovered] = useState<boolean>(false)

  const closeModal = (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event) {
      event.stopPropagation()
    }
    setHovered(false)
    setEdited(false)
  }

  return (
    <Wrapper
      className={className}
      hovored={hovered}
      onClick={() => setEdited(true)}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {edited && <TaskEditModal task={task} closeModal={closeModal} />}
      <div>
        <Checkbox
          type="checkbox"
          checked={isDone}
          onChange={toggleCheck}
          onClick={event => event.stopPropagation()}
        />
        <Title deadline={deadline}>{title}</Title>
      </div>
      {hovered && <FAIcon icon={faEdit} />}
    </Wrapper>
  )
}

const Wrapper = styled.li<{ hovored: boolean }>`
  background-color: ${props => props.hovored && '#eee'};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
  margin: 4px 0;
  padding: 4px 12px;
`

const Title = styled.span<{ deadline: number }>`
  margin-left: 8px;
  color: ${props => {
    if (props.deadline < Date.now()) {
      return 'red'
    } else if (
      props.deadline <=
      dayjs(Date.now())
        .add(1, 'day')
        .valueOf()
    ) {
      return 'orange'
    }
  }};
`

const Checkbox = styled.input`
  cursor: pointer;
`

const FAIcon = styled(FontAwesomeIcon)`
  margin: auto 0;
`

export default Card

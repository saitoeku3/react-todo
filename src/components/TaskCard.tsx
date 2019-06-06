import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import TaskEditModal from './TaskEditModal'
import { Task, TaskContext } from '../context/task'

type Props = {
  className?: string
  edited?: boolean
  task: Task
  toggleCheck: () => void
}

const TaskCard = ({ className, task, toggleCheck }: Props) => {
  const { title, isDone } = task
  const { dispatch } = useContext(TaskContext)
  const [edited, setEdited] = useState<boolean>(false)

  const removeTask = () => {
    const deleted = confirm('Do you really want to delete this task?')
    if (!deleted) {
      return
    }
    dispatch({ type: 'REMOVE_TASK', payload: { task } })
  }

  return (
    <Wrapper className={className}>
      {edited && <TaskEditModal task={task} closeModal={() => setEdited(false)} />}
      <div>
        <CheckBox type="checkbox" checked={isDone} onChange={toggleCheck} />
        <Title>{title}</Title>
      </div>
      <div>
        <Icon onClick={() => setEdited(true)}>Edit</Icon>
        <Icon onClick={removeTask}>Delete</Icon>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.li`
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  height: 32px;
  padding: 4px 12px;
  width: 400px;
`

const CheckBox = styled.input`
  cursor: pointer;
`

const Title = styled.span`
  margin-left: 4px;
`

const Icon = styled.span`
  margin: 4px;

  &:hover {
    cursor: pointer;
  }

  &:first-child {
    margin: 4px 4px 4px 0;
  }

  &:last-child {
    margin: 4px 0 4px 4px;
  }
`

export default TaskCard

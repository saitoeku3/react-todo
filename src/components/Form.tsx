import React, { useContext, useState } from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import DateTimePicker from 'react-datetime-picker'
import Button from './Button'
import { Task, TaskContext } from '../context/task'

type Props = {
  afterSubmit?: () => void
  className?: string
  hasCloseBtn?: boolean
  task?: Task
}

const Form = ({ afterSubmit, className, hasCloseBtn = false, task }: Props) => {
  const { state, dispatch } = useContext(TaskContext)
  const [title, setTitle] = useState<string>(task ? task.title : '')
  const [body, setBody] = useState<string>(task ? task.body : '')
  const [deadline, setDeadline] = useState<number>(task ? task.deadline : Date.now())

  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newTask = {
      id: state.tasks.length + 1,
      title,
      body,
      isDone: false,
      deadline: deadline,
      createdAt: Date.now()
    }
    dispatch({ type: 'ADD_TASK', payload: { task: newTask } })
    setTitle('')
    setBody('')
    setDeadline(Date.now())

    if (afterSubmit) {
      afterSubmit()
    }
  }

  const updateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (task) {
      const updatedTask = { ...task, title, body, deadline }
      dispatch({ type: 'UPDATE_TASK', payload: { task: updatedTask } })
    }
    if (afterSubmit) {
      afterSubmit()
    }
  }

  const removeTask = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!task) {
      return
    }
    const result = confirm(`Do you really remove ${task.title}?`)
    if (result) {
      dispatch({ type: 'REMOVE_TASK', payload: { task } })
    }
  }

  return (
    <Wrapper className={className} onClick={event => event.stopPropagation()}>
      {hasCloseBtn && <CloseBtn onClick={afterSubmit}>×</CloseBtn>}
      <form onSubmit={task ? updateTask : addTask}>
        <InputArea>
          <Labal>Title</Labal>
          <input
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
            required
          />
        </InputArea>
        <InputArea>
          <Labal>Body</Labal>
          <textarea value={body} onChange={event => setBody(event.target.value)} required />
        </InputArea>
        <InputArea>
          <Labal>Deadline</Labal>
          <DateTimePicker
            clearIcon={null}
            value={dayjs(deadline).toDate()}
            onChange={date => setDeadline(dayjs(date).valueOf())}
            required
          />
        </InputArea>
        <SubmitBtn type="submit" value={task ? 'Update' : 'Add'} />
        {task && <Button bg="#b44848" color="#fff" onClick={removeTask}>Remove</Button>}
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const CloseBtn = styled.div`
  cursor: pointer;
  font-size: 24px;
  position: absolute;
  top: 8px;
  right: 16px;
`

const SubmitBtn = styled.input`
  background-color: #4bb543;
  border-color: #4bb543;
  cursor: pointer;
  color: #fff;
  border-radius: 4px;
  font-size: 0.75rem;
  margin: 8px 8px 8px 0;
  padding: 8px 16px;
`

const Labal = styled.label`
  display: block;
  margin-bottom: 8px;
`

const InputArea = styled.div`
  margin: 12px 12px 12px 0;
`

export default Form

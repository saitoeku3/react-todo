import React, { useContext, useState } from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import DateTimePicker from 'react-datetime-picker'
import { Task, TaskContext } from '../context/task'

type Props = {
  afterSubmit?: () => void
  className?: string
  task?: Task
}

const TaskForm = ({ afterSubmit, className, task }: Props) => {
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

  return (
    <div className={className} onClick={event => event.stopPropagation()}>
      <form onSubmit={task ? updateTask : addTask}>
        <div>
          <Labal>Title</Labal>
          <input
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
            required
          />
        </div>
        <div>
          <Labal>Body</Labal>
          <textarea value={body} onChange={event => setBody(event.target.value)} required />
        </div>
        <div>
          <Labal>Deadline</Labal>
          <DateTimePicker
            clearIcon={null}
            value={dayjs(deadline).toDate()}
            onChange={date => setDeadline(dayjs(date).valueOf())}
            required
          />
        </div>
        <SubmitBtn type="submit" value={task ? 'Update' : 'Add'} />
      </form>
    </div>
  )
}

const SubmitBtn = styled.input`
  cursor: pointer;
`

const Labal = styled.label`
  display: block;
`

export default TaskForm

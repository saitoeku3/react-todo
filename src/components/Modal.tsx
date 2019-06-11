import React, { useContext, useState, createRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import DateTimePicker from 'react-datetime-picker'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { Task, TaskContext } from '../context/task'
import Button from './Button'

type Props = {
  task?: Task
  closeModal: () => void
}

const Modal = ({ closeModal, task }: Props) => {
  const { state, dispatch } = useContext(TaskContext)
  const [title, setTitle] = useState<string>(task ? task.title : '')
  const [body, setBody] = useState<string>(task ? task.body : '')
  const [deadline, setDeadline] = useState<number>(task ? task.deadline : Date.now())
  const titleRef = createRef<HTMLInputElement>()

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

    if (closeModal) {
      closeModal()
    }
  }

  const updateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (task) {
      const updatedTask = { ...task, title, body, deadline }
      dispatch({ type: 'UPDATE_TASK', payload: { task: updatedTask } })
    }
    if (closeModal) {
      closeModal()
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

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [])

  return createPortal(
    <Wrapper onClick={closeModal}>
      <Content onClick={event => event.stopPropagation()}>
        <CloseBtn onClick={closeModal}>×</CloseBtn>
        <Form onSubmit={task ? updateTask : addTask}>
          <div>
            <Labal>Title</Labal>
            <Title
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={titleRef}
              required
            />
          </div>
          <div>
            <Labal>Memo</Labal>
            <TextArea value={body} onChange={event => setBody(event.target.value)} required />
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
          <div>
            <SubmitBtn type="submit" value={task ? 'Update' : 'Add'} />
            {task && (
              <Button bg="#b44848" color="#fff" onClick={removeTask}>
                Remove
              </Button>
            )}
          </div>
        </Form>
      </Content>
    </Wrapper>,
    document.body
  )
}

const Wrapper = styled.div`
  background-color: #00000080;
  cursor: pointer;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`

const Content = styled.div`
  position: relative;
  background-color: #fff;
  border: 1px solid #bbb;
  border-radius: 8px;
  cursor: default;
  height: 360px;
  width: 480px;
  margin: 10vh auto;
  padding: 32px;
`

const CloseBtn = styled.div`
  cursor: pointer;
  font-size: 24px;
  position: absolute;
  top: 8px;
  right: 16px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const Title = styled.input`
  border: 1px solid gray;
  padding: 4px;
`

const TextArea = styled.textarea`
  border-color: gray;
  padding: 4px;
  resize: none;
  height: 120px;
  width: 80%;
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
  &:hover {
    filter: brightness(0.85);
  }
`

const Labal = styled.label`
  display: block;
  margin-bottom: 8px;
`

export default Modal

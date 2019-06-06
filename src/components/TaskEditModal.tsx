import React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { Task } from '../context/task'
import TaskForm from './TaskForm'

type Props = {
  task: Task
  closeModal: () => void
}

const TaskEditModal = ({ closeModal, task }: Props) => createPortal(
    <Wrapper onClick={closeModal}>
      <EditForm task={task} afterSubmit={closeModal} />
    </Wrapper>,
    document.body
  )

const Wrapper = styled.div`
  background-color: #00000050;
  cursor: pointer;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`

const EditForm = styled(TaskForm)`
  background-color: #fff;
  border: 1px solid #bbb;
  border-radius: 8px;
  cursor: default;
  height: 360px;
  width: 480px;
  margin: auto;
  padding: 32px;
`

export default TaskEditModal

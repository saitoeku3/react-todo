type ReactDatetimePickerProps = {
  clearIcon?: null | string | React.ReactElement
  onChange?(date: Date): void
  required?: boolean
  value?: Date
}

declare module 'react-datetime-picker' {
  export default class ReactDatetimePicker extends React.Component<ReactDatetimePickerProps> {}
}

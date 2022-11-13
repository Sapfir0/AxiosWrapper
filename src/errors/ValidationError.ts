export class ValidationError extends Error {
  message: string

  constructor() {
    super()
    this.name = 'Validation error'
    this.message = 'Incorrect fields'
  }
}

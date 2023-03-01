export class ErrorResponse extends Error {

  constructor(public message: string, public code: number) {
    super(message);
  }
}

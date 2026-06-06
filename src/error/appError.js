class ErrorPersonalizado extends Error {
  constructor(mensagem, statusCode = 400) {
    super(mensagem);
    this.statusCode = statusCode;
    //this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  } 
}

export default ErrorPersonalizado;
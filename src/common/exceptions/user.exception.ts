export class UserNotFoundException extends Error {
  constructor(identifier: string | number) {
    super(`Usuario no encontrado: ${identifier}`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`El usuario con email ${email} ya existe`);
    this.name = 'UserAlreadyExistsException';
  }
}
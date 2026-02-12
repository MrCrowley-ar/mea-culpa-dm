export class ServiceException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ServiceException';
  }
}

export class NotFoundServiceException extends ServiceException {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundServiceException';
  }
}

export class ConflictServiceException extends ServiceException {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'ConflictServiceException';
  }
}

export class ForbiddenServiceException extends ServiceException {
  constructor(message: string) {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenServiceException';
  }
}

export class ValidationServiceException extends ServiceException {
  constructor(message: string) {
    super(message, 'VALIDATION');
    this.name = 'ValidationServiceException';
  }
}

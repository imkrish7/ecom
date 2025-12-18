export class UnauthorizedError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = statusCode;
    this.code = code;
    this.stack = new Error().stack;
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract validation errors
    const validationErrors = this.formatValidationErrors(exceptionResponse);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: 'Validation failed',
      errors: validationErrors,
    };

    this.logger.warn(`Validation error: ${JSON.stringify(validationErrors)}`);

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(exceptionResponse: any): any {
    if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
      // Handle class-validator errors
      if (Array.isArray(exceptionResponse.message)) {
        return exceptionResponse.message.map((error: any) => {
          if (typeof error === 'string') {
            return { message: error };
          }
          return {
            field: error.property || 'unknown',
            constraints: error.constraints || {},
            message: Object.values(error.constraints || {}).join(', '),
          };
        });
      }
      return exceptionResponse.message;
    }
    return exceptionResponse;
  }
}

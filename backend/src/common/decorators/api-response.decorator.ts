import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export const ApiSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  message?: string,
) =>
  applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiOkResponse({
      description: message || 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: { type: 'boolean', example: true },
              message: { type: 'string', example: message || 'Operation successful' },
              data: { $ref: getSchemaPath(dataDto) },
              timestamp: { type: 'string', example: new Date().toISOString() },
            },
          },
        ],
      },
    }),
  );

export const ApiCreatedSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  message?: string,
) =>
  applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiCreatedResponse({
      description: message || 'Created',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: { type: 'boolean', example: true },
              message: { type: 'string', example: message || 'Resource created successfully' },
              data: { $ref: getSchemaPath(dataDto) },
              timestamp: { type: 'string', example: new Date().toISOString() },
            },
          },
        ],
      },
    }),
  );

export const ApiErrorResponse = (message?: string, statusCode?: number) =>
  applyDecorators(
    ApiExtraModels(ApiResponseDto),
    ApiOkResponse({
      description: message || 'Error',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: message || 'An error occurred' },
          statusCode: { type: 'number', example: statusCode || 400 },
          timestamp: { type: 'string', example: new Date().toISOString() },
        },
      },
    }),
  );

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // Validate UUID format (TypeORM uses UUID by default)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Invalid ID format. Expected UUID.');
    }

    return value;
  }
}

@Injectable()
export class ParseOptionalObjectIdPipe implements PipeTransform<string, string | undefined> {
  transform(value: string): string | undefined {
    if (!value) {
      return undefined;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Invalid ID format. Expected UUID.');
    }

    return value;
  }
}

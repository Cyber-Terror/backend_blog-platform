import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const numericValue = Number(value);
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (!Number.isInteger(numericValue)) {
      throw new BadRequestException(
        `${String(metadata.data ?? 'value')} must be an integer`,
      );
    }

    if (numericValue <= 0) {
      throw new BadRequestException(
        `${String(metadata.data ?? 'value')} must be a positive integer`,
      );
    }

    return numericValue;
  }
}

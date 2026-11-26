import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseNonNegativeIntPipe implements PipeTransform {
  transform(value: string | number, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const numericValue = Number(value);

    if (!Number.isInteger(numericValue)) {
      throw new BadRequestException(
        `${String(metadata.data ?? 'value')} must be an integer`,
      );
    }

    if (numericValue < 0) {
      throw new BadRequestException(
        `${String(metadata.data ?? 'value')} must be a non-negative integer`,
      );
    }

    return numericValue;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, format, isValid } from 'date-fns';

@Pipe({
    name: 'dateFormat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date | number, formatType: 'relative' | 'custom' = 'relative', customFormat: string = 'MMM dd, yyyy'): string {
        if (!value) {
            return '';
        }

        const date = new Date(value);

        if (!isValid(date)) {
            return 'Invalid Date';
        }

        try {
            if (formatType === 'relative') {
                return formatDistanceToNow(date, { addSuffix: true });
            } else {
                return format(date, customFormat);
            }
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Date Error';
        }
    }
}
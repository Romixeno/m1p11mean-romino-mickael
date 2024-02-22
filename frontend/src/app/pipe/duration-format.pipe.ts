import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat',
})
export class DurationFormatPipe implements PipeTransform {
  transform(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    let formattedDuration = '';

    if (hours > 0) {
      formattedDuration += hours + 'h';
    }

    if (minutes > 0) {
      formattedDuration += minutes + 'min';
    }

    return formattedDuration;
  }
}

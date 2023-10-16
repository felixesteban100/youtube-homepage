export function iso8601DurationToTime(isoDuration: string): string {
  const duration = /^PT((\d+)H)?((\d+)M)?((\d+)S)?$/.exec(isoDuration);
  if (!duration) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const hours = duration[2] || '0';
  const minutes = duration[4] || '0';
  const seconds = duration[6] || '0';

  const timeString = `${hours !== '0' ? hours.padStart(2, '0') + ':' : ''}${minutes !== '0' ? minutes.padStart(2, '0') + ':' : ''}${seconds.padStart(2, '0')}`;

  return timeString;
}
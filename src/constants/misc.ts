// eslint-disable-next-line quotes
const fnsDateFormat = "MMM d ''yy";
const fnsDateAndTimeFormat = `${fnsDateFormat} ~ h:mm a`;

enum ETabs {
  methodology = 'Methodology',
  summary = 'Summary',
  vulnerabilities = 'Vulnerabilities'
}

export { fnsDateFormat, fnsDateAndTimeFormat, ETabs };

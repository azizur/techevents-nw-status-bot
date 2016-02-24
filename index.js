var calendar = require('./lib/google-calendar.js')

var argvs = process.argv.slice(2);

switch (argvs[0]) {
  case '-next-week':
    calendar.onNextWeek();
    break;
  case '-this-week':
   calendar.onThisWeek();
    break;
  case '-today':
  default:
    calendar.onToday();
}

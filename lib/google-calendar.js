var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var moment = require('moment');
var _ = require('lodash');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, timeMin, timeMax, callback) {
  
  var calendar = google.calendar('v3');
  
  calendar.events.list({
    auth: auth,
    calendarId: 'a73q3trj8bssqjifgolb1q8fr4@group.calendar.google.com',
    timeMin: timeMin,
    timeMax: timeMax,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      callback(events);
    }
  });
}

function getEvents(timeMin, timeMax, callback) {
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(JSON.parse(content), _.partial(listEvents, _, timeMin, timeMax, callback));
  });
}


var eventSummaryFormatter = function eventSummaryFormatter(events, dateFormat, callback) {
  
  var eventSummaryList = [];
  var eventSummaryTemplate = _.template('<%= date %>: <%= summary %>');
  
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var start = event.start.dateTime || event.start.date;
    
    eventSummaryList.push(
      eventSummaryTemplate({
        date: moment(start).format(dateFormat),
        summary: event.summary
      })
    );
  }
  
  callback(eventSummaryList);
}

var getEventSummary = function getEventSummary(timeMin, timeMax, summaryDateFormat, callback) {
  var eventSummaryListFormatter = _.partial(eventSummaryFormatter, _, summaryDateFormat, callback);
  getEvents(timeMin, timeMax, eventSummaryListFormatter);
}

var onToday = function onToday() {
  var time = moment();
  var timeMin = time.toISOString();
  var timeMax = time.add(1, 'days').toISOString();
  var summaryDateFormat = 'ha';
  
  getEventSummary(timeMin, timeMax, summaryDateFormat, function print(summary) {
    console.log('Today on @technwuk:');
    console.log(summary.join('\n'));
  });

}

var onThisWeek = function onThisWeek() {
  var time = moment();
  var timeMin = time.toISOString();
  var timeMax = time.add(7, 'days').toISOString();
  var summaryDateFormat = 'ddd ha';
  
  getEventSummary(timeMin, timeMax, summaryDateFormat, function print(summary) {
    console.log('This Week on @technwuk:');
    console.log(summary.join('\n'));
  });
}

var onNextWeek = function onNextWeek() {
  var time = moment();
  var timeMin = time.add(7, 'days').toISOString();
  var timeMax = time.add(7, 'days').toISOString();
  var summaryDateFormat = 'Do MMM';
  
  getEventSummary(timeMin, timeMax, summaryDateFormat, function print(summary) {
    console.log('Next Week on @technwuk:');
    console.log(summary.join('\n'));
  });
}

module.exports = {
  onToday: onToday,
  onThisWeek: onThisWeek,
  onNextWeek: onNextWeek
}

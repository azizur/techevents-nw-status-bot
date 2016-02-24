# North West Tech Community Status Bot



# Quickstart

Complete the steps described in the rest of this page, and in about five minutes you'll have a simple Node.js command-line application that makes requests to the Google Calendar API and get the North West Tech Community Events in your terminal.

## Prerequisites

To run this app, you'll need:

* Node.js installed.
* The npm package management tool (comes with Node.js).
* A Google account with Google Calendar enabled.

## Step 1: Turn on the Google Calendar API

* Use this [wizard](https://console.developers.google.com/start/api?id=calendar) to create or select a project in the Google Developers Console and automatically turn on the API. Click **Continue**, then Go to **credentials**.

* At the top of the page, select the **OAuth consent screen** tab. Select an **Email address**, enter a **Product name** if not already set, and click the **Save** button.

* Select the **Credentials** tab, click the **Add credentials** button and select **OAuth 2.0 client ID**.

* Select the application type **Other**, enter the name "North West Tech Community Status Bot", and click the **Create** button.

* Click **OK** to dismiss the resulting dialog.

* Click the **file_download icon** (Download JSON) button to the right of the client ID.

* Move this file to your working directory and rename it `client_secret.json`.


## Step 2: Install the client library and app dependencies

Run the following commands to install the libraries using npm:
```
npm i
```

## Step 3: Run the app

Run the sample using the following command:
```
node index.js
```
The first time you run the sample, it will prompt you to authorize access:

* Browse to the provided URL in your web browser.

* If you are not already logged into your Google account, you will be prompted to log in. If you are logged into multiple Google accounts, you will be asked to select one account to use for the authorization.
* Click the **Accept** button.
* Copy the code you're given, paste it into the command-line prompt, and press **Enter**.


# CLI options params

To get todays event list:
```
node index.js

# alias of
node index.js -today
```

To get this week's event list:
```
node index.js -this-week
```

To get next week's event list:
```
node index.js -next-week
```

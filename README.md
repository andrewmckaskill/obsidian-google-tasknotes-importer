# Obsidian Google TaskNotes Importer

Import your Google Tasks into Obsidian using TaskNotes style.

This is a fork of the original (obsidian-google-tasks)[https://github.com/YukiGasai/obsidian-google-tasks] plugin by YukiGasai, with various changes added from other forks.

## Features

-   Import tasks from Google tasks
-   Includes reference to original google task
-   Includes link to associated email (so you can use the "add to tasks" feature of gmail)
-   Auto Import in background

> Working with specific time is not supported by the Google API :(

## Installation

-   Download google-tasks from the latest [release](https://github.com/YukiGasai/obsidian-google-tasks/releases/)
-   Extract zip into `.obsidian/plugins` folder
-   Restart Obsidian
-   Activate inside the obsidian settings page
-   [Create Google Cloud Project](https://console.cloud.google.com/projectcreate?)
-   [Activate Google Tasks API](https://console.cloud.google.com/marketplace/product/google/tasks.googleapis.com?q=search&referrer=search&project=iron-core-327018)
-   [Configure OAUTH screen](https://console.cloud.google.com/apis/credentials/consent?)
    -   Select Extern
    -   Fill necessary inputs
    -   Add your email as tester if using "@gmail" add gmail and googlemail
-   [Add API Token](https://console.cloud.google.com/apis/credentials)
-   [Add OAUTH client](https://console.cloud.google.com/apis/credentials/oauthclient)
    -   select Webclient
    -   add `http://127.0.0.1:42813` as Javascript origin
    -   add `http://127.0.0.1:42813/callback` as redirect URI
-   add the keys into the fields under the plugin settings
-   Press Login

### Using the plugin on Mobile (work around)

-   Login on a desktop device
-   Use the `Copy Google Refresh Token to Clipboard` command on that device
-   Install the plugin on the phone
-   Instead of `Login` paste the token from the desktop device into the Refresh token field on the phone

## Usage

### Commands

#### Import Tasks

Will create a new TaskNotes task for each un-completed task.

### Custom Properties

To store a link to the original email (for gmail originated tasks) or the google task, you need to create a custom user property in TaskNotes.

1. Open the TaskNotes plugin settings, and go to the "Task Properties" tab
2. At the bottom, add new custom user fields. (See example configuration below.)
3. If you want to display the link on the task card, go to the "Appearance & UI" tab
    - Click the "Configure" button to change the default fields
    - Scroll to the bottom and tick on your new custom fields

#### Default Property Settings

These are the settings you should use to start with. Feel free to change the names, but the types must stay the same or the import won't work.

    Display Name: Links
    Property Key: links
    Type: list
        
    Display Name: Google Task
    Property Key: google-task-id
    Type: string

If you change the property key of the field you will need to change the associated setting in the Google TaskNotes Importer settings page.

If the property you entered doesn't exist, TaskNotes will create the TaskNote fine, but it won't populate that field.
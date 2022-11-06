// (c) 2022 Three Stacking Birds RNDProd. Licensed under Apache 2.0 License (See LICENSE) 
// Delivered to you by the Origins Team

// Configs !! TO BE FILLED BY YOU !!
var apiToken = "YOUR TELGERAM BOT TOKEN (Ask @BotFather)";
var appUrl = "YOUR GOOGLE APPS SCRIPT URL (Deploy this script first and get the URL)";
var spreadsheet_id = "YOUR GOOGLE SPREADSHEETS ID (Can be found in the spreadsheet URL)";
var spreadsheet_key = "YOUR GOOGLE SPREADSHEETS API KEY (Can be made in the Google API Console)";
var apiUrl = "https://api.telegram.org/bot" + apiToken;

// Fast Triggers (On RAM (JS Object))
function getCommands(uname) {
    var commands = {
        "/start": "Hi! `" + uname + "` Try /commands",

        "/commands": "\n\
        \n/github Show github link\
        \n/commands Shows this message\
        \n/usefuls Lists websites that are useful\
        ",

        "/github": "\
        \n*ARSTCreations*\
        \n\
        \nGithub/[ARSTCreations](https://github.com/ARSTCreations)\
        \nGithub/[threestackingbirds](https://github.com/threestackingbirds)\
        ",

        "/usefuls": "\
        \nFree Pictures and Images [Unsplash](https://unsplash.com/)\
        \nHash Cracking - [Crackstation](https://crackstation.net/)\
        \nVideo Openings - [Panzoid](https://panzoid.com/)\
        \nFlowchart Maker - [draw.io](https://draw.io/)\
        \nUseful Gists - [ARSTCreation's GIST](https://gist.github.com/ARSTCreations/)\
        "
    };
    return commands
}

// Slow Triggers (On DISK+API (Spreadsheet API))
function getSheetCommands() {
    commands = {};
    var sheet_data = JSON.parse(UrlFetchApp.fetch('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_id + '/values/A2:B100?key=' + spreadsheet_key));
    for (var i = 0; i < sheet_data.values.length; i++) {
        commands[sheet_data.values[i][0]] = sheet_data.values[i][1];
    }
    return commands;
}

function setWebhook() {
    var url = apiUrl + "/setwebhook?url=" + appUrl;
    var res = UrlFetchApp.fetch(url).getContentText();
    Logger.log(res);
}

function doPost(e) {
    var time1 = new Date();
    var webhookData = JSON.parse(e.postData.contents);
    var text = webhookData.message.text;
    var chatId = webhookData.message.chat.id;
    var sender_uname = webhookData.message.from.username;
    var command = getCommands(sender_uname);

    var url = apiUrl + "/sendMessage?chat_id=" + chatId + "&text=" + command[text];

    if (typeof command[text] != "undefined") {
        var sendText = encodeURIComponent(command[text]);
        var opts = { muteHttpExceptions: true };
        var time2 = new Date();
        var seconds = (time2.getMilliseconds() - time1.getMilliseconds());
        var url = apiUrl + "/sendmessage?parse_mode=markdown&disable_web_page_preview=true&chat_id=" + chatId + "&text=" + sendText + "%0A%0A⏱️ " + Math.abs(seconds).toString() + "ms";
        UrlFetchApp.fetch(url, opts).getContentText();
    } else {
        var sheet_commands = getSheetCommands();
        var sendText = encodeURIComponent(sheet_commands[text]);
        if (typeof sheet_commands[text] != "undefined") {
            var opts = { muteHttpExceptions: true };
            var time2 = new Date();
            var seconds = (time2.getMilliseconds() - time1.getMilliseconds());
            var url = apiUrl + "/sendmessage?parse_mode=markdown&disable_web_page_preview=true&chat_id=" + chatId + "&text=taken from gsheet%0A%0A" + sendText + "%0A%0A⏱️ " + Math.abs(seconds).toString() + "ms";
            UrlFetchApp.fetch(url, opts).getContentText();
        } else {
            console.log('null');
        }
    }
}

function doGet() {
    return HtmlService.createHtmlOutputFromFile('index.html');
}

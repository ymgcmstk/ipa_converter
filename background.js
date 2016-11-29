var word2ipa = {};
var file = 'word2ipa.json';
var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL(file), true);
xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        word2ipa = JSON.parse(xhr.responseText);
    }
};
xhr.send();

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    var ipa_to_be_shown = "None";
    if (text in word2ipa) {
        ipa_to_be_shown = word2ipa[text];
    }
    chrome.omnibox.setDefaultSuggestion({
        description: ipa_to_be_shown
    });
});

chrome.browserAction.onClicked.addListener(function(){
    var defaults = {is_stopped: false};
    chrome.storage.local.get({is_stopped: false}, function(items) {
        if (items.is_stopped) chrome.browserAction.setIcon({path:"new_ipa_red.jpg"});
        else chrome.browserAction.setIcon({path:"new_ipa_grey.jpg"});
        chrome.storage.local.set({'is_stopped': !items.is_stopped});
    });
});
//    chrome.storage.sync.set({'is_stopped': (!is_stopped)});

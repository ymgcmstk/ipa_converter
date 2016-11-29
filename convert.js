chrome.storage.local.get({is_stopped: false}, function(items) {
    if (items.is_stopped) return;
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

    function getTextNodes(){
        var el_body = document.getElementsByTagName("body")[0];
        var textNodes = [];
        var func = function(parNode){
            var nodeList = parNode.childNodes;
            var i = 0, ii = nodeList.length;
            while(i < ii){
                if(nodeList[i].nodeType === 3){
                    textNodes.push(nodeList[i]);
                }else if(nodeList[i].nodeType === 1){
                    func(nodeList[i]);
                }
                i++;
            }
        };
        func(el_body);
        return textNodes;
    }

    function convert() {
        var textnodes = getTextNodes()
        for (var i = 0; i < textnodes.length; i++) {
            var cur_content = textnodes[i].textContent.split(' ');
            for (var j = 0; j < cur_content.length; j++) {
                var cur_word = cur_content[j].toLowerCase();
                var start_ind = 0;
                var end_ind = cur_word.length-1;
                while ('.?"“,”:;…'.indexOf(cur_word[start_ind]) >= 0 && start_ind < cur_word.length) {
                    start_ind += 1;
                }
                if (start_ind == cur_word.length) continue;
                while ('.?"“,”:;…'.indexOf(cur_word[end_ind]) >= 0 && end_ind >= 0) {
                    end_ind -= 1;
                }
                if (end_ind < 0) continue;
                var parsed_word = cur_word.substr(start_ind, end_ind-start_ind+1);
                if (parsed_word in word2ipa) {
                    cur_content[j] = cur_word.substr(0, start_ind) + word2ipa[parsed_word].replace(' ', '') + cur_word.substr(end_ind+1, cur_word.length-1-end_ind) + '　';
                    // cur_content[j] = cur_word.substr(0, start_ind) + 'BBBS' + word2ipa[parsed_word]  + 'BBBE' + cur_word.substr(end_ind+1, cur_word.length-1-end_ind);
                    // cur_content[j] = cur_word.substr(0, start_ind) + '<ruby>' + parsed_word + '<rt>' + word2ipa[parsed_word]  + '</rt></ruby>' + cur_word.substr(end_ind+1, cur_word.length-1-end_ind);
                } else {
                    // console.log(parsed_word);
                }
            }
            textnodes[i].textContent = cur_content.join(' ');
        }
    }

    var timer = 0;
    var count = 0;
    document.addEventListener('DOMNodeInserted', function() {
        if(count >= 3) return;
        timer = setTimeout(function() {
            convert();
            count += 1;
            timer = 0;
        }, 1000);
    }, false);

    chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
        var ipa_to_be_shown = "None";
        if (text in word2ipa) {
            ipa_to_be_shown = word2ipa[text];
        }
        chrome.omnibox.setDefaultSuggestion({
            description: ipa_to_be_shown
        });
    });
});

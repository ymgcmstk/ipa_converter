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
    var func = function(nodeList){
        var i = 0, ii = nodeList.length;
        while(i < ii){
            if(nodeList[i].nodeType === 3){
                textNodes.push(nodeList[i]);
            }else if(nodeList[i].nodeType === 1){
                func(nodeList[i].childNodes);
            }
            i++;
        }
    };
    func(el_body.childNodes);
    return textNodes;
}

function convert() {
    var textnodes = getTextNodes()
    for (var i = 0; i < textnodes.length; i++) {
        var cur_content = textnodes[i].textContent.split(' ');
        for (var j = 0; j < cur_content.length; j++) {
            var cur_word = cur_content[j].toLowerCase();
            //.replace('.', '').replace('?', '').replace('"', '').replace('“', '').replace(',', '');
            var start_ind = 0;
            var end_ind = cur_word.length-1;
            while ('.?"“,”'.indexOf(cur_word[start_ind]) >= 0 && start_ind < cur_word.length) {
                start_ind += 1;
            }
            if (start_ind == cur_word.length) continue;
            while ('.?"“,”'.indexOf(cur_word[end_ind]) >= 0 && end_ind >= 0) {
                end_ind -= 1;
            }
            if (end_ind < 0) continue;
            var parsed_word = cur_word.substr(start_ind, end_ind-start_ind+1);
            if (parsed_word in word2ipa) {
                cur_content[j] = word2ipa[cur_word.substr(start_ind, end_ind-start_ind)];
                cur_content[j] = cur_word.substr(0, start_ind) + word2ipa[parsed_word] + cur_word.substr(end_ind+1, cur_word.length-1-end_ind);
            } else {
                console.log(parsed_word);
            }
        }
        textnodes[i].textContent = cur_content.join(' ');
    }
}

var timer = 0;
document.addEventListener('DOMNodeInserted', function() {
    if(timer) return;
    timer = setTimeout(function() {
        convert();
        timer = 0;
    }, 100);
}, false);

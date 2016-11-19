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
            if (cur_content[j].toLowerCase() in word2ipa) {
                cur_content[j] = word2ipa[cur_content[j].toLowerCase()];
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

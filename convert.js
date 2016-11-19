$(function(){
    var word2ipa = {};
    var file = 'word2ipa.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL(file), true);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            config = JSON.parse(xhr.responseText);
        }
    };
    xhr.send();

    function convert() {
        var textnodes = $("*").contents().filter(function() {return this.nodeType === 3; });
        for (var i = 0; i < textnodes.length; i++) {
            var cur_content = textnodes[i].textContent.split(' ');
            for (var j = 0; j < cur_content.length; j++) {
                if (cur_content[j] in word2ipa) {
                    cur_content[j] = word2ipa[cur_content[j]];
                }
            }
            textnodes[i].textContent = cur_content.join(replace_list[j][1]);
        }
    }

    convert();

    /*
    var timer = 0;
    document.addEventListener('DOMNodeInserted', function() {
        if(timer) return;
        timer = setTimeout(function() {
            replace();
            timer = 0;
        }, 100);
    }, false);
    */
});

function() {
	function addBigram(w0,w1) {
		var ws = window.words[w0];
		if (!ws) ws = [];
		ws.push(w1);
		window.words[w0] = ws;
	}
	function trim(s) {
		return s.replace(/^\s+|\s+$/g,"");
	}
	function clean(word) {
		return trim(word);
	}
	function addWords(words) {
		var lastword = "";
		if(words.length < 5)return;
		for (var i=0; i < words.length; i++) {
			var thisword = clean(words[i]);
			if (thisword.length > 0) {
				var lastchar = thisword.charAt(thisword.length-1);
				if (".?!".indexOf(lastchar) > -1) {
					thisword = thisword.substr(0,thisword.length-1);
					addBigram(lastword,thisword);

					addBigram(thisword,"");
					thisword = "";
				} else {
					addBigram(lastword,thisword);
				}
			}
			lastword = thisword;
		}
		addBigram(lastword,"");
	}
	function getRandom(len) {
		return Math.floor(len * Math.random());
	}
	function getNextWord(w) {
		var choices = window.words[w];
		if (choices) {
			return choices[getRandom(choices.length)];
		} else {
			return "";
		}
	}

	function build(maxlen) {
		if (maxlen < 5) return "";
		var word = getNextWord("");
		var s = word;
		var w = word;
		while (s.length < maxlen) {
			var nextw = getNextWord(w);
			if (nextw == "") {
				if (s.length > 0.9 * maxlen) {
					return s;
				} else {
					s += ".";
				}
			} else {
				s += " "+nextw;
			}
			w = nextw;
		}
		return s;
	}


	function findTextnodes(el, textnodes) {
		for (var i = 0; i < el.childNodes.length; i++) {
			var child = el.childNodes[i];
			if (child.tagName != "SCRIPT" && child.tagName != "STYLE" && child.tagName != "NOSCRIPT") {
				if (child.nodeType == 3) {
					textnodes.push(child); 
				}
				else {
					findTextnodes(child, textnodes);
				}
			}
		}
	} 
	var textnodes = [];
	findTextnodes(document.getElementsByTagName("html")[0], textnodes);
	if (!window.words) {
		window.words = {};
		for (var i = 0; i<textnodes.length; i++) {
			var text = trim(textnodes[i].nodeValue);
			if (text) {
				addWords(text.split(/\s+/g));
				}
			}
		}
	}
	for (var i = 0; i<textnodes.length; i++) {
		var text = trim(textnodes[i].nodeValue);
		if (text) {
			var newText = build(text.length);
			if (newText) {
				textnodes[i].parentNode.replaceChild(document.createTextNode(newText), textnodes[i]);
			}
		}
	}
}()
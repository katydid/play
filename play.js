function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function validateCode(mode, codeMirrors) {
	$('#theoutput').prop("class", "alert alert-info");
	$('#theoutput').text("compiling...");
	var katydidcode = codeMirrors["katydid"].getValue();
	var inputcode = codeMirrors[mode].getValue();
	var validateFunc = gofunctions["ValidatorPlayground"];
	var res = validateFunc(mode, katydidcode, inputcode);
	if (res.indexOf("Error: ") === 0) {
		res = res.replace("Error: ", "");
		$('#theoutput').prop("class", "alert alert-danger");
		$('#theoutput').text(res);
	} else {
		if (res == "true") {
			$('#theoutput').prop("class", "alert alert-success");
			$('#theoutput').text("The input on the right satisfies the validation expression on the left.");
		} else if (res == "false") {
			$('#theoutput').prop("class", "alert alert-warning");
			$('#theoutput').text("The input on the right does not satisfy the validation expression on the left.");
		} else {
			$('#theoutput').prop("class", "alert alert-danger");
			$('#theoutput').text(res);
		}
	}
}

function reportError(err) {
	$('#theoutput').prop("class", "alert alert-danger");
	$('#theoutput').text(err);
}

function saveCode(mode, codeMirrors) {
	var saving = {
        "description": "saved katydid src",
        "public": true,
        "files": {}
    }
    for (key in codeMirrors) {
    	saving["files"][key+"src"] = {}
    	saving["files"][key+"src"]["content"] = codeMirrors[key].getValue();
    }
	var github = new Github({});
	var gist = github.getGist();
	gist.create(saving, function(err, rest) {
    	if (err == undefined) {
    		window.location.assign(window.location.pathname+"?gist="+rest.id+"&share=true&mode="+mode);
    	} else {
    		reportError(err);
    	}
    });
}

function loadCode(codeMirrors) {
	var github = new Github({});
	var gist = github.getGist(gistText);
	gist.read(function(err, content) {
		if (err == undefined) {
			for (key in codeMirrors) {
				codeMirrors[key].setValue(content.files[key+"src"].content);
			}
		} else {
			reportError(err);
		}
	});
}

function displayShareBox() {
	var linkText = window.location.href.replace("&share=true", "");
	$("#thelink").val(linkText);
	$("#thelink").prop("type", "text");
	var theLinkBox = document.getElementById("thelink");
    theLinkBox.onfocus = function() {
        theLinkBox.select();

        // Work around Chrome's little problem
        theLinkBox.onmouseup = function() {
            // Prevent further mouseup intervention
            theLinkBox.onmouseup = null;
            return false;
        };
    };
    theLinkBox.focus();
}

CodeMirror.defineSimpleMode("katydidmode", {
	start: [
		{regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
		{regex: /(?:\<emptyset\>|\<empty\>|true|false)/,
     	token: "keyword"},
     	{regex: /\/\/.*/, token: "comment"},
     	{regex: /\/\*/, token: "comment", next: "comment"}
	],
	comment: [
    	{regex: /.*?\*\//, token: "comment", next: "start"},
    	{regex: /.*/, token: "comment"}
  	]
});

function setHeightAuto() {
	var codeMirrors = $(".CodeMirror");
	for (var i = 0; i < codeMirrors.length; i++) {
    	codeMirrors[i].style.height = "auto";
	}
}

function setHeightDefault() {
	var codeMirrors = $(".CodeMirror");
	for (var i = 0; i < codeMirrors.length; i++) {
    	codeMirrors[i].style.height = "25em";
	}
}

function setDefaults(mode, codeMirrors) {
	codeMirrors["katydid"].setValue(defaults[mode]["katydid"]);
	codeMirrors[mode].setValue(defaults[mode]["input"]);
}

function init() {
	var mode = getUrlParameter("mode");
	gistText = getUrlParameter("gist");
	share = getUrlParameter("share");
	var katydidCodeMirror = CodeMirror(document.getElementById("lefttextarea"), {
  		mode:  "katydidmode",
  		value: 'loading...',
  		viewportMargin: Infinity
	});
	var codeMirrors = {"katydid": katydidCodeMirror};
	if (mode == undefined) {
		var mode = "json";
	}
	if (mode == "json") {
		var inputCodeMirror = CodeMirror(document.getElementById("righttextarea"), {
	  		mode:  {name: "javascript", json: true},
	  		value: 'loading...',
	  		viewportMargin: Infinity
		});
		codeMirrors[mode] = inputCodeMirror;
	} else {
		if (mode == "xml") {
			var inputCodeMirror = CodeMirror(document.getElementById("righttextarea"), {
		  		mode:  "xml",
		  		value: 'loading...',
		  		viewportMargin: Infinity
			});
			codeMirrors[mode] = inputCodeMirror;
		}
	}
	$("#mode" + mode).addClass("active");
	$("#inputheading").text(mode + " input");

	if (gistText == undefined) {
		setDefaults(mode, codeMirrors);
	} else {
		loadCode(codeMirrors);
		if (!(share == undefined)) {
			displayShareBox();
	    }
	}

	$("#saveButton").click(function(ev) { 
		saveCode(mode, codeMirrors);
	});

	$("#validateButton").click(function(ev) { 
		ev.preventDefault();
		validateCode(mode, codeMirrors);
	});

	setHeightDefault();
	$("#autosizeButton").click(function(ev) {
		ev.preventDefault();
		wasChecked = $("#autosizeButton").hasClass("active");
		if (wasChecked) {
			$("#autosizeButton").removeClass("active");
			setHeightDefault();
		} else {
			$("#autosizeButton").addClass("active");
			setHeightAuto();
		}
	});

	for (var key in codeMirrors) {
		codeMirrors[key].on('keyup', function(instance, event) {
    		validateCode(mode, codeMirrors);
		});		
	}

}

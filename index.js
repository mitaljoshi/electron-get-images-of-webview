var request = require('request');           //require js file to write file from URL
var Papa = require('./papaParse.js');           //require js file to Convert CSV to JSON
var XLSX = require('xlsx');
var dialog = require('electron').remote.dialog;
var imagURL = "";
var selector = "";
var webview = document.getElementById("webview");
var fileInput = document.getElementById("chooseFileInput");
var folderChooser = document.getElementById("chooseFolderInput");
var chooseFolderBtn = document.getElementById("chooseFolderBtn");
var downloadBtn = document.getElementById('downloadBtn');
var https = require('https');           //require js file to download image from link
var fs = require('fs');           //require js file to download Local file
var outputObj = {};
var recordNumner = 0;

webview.addEventListener("dom-ready", function () {
    //webview.openDevTools();
    webview.send("find-element", {                                                                                         // send selector to webview to get Image URL
        text: selector
    });
});

webview.addEventListener('ipc-message', function (event) {                                                                 // Recieve message or string data(Image url of gven selector) from webview
    console.log(event);
    console.info(event.channel);
    imagURL = event.channel;

    //Create image element from received URL and append to body
    var image = document.createElement("img");
    image.src = event.channel;
    document.getElementsByTagName("body")[0].appendChild(image);
    //image loaded 1
    //check ing if complete otherwise carry on
    if ((outputObj.products.length - 1) > recordNumner) {
        recordNumner = recordNumner + 1;
        loadImg(recordNumner);
    }
});
fileInput.addEventListener('change', function (evt) {
    var file = evt.target.files[0];
    if (file != undefined) {
        var ext = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
        console.log(ext);
        if (ext == 'csv') {
            Papa.parse(file, {                                                                                         // Covert CSV file content to JSON
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: function (results) {
                    data = results;
                    //outputObj = {};
                    outputObj.products = data.data;
                    console.log(data.meta.fields);
                    var arr = data.meta.fields;   //JSON object coverted from CSV file
                    loadImg(recordNumner);
                }
            });
        }
        else {
            alert("Please choose CSV file.");
        }
        console.log(XLSX.readFile(file.path, { type: 'array' }));
        wb = XLSX.readFile(file.path);
        var htmlstr = XLSX.utils.sheet_to_json(wb.Sheets["URLS"]);
        document.body.innerHTML += htmlstr;
    }
});
function loadImg(i, cb) {
    webview.loadURL(outputObj.products[i].link); //Set URL to webview
    selector = outputObj.products[i].selector;
}
folderChooser.addEventListener('change', function (evt) {                                                                                         // Show Choosen folder path
    var folder = evt.target.files[0];
    document.getElementById("folderPathLbl").innerHTML = folder.path;
});
chooseFolderBtn.addEventListener('click', function (e) {                                                                                         // Trigger Hidden input file click event
    folderChooser.click();
});
downloadBtn.addEventListener('click', function (e) {                                                                                         // Generate Image file from received URL and download to Choosen Path
    // var path = document.getElementById("folderPathLbl").innerHTML;
    // var file = fs.createWriteStream(path + "\\image.jpg");
    // var request = https.get(imagURL, function (response) {
    //     response.pipe(file);
    // });

    var o = dialog.showOpenDialog({ properties: ['openFile'] });
    var workbook = XLSX.readFile(o[0]);
});
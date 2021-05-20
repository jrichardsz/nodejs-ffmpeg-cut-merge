const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

var args = process.argv.slice(2);
loggerInfo("arguments:");
loggerInfo(args);
var rawIntervals = args[0].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
var sourceFile = args[1];
var outputFile = args[2];
var logLevel = args.length >=3 ? args[3] : 'info';
var nameFile = path.parse(sourceFile).name;
var outputFolder = path.parse(outputFile).dir;


var outputFiles = [];
rawIntervals.forEach(function(rawInterval){
  var rawIntervalArray = rawInterval.split("->");
  var start = hmsToSecondsOnly(rawIntervalArray[0]);
  var time = hmsToSecondsOnly(rawIntervalArray[1]);
  var outputFile = `${outputFolder}/${nameFile}-${start}-${time}.mp3`;
  var cmdString = `ffmpeg -y -ss ${start} -t ${time-start} -i ${sourceFile} ${outputFile}`;
  loggerInfo("cuting: "+cmdString);
  let output = execSync(cmdString, {stdio : 'pipe'});
  loggerDebug(output);
  outputFiles.push(outputFile)
});

//merge files with command:
// ffmpeg -f concat -safe 0 -i files.txt -c copy out.mp3

// create files.txt
var filesContent = "";
outputFiles.forEach((outputFile) => {
  filesContent = filesContent +`file  '${outputFile}'\n`;
});

var concatFilesPath = `${outputFolder}/files.txt`;
fs.writeFileSync(`${concatFilesPath}`, filesContent);
loggerInfo(`concat file was created: ${concatFilesPath}`);

//perform the concat
let concatOutput = execSync(`ffmpeg -y -f concat -safe 0 -i ${concatFilesPath} -c copy ${outputFile}`,{stdio : 'pipe'});
loggerDebug(concatOutput);
loggerInfo(`output file was created: ${outputFile}`);

//clean temp files
outputFiles.push(concatFilesPath);
outputFiles.forEach((outputFile) => {
  let output = execSync(`rm -rf ${outputFile}`);
  loggerDebug(output);
});


function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

function loggerDebug(str) {
  if(logLevel == 'debug'){
    console.log(str);
  }
}

function loggerInfo(str) {
  console.log(str);
}

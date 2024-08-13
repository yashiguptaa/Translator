/*
  Author:Yashi Gupta
  Course: CSC 337
  Assignment 6; translator.js

  this assignment or program helps user translate to/from german, english and spanish,
  on the local server which is ip address 127.0.0.1 and port 5000
*/
const ipaddress = '127.0.0.1';
const port = 5000;
const http = require('http');
const fs = require('fs');
const readLine = require('readline');
const fileSpanish = './Spanish.txt'
const fileGerman = './German.txt'

e2s = {};
s2e = {};
e2g = {};
g2e = {};

/*
  processWord processes the given string and translates it
  
  Parameters -
    initial: String which needs to be translated
    final: dictionary, which contains original to translated word

  Returns - 
    converted: translated, converted final string
*/
function processWord(initial, final){
  initial = initial.split('+');
  var converted = "";
  var wordFound = "";
  initial.forEach(word => {
    word = word.trim().toLowerCase();
    if(final == 's2g'){
      toEng = eval(s2e)[word];
      wordFound = eval(e2g)[toEng]; 
    }
    else if(final == 'g2s'){
      toEng = eval(g2e)[word];
      wordFound = eval(e2s)[toEng]; 
    }
    else{
      wordFound = eval(final)[word];
    }
    converted += wordFound + ' ';
  })
  return converted;
}

/*
  fileToTranslate creates dictionaries that help map
  original word to the translated word.

  Parameters -
    fileName: String which is the filename
    fromEng: String, mapped to initial language
    toEng: String, mapped to final language

  Returns - None
*/
async function fileToTranslate(fileName, fromEng, toEng){
  const readline = readLine.createInterface({
    input: fs.createReadStream(fileName)
  });
  
  for await(const line of readline){
    if(line.startsWith('#')){
      continue;
    }
    wordsList = line.split('\t');
    if(wordsList.length < 2){
      continue;
    }
    var initial = wordsList[0].toLowerCase().trim();
    var final = wordsList[1].toLowerCase().trim();
    let search = final.search('[^a-z ]');
    final = search == -1 ? final : final.substring(0, search);
    toEng[final] = initial.trim()
    fromEng[initial] = final.trim();
  }
}

fileToTranslate(fileSpanish, e2s, s2e);
fileToTranslate(fileGerman, e2g, g2e);

/*
  Server checks the URL by splitting, and checking for
  given valid format, if not valid, it returns OK.
*/
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  urlSplit = req.url.split('/');
  langOptions = new Set(["e", "g", "s"]);

  if(urlSplit.length == 4 
    && urlSplit[1] == 'translate' 
    && urlSplit[2].length == 3
    && langOptions.has(urlSplit[2][0]) 
    && langOptions.has(urlSplit[2][2])
    && urlSplit[2][0] != urlSplit[2][2]) {
    var translation = processWord(urlSplit[3].trim(), urlSplit[2].trim());
    //console.log(translation);
    res.end(translation);
  } 
  else{
    res.end('OK');
  }
});

server.listen(port, ipaddress, () => {
  console.log('Server Started http://%s:%s', ipaddress, port);
  //console.log('Use format: http://127.0.0.1:5000/translate/TYPE/CONTENT')
});
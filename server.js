const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 
app.use(express.static('index.html'))
const port = process.env.PORT || "8000";

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
  });

app.post('/wrapText', (req, res) => {

  var { maxLength, inputText } = req.body;
  if(!maxLength || !inputText)
    return res.send(404);
  var textList = [];

  while(inputText.length > maxLength)
  {
    var substr = inputText.substr(0, maxLength+1);
    substr = substr.substr(0, Math.min(substr.length, substr.lastIndexOf(" ")))

    if (substr.length === 0)
      return res.status(400).send(
        {error: "Can not be trimmed with maxLength: " + maxLength + ". Increase the number...", trimmedWords:textList });
    
    textList.push(substr);
    
    var idx;
    if (substr[substr.length] === " " || substr[substr.length-1] === " ")
        idx= substr.length;
    else
        idx = substr.length+1;

    inputText = inputText.substr(idx);

  }
  if(inputText.length > 0)
    textList.push(inputText);

  return res.status(200).send({trimmedWords:textList});

})

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});    
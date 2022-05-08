// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
const express = require("express");
const app = express();
var cors = require("cors");
const bodyparser = require("body-parser");
var fs = require("fs");
app.use(cors());
app.use(bodyparser.json());

app.use("/public", express.static(__dirname + "/public"));

async function setEndpoint(link) {
  // Specifies the location of the api endpoint

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./key.json"
  });

  // Performs text detection on the image file
  const [result] = await client.textDetection(link);
  const labels = result.textAnnotations;
  //   console.log(result);
  //console.log('Text:');
  //labels.forEach(label => console.log(label.description));
  return labels;
}

async function landmarks(link) {
  // Specifies the location of the api endpoint

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./key.json"
  });

  // Performs text detection on the image file
  const [result] = await client.landmarkDetection(link);
  const labels = result.landmarkAnnotations;
  //console.log('Landmarks:');
  //labels.forEach(label => console.log(label.description));
  return labels;
}

async function labels(link) {
  // Specifies the location of the api endpoint

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./key.json"
  });

  // Performs text detection on the image file
  const [result] = await client.labelDetection(link);
  const labels = result.labelAnnotations;
  //console.log('Labels:');
  //labels.forEach(label => console.log(label.description));
  return labels;
}

async function logo(link) {
  // Specifies the location of the api endpoint

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./key.json"
  });

  // Performs text detection on the image file
  const [result] = await client.logoDetection(link);
  const labels = result.logoAnnotations;
  //console.log('Logos:');
  //labels.forEach(label => console.log(label.description));
  return labels;
}

async function mulobjects(link) {
  // Specifies the location of the api endpoint

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./key.json"
  });

  // Performs text detection on the image file
  const [result] = await client.objectLocalization(link);
  const labels = result.localizedObjectAnnotations;
  //console.log('Objects:');
  //labels.forEach(label => console.log(label.description));
  return labels;
}

app.get("/image", (req, res) => {
  const link = "https://95vy9i-4000.sse.codesandbox.io/public/temp.png";
  try {
    setEndpoint(link).then((result) => {
      res.json(result[0].description.replace(/\n/g, " "));
    });
  } catch (e) {
    res.send("Something went wrong");
  }
  //console.log(req.body);
});

app.get("/label", (req, res) => {
  //console.log(req.body);
  try {
    const link = "https://95vy9i-4000.sse.codesandbox.io/public/temp.png";
    labels(link).then((result) => {
      const list = [];
      result.forEach((label) => {
        list.push(label.description);
      });
      res.json(list);
    });
  } catch (e) {
    res.send("Something went wrong");
  }
});

app.get("/landmark", (req, res) => {
  //console.log(req.body);
  const link = "https://95vy9i-4000.sse.codesandbox.io/public/temp.png";
  try {
    landmarks(link).then((result) => {
      res.json(result[0].description);
    });
  } catch (e) {
    res.send("Something went wrong");
  }
});

app.get("/logo", (req, res) => {
  //console.log(req.body);
  const link = "https://95vy9i-4000.sse.codesandbox.io/public/temp.png";
  try {
    logo(link).then((result) => {
      res.json(result[0].description);
    });
  } catch (e) {
    res.send("Something went wrong");
  }
});

app.get("/mulobjects", (req, res) => {
  //console.log(req.body);
  const link = "https://95vy9i-4000.sse.codesandbox.io/public/temp.png";

  try {
    mulobjects(link).then((result) => {
      const list = [];
      console.log(result);
      result.forEach((label) => {
        list.push(label.name);
      });
      res.json(list);
    });
  } catch (e) {
    res.send("Something went wrong");
  }
});

app.get("/upload", (req, res) => {
  try {
    let a = req.body.baseimage;
    console.log(req.body);
    console.log(a);
    let m = a.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let b = Buffer.from(m[2], "base64");
    fs.writeFile("./public/temp.png", b, function (err) {
      if (!err) {
        console.log("file is created");
      }
    });

    res.status(200).send("Uploaded");
  } catch (e) {
    res.send("Something went wrong");
  }
});

app.listen(6000, () => console.log("Example app listening on port 4000!"));

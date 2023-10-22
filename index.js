import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import qr from "qr-image";
import fs from "fs";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(__dirname + "/public"));

app.post("/check", (req, res) => {
  var url = req.body["password"];
  var qr_svg = qr.image(url);
  var imageStream = qr_svg.pipe(
    fs.createWriteStream(__dirname + "/public/rq_image.png")
  );
  imageStream.on("finish", () => {
    res.send(
      `
      <div class="center-container">
        <div class="center-content">
          <div style="background-image: url('/rq_image.png'); height: 400px; width: 400px; background-size: cover;"></div>
          <a href="/rq_image.png" download="rq_image.png">
            <button>Download QR Code</button>
          </a>
        </div>
        <a href="/">
        <button>Back</button>
      </a>
      </div>
      <style>
        .center-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 95vh;
        }
        .center-content {
          text-align: center;
        }
        button{
            background-color: #3876BF;
            border: 2px solid black;
            color: white;
            height: 40px;
            border-radius: 15px;
            cursor: pointer;
            margin-bottom: 10px;
        }
      </style>
      `
    );
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

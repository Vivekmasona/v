const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
const fs = require("fs");

const corsOptions = {
  origin: "https://vivekfy.netlify.app", // change this origin as your like
  // origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.static("./static"));
const port = process.env.PORT || 5000;

app.get("/", (res) => {
  res.render("index.html");
});

app.get("/hack", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const thumbnail = info.videoDetails.thumbnails[0].url;
  let formats = info.formats;

  const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  // const format = ytdl.chooseFormat(info.formats, { quality: "249" });
  formats = formats.filter((format) => format.hasAudio === true);

  res.send({ title, thumbnail, audioFormats, formats });
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  // const info = await ytdl.getInfo(url);
  // const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasonaa"`);
  try {
    ytdl(url, {
            format: '249',
            filter: 'audioonly',
            quality: 'lowest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});

app.get("/video", async (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const type = req.query.type;

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;

  // res.header("Content-Disposition", `attachment;  filename="Download from.vivekmasona"`);
  try {
    ytdl(url, { itag }).pipe(res);
  } catch (err) {
    console.log(err);
  }
});

app.get('/', async (req, res) => {
    try {
        var url = req.query.url;
        if (!ytdl.validateURL(url)) {
            return res.sendStatus(400);
        }
        let info = await ytdl.getInfo(url);
        console.log(info.videoDetails.title);
        const title = slugify(info.videoDetails.title, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: false
        });
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(url, {
            format: 'mp4',
            quality: 'highest'
        }).pipe(res);

    } catch (err) {
        console.error(err);
    }
});

// app.get('*', (req, res) => {
//   res.render('error')
// })

app.listen(port, () => {
  console.log("Running ...");
});

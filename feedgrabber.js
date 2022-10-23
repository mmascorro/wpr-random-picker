const FeedParser = require('feedparser');
const { Readable } = require('stream')
const http = require('https');
const fs = require('fs');

const url = new URL('https://feeds.acast.com/public/shows/0374f776-c411-4314-95ca-bc5eb1b7b6e0');
const feedparser = new FeedParser();
const episodes = [];
let xml = '';

const feedReq = http.request(url, (res) => {
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    xml += chunk;    
  });
  res.on('end', () => {
    const readable = Readable.from(xml)
    readable.pipe(feedparser)
  });
})
feedReq.on('error', (e) => {
  console.log(e)
});
feedReq.end();

feedparser.on('error', function (e) {
  console.log(e)
});
feedparser.on('readable', function () {
  let item;
  while (item = this.read()) {
    let episode = {};
    episode.title = item.title;
    episode.guid = item.guid;
    episode.description = item.description;
    episode.link = item.link;
    episode.date = item.date;
    episodes.push(episode)
  }
});
feedparser.on('end', function () {
  let json = JSON.stringify(episodes);
  fs.writeFile('episodes.json', json, (err) => {
    if (err) throw err;
    console.log('Data Complete');
  });
});

const FeedParser = require('feedparser');
const request = require('request');
const fs = require('fs');

let req = request('http://vicegamingnew.vice-media.libsynpro.com/rss');
let feedparser = new FeedParser();

let episodes = [];

req.on('error', function (error) {
  // handle any request errors
});

req.on('response', function (res) {
  let stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  // always handle errors
});

feedparser.on('readable', function () {
  let stream = this;
  let meta = this.meta;
  let item;


  while (item = stream.read()) {
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
  let jsonStr = JSON.stringify(episodes);
  fs.writeFile('episodes.json', jsonStr, (err) => {
    if (err) throw err;
      console.log('Data Complete');
  });
});

const request = require('request');
const fs = require('fs');

const baseUrl = 'https://forum.waypoint.vice.com';
let topics = [];


function getTopics(url) {
  request({url:url, json:true}, (error,response,body)=> {

    processTopics(body.topic_list)
  });
}

function processTopics(topic_list) {
  // console.log(topic_list)

  topic_list.topics.forEach((element) => {
    topic = {};
    topic.slug = element.slug;
    topic.id = element.id;
    topic.title = element.fancy_title;
    topics.push(topic)
  })

  //detect if more pages
  if (topic_list.more_topics_url) {
    let nextUrlPath = topic_list.more_topics_url.replace('latest','latest.json');
    let nextUrl = `${baseUrl}${nextUrlPath}`;
    getTopics(nextUrl);
    console.log(nextUrl)
  } else {
    let jsonStr = JSON.stringify(topics);
    fs.writeFile('topics.json', jsonStr, (err) => {
      if (err) throw err;
        console.log('Data Complete');
    });
  }


}


getTopics(`${baseUrl}/latest.json`);



/*

*/

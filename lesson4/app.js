var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element);
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });
// 获取到各个列表的链接 

    var ep = new eventproxy();

    ep.after('topic_html', topicUrls.length, function (topics) {
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var aname = topicPair[2];
        var acode = topicPair[3]
        // console.log(topicHtml)
        var $ = cheerio.load(topicHtml);
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment1: $('.reply_content').eq(0).text().trim(),
          // avatarUrl: $('.author_content .user_avatar').eq(0).attr('href')
          author1: aname,
          code: acode
        });
      });

      console.log(topics);
    });

    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {

            var $ = cheerio.load(res.text);
            // console.log($('.user_avatar').eq(0).text().trim())
          // console.log('fetch ' + topicUrl + ' successful');\\
          if( $('.author_content .user_avatar').eq(0).attr('href')){
            const avatarUrl = 'https://cnodejs.org' + $('.author_content .user_avatar').eq(0).attr('href')
            superagent.get(avatarUrl)
              .end(function (err, res) {
                if (err) {
                  return console.error(err);
                }
                var $ = cheerio.load(res.text)
                let a = $('.user_card .user_name .dark').text()
                let b = $('.user_card .board .big').text()
                ep.emit('topic_html', [topicUrl, res.text, a, b]);
              })
          }else{
            ep.emit('topic_html', [topicUrl, res.text, '暂无', '暂无']);
          }
        });
    });

  });
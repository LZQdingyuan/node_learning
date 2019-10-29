//引入外部模块
var superagent = require('superagent');//http方面的库，可以发起get post请求
var cheerio = require('cheerio'); //node.js 版的jquery
var url = require('url');//使用 url.resolve
var eventproxy = require('eventproxy');//控制并发
/*1.获取所有cnodejs.org所有话题的href，在此基础上面得到完整的url*/
var cnodeUrl="https://cnodejs.org/";
superagent.get(cnodeUrl)
    .end(function(err,res){
        if(err){
            console.error(err);
        }
        var cnodeUrls = [];
        var $ = cheerio.load(res.text);
        $('#topic_list .topic_title').each(function(i,element) {
            //console.log($(element).attr('href'));//$(element).attr('href') 获取到href的所有内容
            if(i<5){//防止过度请求
            var href = url.resolve(cnodeUrl,$(element).attr('href'));//整合成整个URL
            cnodeUrls.push(href);
            }
        });
        /*2.获取每个URL中的页面，*/
        var ep = new eventproxy();
        ep.after('topic_html',cnodeUrls.length,function(topics) {
                topics = topics.map(function(em) {
                    var topicUrl = em[0];
                    var score0 = em[1];
                    var title = em[2];
                    var comment0 = em[3];
                    var author0 = em[4];
                    return ({
                        title: title,
                        href: topicUrl,
                        comment0: comment0,
                        author0: author0,
                        score0: score0
                    });
                });
                console.log(topics);
        });
        cnodeUrls.forEach(function(topicUrl) {
           superagent.get(topicUrl)//针对每一个页面进行get
               .end(function(error,tres){
                        // console.log('fetch ' + topicUrl + '-sucessful' );
                   var $ = cheerio.load(tres.text);
                   /*获取author的链接*/
                   var score0 = null;
                   var title = $('.topic_full_title').text().trim();
                   var comment0 = $('.reply_content').eq(0).text().trim();
                   var author0 = $('.reply_author').eq(0).text().trim();
                   var author0href = $('.reply_author').eq(0).attr('href');
                   //获取页面过多会存在undefined的
                   if(typeof(author0href)!='undefined'){
                       var author0Url = url.resolve(cnodeUrl, $('.reply_author').eq(0).attr('href'));
                    //    console.log('|-author fetch ' + author0Url + '-successful');

                       superagent.get(author0Url)
                           .end(function(auerr,aures) {
                               var $ = cheerio.load(aures.text);
                               score0 = $('.floor').text().trim();
                               ep.emit('topic_html',[topicUrl,score0,title,comment0,author0]);
                           });
                   }
            });
        });
    });
//Documentation notes and explanations of code are in comments.
//most of this comes from a techknights demonstration, more things will be added in timeeee

var TwitterPackage = require('twitter');//require function is similar to import in Java

var secret = { //creates javascript object with our tokens, creates a new Twitter
//object with those tokens, and are putting them in the twitter variable
  consumer_key: 'oxoH0tiq7pW89Bms0kshMujUi',
  consumer_secret: 'CQOBcBOQdLR9dKAIoqsIygHDRjldSJbV2dTwgFj4NP6vSelB7P',
  access_token_key: '804067049593065479-IzHDbpV78MT5DManBbzqSemrp0JOI2w',
  access_token_secret: 'iLaoXfLdVUUiHwPju2JzQi8L6hD2Rxtxh6YYXZHCFCR1O'
//!!!IF YOU WANT TO POST THIS TO GITHUB, OR SHARE THE BASE CODE, REMOVE THE TOKENS!!!
}
var Twitter = new TwitterPackage(secret);

//EXAMPLE CODE
//TWITTER REST API, (VisdevBot is in development tweet)
/*
Twitter has a REST API that allows us to do different things.
One of the things it can do is allow us to "POST" a tweet.
Example:
//'statuses/update' means we want to post a status update (aka a tweet)
//{status:} a javascript object that we are passing in to this function where we
//set the status of the tweet being sent out.
*/
// Twitter.post('statuses/update', {status: 'VisdevBot is in development!'},  function(error, tweet, response){
//
//   if(error){
//     console.log(error);
//   }
//   console.log(tweet);  // Tweet body.
//   console.log(response);  // Raw response object.
// });

//EXAMPLE CODE
//TWITTER STREAMING API
//Listening
//-TWITTER.stream-//
Twitter.stream('statuses/filter', {track: '#art'}, function(stream) {
  //The 1st param is a string that tells twitter we want to listen for statuses with a certain filter.
  //The 2nd param is where we define that filter with an object.
  //That object contains the property: track which lets us define a word, hashtag or phrase that we care to listen for.
  //For this, we will be tracking when some one tweets with the hashtag "art".
  //the last parameter is a function that gets called when Twitter is done setting up our stream.
  //When it's done setting up our stream, it then passes that stream object in to the function.
  //Within this function, we can setup what happens when we receive a tweet along with other things such as error handling,
  //etc.
//-stream.on-//
  stream.on('data', function(tweet) {
    //console.log(tweet.text);
  });
//So, using the stream object, it calls the on function. Now with the on function,
//you pass in a string and a function. This says, "when a get data (a tweet),
//call this function with that data." For now, we just print out tweet.text which
//is how you access the actual text of the tweet that was received that used "#art".
  stream.on('error', function(error) {
    console.log(error);
  });
});

//EXAMPLE CODE
//TWITTER STREAMING API
//Replies to #visdevbot
//-TWITTER.stream-//
// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
Twitter.stream('statuses/filter', {track: '#visdevbot'}, function(stream) {
  // when data is recieved
  stream.on('data', function(tweet) {
    // print out the text of the tweet that came in
    //console.log(tweet.text);
    //build our reply object
    var statusObj = {status: "Hi @" + tweet.user.screen_name + ", what is up, my guy?"}
    //call the post function to tweet something
    Twitter.post('statuses/update', statusObj,  function(error, tweetReply, response){
      //if we get an error print it out
      if(error){
        console.log(error);
      }
      //print the text of the tweet we sent out
      //console.log(tweetReply.text);
    });
  });
  // ... when we get an error...
  stream.on('error', function(error) {
    //print out the error
    console.log(error);
  });
});
//------------------------------
//EXAMPLE CODE
//TWITTER GET API
//Automatically retweet a hashtag on an interval
var getandrepostQ = function() {
    Twitter.get('search/tweets', { q: 'characterdesign', result_type: 'recent', lang: 'en', count: 5 }, function(err1, data1, response1) {
      if (err1) {
        console.error(err1);
        return err1;
      }
      // data1 is an object with an array called statuses
      // statuses has objects that have info of the tweet/account id/ etc as keys and values
      //  console.log(data1);

      // use forEach in the stead of a reg for loop
      data1.statuses.forEach(function(status) {
        let id = status.id_str;
        console.log(`DEBUG: id_str: ${id}`); // those are backticks, remember that

        // Looking at the API docs, the way I was calling this might have
        // been the problem
        Twitter.post('statuses/retweet/' + id, function (err, data, response) {
          if (err) {
            console.error(err);
            return err;
          }
          console.log(`DEBUG: succesfully retweeted ${id}`);
        });
      })
    });
}

setInterval(getandrepostQ, 6000);
// 6000 ms = 6 seconds
// 60000 ms = 1 minute
// 3600000 ms = 1 hour
// 86400000 ms = 24 hours

//----------------
//EXAMPLE CODE
//TWITTER STREAMING API
//Replies to a hashtag with a randomized response from a response array
var arrOfMagicSayings = [
  "Signs point to yes.",
  "Yes.",
  "Reply hazy, try again.",
  "Without a doubt.",
  "My sources say no.",
  "As I see it, yes.",
  "You may rely on it.",
  "Concentrate and ask again.",
  "Outlook not so good.",
  "It is decidedly so.",
  "Better not tell you now.",
  "Very doubtful.",
  "Yes - definitely.",
  "It is certain.",
  "Cannot predict now.",
  "Most likely.",
  "Ask again later.",
  "My reply is no.",
  "Outlook good.",
  "Don't count on it."
]

// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
Twitter.stream('statuses/filter', {track: '#visdevbotmagic'}, function(stream) {
  // ... when we get tweet data...
  stream.on('data', function(tweet) {
    // print out the text of the tweet that came in
    console.log(tweet.text);
    // calculate the random index
    var randomIndex = Math.round(Math.random() * arrOfMagicSayings.length);
    //build reply string
    var reply = "Hi @" + tweet.user.screen_name + ", " + arrOfMagicSayings[randomIndex];
    //call post function to tweet something
    Twitter.post('statuses/update', {status: reply},  function(error, tweetReply, response){
      if(error){
        console.log(error);
      }
      //print the text of the tweet we sent out
      console.log(tweetReply.text);
    });
  });
  stream.on('error', function(error) {
    console.log(error);
  });
});

//EXAMPLE CODE
//TWITTER GET API
//Johabi's Optimized Get/Retweet Method
//Automatically retweet a hashtag on an interval
/**
 * callback(err, retweetArray)
 */

/**
 * callback(error, tweet)
 */
const retweetByStatus = (status, callback) => {
  let id = status.id_str;
  console.log(`DEBUG: id_str: ${id}`);

  Twitter.post(`statuses/retweet/${id}`, (err, tweet) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null, tweet);
  });
}

/**
 * callback(err, retweetArray)
 */
const retweetAllFromStatusArray = (statusArray, callback) => {
  if (statusArray.length === 0) {
    console.log(`DEBUG: no statuses in array`)
    return callback(null, []);
  }

  let retweetArray = [];
  statusArray.forEach((status) => {
    retweetByStatus(status, (err, tweet) => {
      if (err) {
        console.error(err);
        console.log(`DEBUG: tweet = ${err}`);
        retweetArray.push(err);
      } else {
        console.log(`DEBUG: tweet = ${JSON.stringify(tweet, null, '  ')}`);
        retweetArray.push(tweet);
      }
      // are all retweets accounted for?
      if (retweetArray.length === statusArray.length) {
        // if so, we're done and ready for the callback
        callback(null, retweetArray);
      }
    })
  })
}

const getandrepostQu = (callback) => {
  Twitter.get('search/tweets', { q: 'comics', result_type: 'recent', lang: 'en', count: 2 }, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    retweetAllFromStatusArray(data.statuses, callback);
  });
}

(function recurse(){
  getandrepostQu((err, retweets) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`DEBUG: retweets = ${JSON.stringify(retweets, null, '  ')}`);
    }
    setTimeout(recurse, 6000);
  })
})();

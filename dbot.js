var Discordie = require('Discordie');
const Events = Discordie.Events;
const client = new Discordie();

client.connect({
  token = 'MjUzNzIyMTM2MjI3NjEwNjI0.CyEoyg.YFZmcSRviFKOIvnX-gjAtacIChM'
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.Username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if(e.message.content == 'PING'){
    e.message.channel.sendMessage('PONG');
  }
});

const express = require('express');

const PID = process.pid;

function log(msg) {
  console.log(`[${PID}]` ,new Date(), msg);
}

const app = express();

app.get('/healthcheck', function healthcheck(req, res) {
  log('they check my health');
  res.send('all good!\n')
});

app.get('/sum/:number', function (req, res){
  log('sum sync');

  let from = 0;
  const to = parseInt(req.params.number)
  let sum = 0;
  
  do {
    from++
    sum = sum + from;
  }
  while (from != to)

  res.send(`The sum is ${sum}`);
})

app.get('/sum-async/:number', async function (req, res){
  log('sum async');

  let from = 0;
  const to = parseInt(req.params.number)
  let sum = 0;

  const summer = async (sum, i) => sum + i;
  
  do {
    from++
    sum = sum = await summer(sum, from)
  }
  while (from != to)

  res.send(`The sum is ${sum}`);
})

app.get('/sum-async-fancy/:number', async function (req, res) {
  log('computing async with setImmidiate!');
  
  let from = 0;
  const to = parseInt(req.params.number)
  let sum = 0;

  function setImmediatePromise() {
    return new Promise((resolve) => {
      setImmediate(() => resolve());
    });
  }
  
  do {
    from++
    sum = sum + from;
    await setImmediatePromise()
  }
  while (from != to)

  res.send(`The sum is ${sum}`);
});

const PORT = process.env.PORT || 1337;
let server = app.listen(PORT, () => log('server listening on :' + PORT));
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
  sum = 0;
  for (i = 0; i <= req.params.number; i++){
    sum = sum + i;
  }
  res.send(`The sum is ${sum}`);
})

app.get('/sum-async/:number', async function (req, res){
  log('sum async');
  sum = 0;

  const summer = async (sum, i) => sum + i;

  for (i = 0; i <= req.params.number; i++){
    sum = await summer(sum, i)
  }
  res.send(`The sum is ${sum}`);
})

app.get('/sum-async-fancy/:number', async function (req, res) {
  log('computing async with setImmidiate!');
  sum = 0;

  function setImmediatePromise() {
    return new Promise((resolve) => {
      setImmediate(() => resolve());
    });
  }

  for (i = 0; i <= req.params.number; i++){
    sum = sum + i;
    await setImmediatePromise()
  }

  res.send(`The sum is ${sum}`);
});

const PORT = process.env.PORT || 1337;
let server = app.listen(PORT, () => log('server listening on :' + PORT));
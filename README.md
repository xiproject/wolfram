#Wolfram Alpha agent
Queries Wolfram Alpha for answers and speaks it out.
## Installation
1. Clone this repo and run `npm install`
2. Procure the API key from [Wolfram Alpha](https://developer.wolframalpha.com/portal/myapps/index.html) by creating a new **AppID** and place it in `config.json` (take a look at `config.json.sample`).

## Run
`$ node index.js --logfile wolfram.log 2>&1 | bunyan`


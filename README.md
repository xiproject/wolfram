#Wolfram Alpha agent
Queries Wolfram Alpha for answers and speaks it out.
## Installation
1. Clone this repo and run `npm install`
2. Go to [Wolfram Alpha Developer Portal](https://developer.wolframalpha.com/portal/myapps/index.html) 
3. Click on **Get an AppID**
4. Fill in app details and place the **AppID** in `config.json` (take a look at `config.json.sample`).

## Run
`$ node index.js --logfile wolfram.log 2>&1 | bunyan`


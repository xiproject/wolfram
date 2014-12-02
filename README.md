#Wolfram agent

## Prerequisites
Procure the API key from [Wolfram Alpha](https://developer.wolframalpha.com) and place it in `config.json`.

###Example
```js
    {
        "auth": "<API_KEY>"
    }

```

## Usage

The agent subscribes to `xi.event.input.text` and publishes the result to `xi.event.output.text`









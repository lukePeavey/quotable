Quota
=========================
_Random quote API_

I built this for a freeCodeCamp project. Anyone is welcome to use it

- Database with roughly 1500 famous quotes
- Easy to use
- Allows requests over HTTP or HTTPS

### Usage
To get a new random quote, make a request to:
`https://quota.glitch.me/random`

This returns a JSON object in the following format:
```
  {
    quoteText: String
    quoteAuthor: String
  }
```


##### Javascript Example

```js
  fetch('https://quota.glitch.me/random')
  .then(response => response.json())
  .then(data => {
    console.log(`${data.quoteText} -${data.quoteAuthor}`)
  })
```

##### jQuery Example

```js
  $.getJSON('https://quota.glitch.me/random', function(data) {
    console.log(`${data.quoteText} -${data.quoteAuthor}`)
  })
```

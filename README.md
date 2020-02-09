# Quotable

_A REST API for famous quotes_

I originally built this for a freeCodeCamp project, and decided to publish for others to use as well. The database currently includes over 1500 quotes by 800 authors.

## Table of contents:

- [Get a random quote](#get-random-quote)
- [Search quotes](#search-quotes)
- [Get Quote by ID](#get-quote-by-id)
- [Search authors](#search-authors)
- [Get Author By ID](#get-author-by-id)
- [Usage](#usage)
- [Live Example](#live-examples)

## API Documentation

### Get random quote

Returns a single random quote from the database

#### Query parameters

| param    | type     | Description                                                  |
| :------- | :------- | :----------------------------------------------------------- |
| tags     | `String` | Filter random quote by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |
| maxlength  | `Int` | The maximum Length in characters ( can be combined with `minlength` ) |
| minlength | `Int`| The minimum Length in characters ( can be combined with `maxlength` )

#### Request

```http
https://api.quotable.io/random
```

#### Response

```ts
{
  _id: string,
  content: string,
  author: string,
  tags: [string],
  length: number
}
```

### List Quotes

Get a paginated list of all quotations in the database. This method supports several filter and sorting options. 

#### Query parameters

| param    | type     | Description                                                  |
| :------- | :------- | :----------------------------------------------------------- |
| author   | `String` | Filter quotes by author name. Supports fuzzy search.         |
| authorId | `String` | Filter quotes by author ID.                                  |
| limit    | `Int`    | The number of quotes to return per request. (for pagination).|
| skip     | `Int`    | The number of items to skip (for pagination).                |
| tags     | `String` | Filter quotes by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |
| maxlength  | `Int` | The maximum Length in characters ( can be combined with `minlength` ) |
| minlength | `Int`| The minimum Length in characters ( can be combined with `maxlength` )

#### Request

```http
https://api.quotable.io/quotes
```

#### Response

```ts
{
  // The number of quotes returned by this request
  count: number,
  // The total number of quotes matching this request
  totalCount: number
  // The index of the last quote returned. When paginating through results,
  // this value would be used as the `skip` parameter when requesting the next
  // "page" of results.
  lastItemIndex: number
  // The array of quotes
  results: {_id: string, content: string, author: string, tags: [string], length: number}[]
}
```

### Get Quote By ID

Get a quote by its ID

#### Request

```http
https://api.quotable.io/quotes/:id
```

#### Response

```ts
{
  _id: string,
  content: string,
  author: string,
  tags: [string],
  length: number
}
```

### List Authors

Get a paginated list of all authors in the database. This method supports several filter and sorting options. 

#### Query parameters

| param     | type                           | Description                                                   |
| :-------- | :----------------------------- | :------------------------------------------------------------ |
| name      | `String`                       | Search for authors by name. Supports fuzzy search.            |
| sortBy    | `enum: ['name', 'quoteCount']` | The field used to sort authors. Default is 'name'             |
| sortOrder | `enum: ['asc', 'desc']`        | The order results are sorted in. Default is 'asc'             |
| limit     | `Int`                          | The number of authors to return per request. (for pagination) |
| skip      | `Int`                          | The number of items to skip (for pagination)                  |

#### Request

```http
https://api.quotable.io/authors
```

#### Response

```ts
{
  // The number of authors return by this request.
  count: number,
  // The total number of authors matching this request.
  totalCount: number,
  // The index of the last item returned. When paginating through results,
  // this value would be used as the `skip` parameter when requesting the next
  // "page" of results. It will be set to `null` if there are no additional results.
  lastItemIndex: number | null,
  // The array of authors
  results: {_id: string, name: string, quoteCount: string}[]
}
```

### Get Author By ID

Get all quotes a specific author

#### Request

```http
https://api.quotable.io/authors/:id
```

#### Response

```ts
{
  _id: string,
  // The author name
  name: string,
  // The total number of quotes by this author
  quoteCount: number,
  // The array of quotes by this author
  quotes: {_id: string, content: string, author: string}[]
}
```

### Get Tags

Get list of available tags

#### Request

```http
https://api.quotable.io/tags
```

#### Response

```ts
{
  // The number of all tags by this request
  count: number,
  // The array of tags
  results: {_id: string, name: string}[]
}
```

## Usage

**Get a random quote (fetch)**

```js
fetch('https://api.quotable.io/random')
  .then(response => response.json())
  .then(data => {
    console.log(`${data.content} —${data.author}`)
  })
```

**Get a random quote (async/await)**

```js
async function randomQuote() {
  const response = await fetch('https://api.quotable.io/random')
  const data = await response.json()
  console.log(`${data.content} —${data.author}`)
}
randomQuote()
```

**Get a random quote (JQuery)**

```js
$.getJSON('https://api.quotable.io/random', function(data) {
  console.log(`${data.content} —${data.author}`)
})
```

## Live Examples

[Basic Random Quote (CodePen)](https://codepen.io/lukePeavey/pen/RwNVeQG)

[React Random Quote (CodeSandbox)](https://codesandbox.io/s/quotable-demo-react-e7zm1?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark)

## Contributing

All feedback and contributions are welcome!

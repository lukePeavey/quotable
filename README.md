# Quotable

 Quotable is a free, open source quotations API. It was originally built as part of a [FreeCodeCamp](https://www.freecodecamp.org/) project. The database includes over 2000 quotes by 900 authors. 
 
- [Servers](#servers)
- [API Methods](#api-methods)
  - [Get random quote](#get-random-quote)
  - [List Quotes](#list-quotes)
  - [Get Quote By ID](#get-quote-by-id)
  - [List Authors](#list-authors)
  - [Get Author By ID](#get-author-by-id)
  - [List Tags](#list-tags)
- [Usage](#usage)
  - [Live Examples](#live-examples)
- [Contributing](#contributing)

## Servers

| Name            | URL                 | Description                                                                                                   |
| :-------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Staging     | staging.quotable.io | Synced with the master branch of this repository                |
| Production  | api.quotable.io     | The primary API server |
  
## API Methods

### Get random quote

Returns a single random quote from the database

**Path**

```HTTP
GET /random
```

**Query parameters**

| param     | type     | Description                                                                                                                                                                                                                                                                                                            |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                                  |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                                  |
| tags      | `String` | Filter random quote by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |

**Response**

```ts
{
  _id: string
  // The quotation text
  content: string
  // The full name of the author
  author: string
  // The length of quote (number of characters)
  length: number
  // An array of tag names for this quote
  tags: [string]
}
```

### List Quotes

Get a paginated list of all quotes. This method supports several filter and sorting options. 

**Path**

```HTTP
GET /quotes
```

**Query parameters**

| param     | type     | Description                                                                                                                                                                                                                                                                                                      |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| author    | `String` | Filter quotes by author name. Supports fuzzy search.                                                                                                                                                                                                                                                             |
| authorId  | `String` | Filter quotes by author ID.                                                                                                                                                                                                                                                                                      |
| limit     | `Int`    | The number of quotes to return per request. (for pagination).                                                                                                                                                                                                                                                    |
| skip      | `Int`    | The number of items to skip (for pagination).                                                                                                                                                                                                                                                                    |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                            |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                            |
| tags      | `String` | Filter quotes by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |

**Response**

```ts
{
  // The number of quotes returned by this request
  count: number
  // The total number of quotes matching this request
  totalCount: number
  // The index of the last quote returned. When paginating through results,
  // this value would be used as the `skip` parameter when requesting the next
  // "page" of results.
  lastItemIndex: number
  // The array of quotes
  results: Array<{
    _id: string
    // The quotation text
    content: string
    // The full name of the author
    author: string
    // The length of quote (number of characters)
    length: number
    // An array of tag names for this quote
    tags: [string]
  }>
}
```

### Get Quote By ID

Get a quote by its ID

**Path**

```HTTP
GET /quotes/:id
```

**Response**

```ts
{
  _id: string
  // The quotation text
  content: string
  // The full name of the author
  author: string
  // The length of quote (number of characters)
  length: number
  // An array of tag names for this quote
  tags: [string]
}
```

### List Authors

Get a paginated list of all authors. By default, authors will be returned in alphabetical order (ascending). 

**Path**

```HTTP
GET /authors
```

**Query parameters**

| param     | type                           | Description                                                   |
| :-------- | :----------------------------- | :------------------------------------------------------------ |
| name      | `String`                       | Search for authors by name. Supports fuzzy search.            |
| sortBy    | `enum: ['name', 'quoteCount']` | The field used to sort authors. Default is 'name'             |
| sortOrder | `enum: ['asc', 'desc']`        | The order results are sorted in. Default is 'asc'             |
| limit     | `Int`                          | The number of authors to return per request. (for pagination) |
| skip      | `Int`                          | The number of items to skip (for pagination)                  |

**Response**

```ts
{
  // The number of authors return by this request.
  count: number
  // The total number of authors matching this request.
  totalCount: number
  // The index of the last item returned. When paginating through results,
  // this value would be used as the `skip` parameter when requesting the next
  // "page" of results. It will be set to `null` if there are no additional results.
  lastItemIndex: number | null
  // The array of authors
  results: Array<{
    // A unique id for this author
    _id: string
    // The authors full name
    name: string 
    // The number of quotes by this author
    quoteCount: string
  }>
}
```

### Get Author By ID

Get a specific author by ID. The response includes all quotes by the given author. 

**Path**

```HTTP
GET /authors/:id
```

**Response**

```ts
{
  // A unique id for this author
  _id: string
  // The authors full name
  name: string
  // The number of quotes by this author
  quoteCount: string
  // The array of quotes by this author (not paginated)
  quotes: Array<{
    _id: string
    // The quotation text
    content: string
    // The full name of the author
    author: string
    // An array of tag names for this quote
    tags: [string]
    // The length of quote (number of characters)
    length: number
  }>
}
```

### List Tags

Get a list of all tags

**Path**

```HTTP
GET /tags
```

**Response**

```ts
{
  // The number of all tags by this request
  count: number
  // The array of tags
  results: Array<{
    _id: string
    name: string
  }>
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

### Live Examples

[Basic Random Quote (CodePen)](https://codepen.io/lukePeavey/pen/RwNVeQG)

[React Random Quote (CodeSandbox)](https://codesandbox.io/s/quotable-demo-react-e7zm1?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark)

## Contributing

All contributions are welcome! For more info on how to contribute, check out the [Contributors Guide](./CONTRIBUTING.md)

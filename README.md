# Quotable

Quotable is a free, open source quotations API. It was originally built as part of a [FreeCodeCamp](https://www.freecodecamp.org/) project. The database includes over 2000 quotes by 900 authors.

- [Servers](#servers)
- [API Reference](#api-reference)
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

| Name       | URL                 | Description                                      |
| :--------- | :------------------ | :----------------------------------------------- |
| Staging    | staging.quotable.io | Synced with the master branch of this repository |
| Production | api.quotable.io     | The primary API server                           |

## API Reference

### Get random quote

Returns a single random quote from the database

```HTTP
GET /random
```

#### Query parameters

| param     | type     | Description                                                                                                                                                                                                                                                                                                            |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                                  |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                                  |
| tags      | `String` | Filter random quote by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |
| author    | `String` | Get random quote by a specific author(s). The value can be an author `name` or `slug`. To include quotes by multiple authors, provide a pipe-separated list of author names/slugs.                                                                                                                                     |
| authorId  | `String` | `deprecated` <br> Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                                |

#### Response

```ts
{
  _id: string
  // The quotation text
  content: string
  // The full name of the author
  author: string
  // The `slug` of the quote author
  authorSlug: string
  // The length of quote (number of characters)
  length: number
  // An array of tag names for this quote
  tags: string[]
}
```

#### Examples

Random Quote [try in browser](https://api.quotable.io/random)

```HTTP
GET /random
```

Random Quote with tags "technology" **`AND`** "famous-quotes" [try in browser](https://api.quotable.io/random?tags=technology,famous-quotes)

```HTTP
GET /random?tags=technology,famous-quotes
```

Random Quote with tags "History" **`OR`** "Civil Rights" [try in browser](https://api.quotable.io/random?tags=history|civil-rights)

```HTTP
GET /random?tags=history|civil-rights
```

Random Quote with a maximum length of 50 characters [try in browser](https://api.quotable.io/random?maxLength=50)

```HTTP
GET /random?maxLength=50
```

Random Quote with a length between 100 and 140 characters [try in browser](https://api.quotable.io/random?minLength=100&maxLength=140)

```HTTP
GET /random?minLength=100&maxLength=140
```

### List Quotes

Get a paginated list of all quotes. This method supports several filter and sorting options.

```HTTP
GET /quotes
```

#### Query parameters

| param     | type     | Description                                                                                                                                                                                                                                                                                                      |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit     | `Int`    | `Min: 1` `Max: 100` `Default: 20` <br> The number of quotes to return per request. (for pagination).                                                                                                                                                                                                             |
| skip      | `Int`    | `Min: 0` `Default: 0` <br> The number of items to skip (for pagination).                                                                                                                                                                                                                                         |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                            |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                            |
| tags      | `String` | Filter quotes by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |
| author    | `String` | Get quotes by a specific author. The value can be an author `name` or `slug`. To get quotes by multiple authors, provide a pipe separated list of author names/slugs.                                                                                                                                            |
| authorId  | `String` | `deprecated` <br> Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                          |

#### Response

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
    // The `slug` of the quote author
    authorSlug: string
    // The length of quote (number of characters)
    length: number
    // An array of tag names for this quote
    tags: string[]
  }>
}
```

### Get Quote By ID

Get a quote by its ID

```HTTP
GET /quotes/:id
```

#### Response

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
  tags: string[]
}
```

### List Authors

Get a paginated list of all authors. By default, authors will be returned in alphabetical order (ascending).

```HTTP
GET /authors
```

#### Query parameters

| param     | type                           | Description                                                                                          |
| :-------- | :----------------------------- | :--------------------------------------------------------------------------------------------------- |
| sortBy    | `enum: ['name', 'quoteCount']` | `Default: "name"` <br> The field used to sort authors.                                               |
| sortOrder | `enum: ['asc', 'desc']`        | `Default: "asc"` <br> The order results are sorted in.                                               |
| limit     | `Int`                          | `Min: 1` `Max: 100` `Default: 20` <br> The number of authors to return per request. (for pagination) |
| skip      | `Int`                          | `Min: 0` `Default: 0` <br> The number of items to skip (for pagination)                              |

#### Response

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
    // A brief, one paragraph bio of the author. Source: wiki API
    bio: string
    // A one-line description of the author. Typically it is the person's primary
    // occupation or what they are know for.
    description: string
    // The link to the author's wikipedia page or official website
    link: string
    // The authors full name
    name: string
    // A slug is a URL-friendly ID derived from the authors name. It can be used as
    slug: string
    // The number of quotes by this author
    quoteCount: string
  }>
}
```

### Get Author By ID

Get details about a specific author by `_id`.

```HTTP
GET /authors/:id
```

#### Response

```ts
{
  // A unique id for this author
  _id: string
  // A brief, one paragraph bio of the author. Source wiki API.
  bio: string
  // A one-line description of the author.
  description: string
  // The link to the author's wikipedia page or official website
  link: string
  // The authors full name
  name: string
  // A slug is a URL-friendly ID derived from the authors name. It can be used as
  slug: string
  // The number of quotes by this author
  quoteCount: string
  // The array of quotes by this author (not paginated)
  // @deprecated
  quotes: Array<{
    _id: string
    // The quotation text
    content: string
    // The full name of the author
    author: string
    // The `slug` of the quote author
    authorSlug: string
    // An array of tag names for this quote
    tags: string[]
    // The length of quote (number of characters)
    length: number
  }>
}
```

### List Tags

```HTTP
GET /tags
```

Get a list of all tags

#### Query parameters

| param     | type                           | Description                                                              |
| :-------- | :----------------------------- | :----------------------------------------------------------------------- |
| sortBy    | `enum: ['name', 'quoteCount']` | `Default: "name"` <br> The field used to sort tags.                      |
| sortOrder | `enum: ['asc', 'desc']`        | `Default: depends on sortBy` <br> The order in which results are sorted. |

#### Response

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

Get a random quote (fetch)

```js
fetch('https://api.quotable.io/random')
  .then(response => response.json())
  .then(data => {
    console.log(`${data.content} —${data.author}`)
  })
```

Get a random quote (async/await)

```js
async function randomQuote() {
  const response = await fetch('https://api.quotable.io/random')
  const data = await response.json()
  console.log(`${data.content} —${data.author}`)
}
randomQuote()
```

Get a random quote (JQuery)

```js
$.getJSON('https://api.quotable.io/random', function (data) {
  console.log(`${data.content} —${data.author}`)
})
```

### Live Examples

[Basic Random Quote (CodePen)](https://codepen.io/lukePeavey/pen/RwNVeQG)

[React Random Quote (CodeSandbox)](https://codesandbox.io/s/quotable-demo-react-e7zm1?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark)

## Contributing

All contributions are welcome! For more info on how to contribute, check out the [Contributors Guide](./CONTRIBUTING.md)

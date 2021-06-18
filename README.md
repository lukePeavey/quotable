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
| authorId  | `String` | `deprecated` <br> Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                                |  |

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

Get all quotes matching a given query. By default, this will return a paginated list of all quotes, sorted by `_id`. Quotes can also be filter by author, tag, and length.

```HTTP
GET /quotes
```

#### Query parameters

| param     | type     | Description                                                                                                                                                                                                                                                                                                      |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                            |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                            |
| tags      | `String` | Filter quotes by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags. |
| author    | `String` | Get quotes by a specific author. The value can be an author `name` or `slug`. To get quotes by multiple authors, provide a pipe separated list of author names/slugs.                                                                                                                                            |
| authorId  | `String` | `deprecated` <br> Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                          |
| sortBy    | `enum`   | `default: "dateAdded"` &nbsp; `values: "dateAdded", "dateModified", "author", "content"` <br> The field used to sort quotes                                                                                                                                                                                      |
| order     | `enum`   | `values: "asc", "desc"` <br> The order in which results are sorted. The default order depends on the sortBy field. For string fields that are sorted alphabetically, the default order is ascending. For number and date fields, the default order is descending.                                                |
| limit     | `Int`    | `Min: 1` &nbsp; `Max: 150` &nbsp; `Default: 20` <br> Sets the number of results per page.                                                                                                                                                                                                                        |
| page      | `Int`    | `Min: 1` &nbsp; `Default: 1` <br> The page of results to return. If the value is greater than the total number of pages, request will not return any results                                                                                                                                                     |

#### Response

```ts
{
  // The number of quotes returned in this response
  count: number
  // The total number of quotes matching this query
  totalCount: number
  // The current page number
  page: number
  // The total number of pages matching this request
  totalPages: number
  // The 1-based index of the last result included in the current response.
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

#### Examples

Get the first page of quotes, with 20 results per page [try in browser](https://quotable.io/quotes?page=1)

```HTTP
GET /quotes?page=1
```

Get the second page of quotes, with 20 results per page [try in browser](https://quotable.io/quotes?page=2)

```HTTP
GET /quotes?page=2
```

Get all quotes with the tags `love` `OR` `happiness` [try in browser](https://quotable.io/quotes?tags=love|happiness)

```HTTP
GET /quotes?tags=love|happiness
```

Get all quotes with the tags `technology` `AND` `famous-quotes` [try in browser](https://quotable.io/quotes?tags=technology,famous-quotes)

```HTTP
GET /quotes?tags=technology,famous-quotes
```

Get all quotes by author, using the author's `slug`. [try in browser](https://quotable.io/quotes?author=albert-einstein)

```HTTP
GET /quotes?author=albert-einstein
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

Get all authors matching the given query. This endpoint can be used to list authors, with several options for sorting and filter. It can also be used to get author details for one or more specific authors, using the author slug or ids.

```HTTP
GET /authors
```

#### Query parameters

| param  | type     | Description                                                                                                                                                                                                                                                                                    |
| :----- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| slug   | `string` | Filter authors by slug. The value can be one or more author slugs. To get multiple authors by slug, the value should be a pipe separated list of slugs.                                                                                                                                        |
| sortBy | `enum`   | `Default: "name"` &nbsp; `values: "dateAdded", "dateModified", "name", "quoteCount"` <br> The field used to sort authors.                                                                                                                                                                      |
| order  | `enum`   | `values: "asc", "desc"` <br> The order in which results are sorted. The default order depends on the sortBy field. For string fields that are sorted alphabetically (ie `name`), the default order is ascending. For number and date fields (ie `quoteCount`) the default order is descending. |
| limit  | `Int`    | `Min: 1` &nbsp; `Max: 150` &nbsp; `Default: 20` <br> Sets the number of results per page.                                                                                                                                                                                                      |
| page   | `Int`    | `Min: 1` &nbsp; `Default: 1` <br> The page of results to return. If the value is greater than the total number of pages, request will not return any results                                                                                                                                   |

#### Response

```ts
{
  // The number of results included in this response.
  count: number
  // The total number of results matching this request.
  totalCount: number
  // The current page number
  page: number
  // The total number of pages matching this request
  totalPages: number
  // The 1-based index of the last result included in this response. This shows the
  // current pagination offset.
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

#### Examples

Get all authors, sorted alphabetically by name [try in browser](https://quotable.io/authors?sortBy=name&order=asc)

```HTTP
GET /authors?sortBy=name
```

Get all authors, sorted by number of quotes in descending order [try in browser](https://quotable.io/authors?sortBy=quoteCount&order=desc)

```HTTP
GET /authors?sortBy=quoteCount&order=desc
```

Get a single author by slug. [try in browser](https://quotable.io/authors?slug=albert-einstein)

```HTTP
GET /authors?slug=albert-einstein
```

Get multiple authors by slug. In this case, you provide a pipe-separated list of slugs [try in browser](https://quotable.io/authors?slug=albert-einstein|abraham-lincoln)

```HTTP
GET /authors?slug=albert-einstein|abraham-lincoln
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

| param  | type   | Description                                                                                                                                                                                                                                                       |
| :----- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sortBy | `enum` | `Default: "name"` &nbsp; `values: "dateAdded", "dateModified", "name", "quoteCount"` <br> The field used to sort tags.                                                                                                                                            |
| order  | `enum` | `values: "asc", "desc"` <br> The order in which results are sorted. The default order depends on the sortBy field. For string fields that are sorted alphabetically, the default order is ascending. For number and date fields, the default order is descending. |

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

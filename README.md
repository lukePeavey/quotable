# Quotable

[![CI Tests](https://github.com/lukePeavey/quotable/actions/workflows/tests.yml/badge.svg)](https://github.com/lukePeavey/quotable/actions/workflows/tests.yml)&nbsp; &nbsp;

Quotable is a free, open source quotations API. It was originally built as part of a [FreeCodeCamp](https://www.freecodecamp.org/) project. If you are interested in contributing, please check out the [Contributors Guide](CONTRIBUTING.md).

### Rate Limit

There is a rate limit of **180 requests per minute**, per IP address. If you exceed the rate limit, the API will respond with a `429` error.

### API Servers
```
https://api.quotable.io
```

### Postman

You can try out the API on our public Postman workspace. 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/quotable/workspace/quotable)


## API Reference <!-- omit in toc -->

- [Get random quote](#get-random-quote)
- [Get Random Quotes](#get-random-quotes)
- [List Quotes](#list-quotes)
- [Get Quote By ID](#get-quote-by-id)
- [List Authors](#list-authors)
- [Search Quotes (beta)](#search-quotes-beta)
- [Search Authors (beta)](#search-authors-beta)
- [Get Author By Slug](#get-author-by-slug)
- [List Tags](#list-tags)

## Examples <!-- omit in toc -->

- [Basic Quote Machine (CodePen)](https://codepen.io/lukePeavey/pen/RwNVeQG)
- [React Quote Machine (CodeSandbox)](https://codesandbox.io/s/quotable-demo-react-e7zm1?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark)
- [React Native App (Github)](https://github.com/siddsarkar/SociQuote)
- [Paginated Author List (codeSandbox)](https://codesandbox.io/s/quotable-author-list-2-14le9)
- [Paginated Quote List (codeSandbox)](https://codesandbox.io/s/quotable-get-quotes-with-author-details-iyxw8)

## Get random quote

```HTTP
GET /random
```

Returns a single random quote from the database

> ⛔️ This method is deprecated in favor of [Get Random Quotes](#get-random-quotes)

**Query parameters**


| param     | type     | Description                                                                                                                                                                                                                                                                                                                          |
| :-------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                                                |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                                                |
| tags      | `String` | Get a random quote with specific tag(s). This takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **any one** of the provided tags. Tag names are **not** case-sensitive. Multi-word tags can be kebab-case ("tag-name") or space separated ("tag name") |
| author    | `String` | Get a random quote by one or more authors. The value can be an author `name` or `slug`. To include quotes by multiple authors, provide a pipe-separated list of author names/slugs.                                                                                                                                                  |
| authorId  | `String` | `deprecated` <br> Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                                          |

**Response**

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
<br>

## Get Random Quotes

```HTTP
GET /quotes/random
```

Get one or more random quotes from the database.  This method supports several filters that can be used to get random quotes with specific properties (ie tags, quote length, etc.)

By default, this methods returns a single random quote. You can specify the number of random quotes to return via the `limit` parameter.  

> ⚠️ This method is equivalent to the `/random` endpoint. The only difference is the response format:
> Instead of retuning a single `Quote` object, this method returns an `Array` of `Quote` objects.


<br>

| param     | type     | Description                                                                                                                                                                                                                                                                                                                          | 
| :-------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| limit     | `Int`    | `default: 1` &nbsp; `min: 1` &nbsp; `max: 50` <br> The number of random quotes to retrieve.                                                                                                                                                                       |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                                                |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                                                |
| tags      | `String` | Get a random quote with specific tag(s). This takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **any one** of the provided tags. Tag names are **not** case-sensitive. Multi-word tags can be kebab-case ("tag-name") or space separated ("tag name") |
| author    | `String` | Get a random quote by one or more authors. The value can be an author `name` or `slug`. To include quotes by multiple authors, provide a pipe-separated list of author names/slugs.                                                                                                                                                  |
| authorId  | `String` | `deprecated` <br>Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                                          | 

**Response**

```ts
// An array containing one or more Quotes
Array<{
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
```


**Examples**

Get random quote [try in browser](https://api.quotable.io/quotes/random)

```HTTP
GET /quotes/random
```

Get 5 random quotes [try in browser](https://api.quotable.io/quotes/random?limit=3)

```HTTP
GET /quotes/random?limit=3
```


Random Quote with tags "technology" **`AND`** "famous-quotes" [try in browser](https://api.quotable.io/quotes/random?tags=technology,famous-quotes)

```HTTP
GET /quotes/random?tags=technology,famous-quotes
```

Random Quote with tags "History" **`OR`** "Civil Rights" [try in browser](https://api.quotable.io/quotes/random?tags=history|civil-rights)

```HTTP
GET /quotes/random?tags=history|civil-rights
```

Random Quote with a maximum length of 50 characters [try in browser](https://api.quotable.io/quotes/random?maxLength=50)

```HTTP
GET /quotes/random?maxLength=50
```

Random Quote with a length between 100 and 140 characters [try in browser](https://api.quotable.io/quotes/random?minLength=100&maxLength=140)

```HTTP
GET /quotes/random?minLength=100&maxLength=140
```

<br>

## List Quotes

```HTTP
GET /quotes
```

Get all quotes matching a given query. By default, this will return a paginated list of all quotes, sorted by `_id`. Quotes can also be filter by author, tag, and length.

**Query parameters**

| param     | type     | Description                                                                                                                                                                                                                                                                                                      |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxLength | `Int`    | The maximum Length in characters ( can be combined with `minLength` )                                                                                                                                                                                                                                            |
| minLength | `Int`    | The minimum Length in characters ( can be combined with `maxLength` )                                                                                                                                                                                                                                            |
| tags      | `String` | Filter quotes by tag(s). Takes a list of one or more tag names, separated by a comma (meaning `AND`) or a pipe (meaning `OR`). A comma separated list will match quotes that have **_all_** of the given tags. While a pipe (`\|`) separated list will match quotes that have **_either_** of the provided tags.  Tag names are **not** case-sensitive. Multi-word tags can be kebab-case ("tag-name") or space separated ("tag name") |
| author    | `String` | Get quotes by a specific author. The value can be an author `name` or `slug`. To get quotes by multiple authors, provide a pipe separated list of author names/slugs.                                                                                                                                            |
| authorId  | `String` | `deprecated` <br> Same as `author` param, except it uses author `_id` instead of `slug`                                                                                                                                                                                                                      |
| sortBy    | `enum`   | `Default: "dateAdded"` &nbsp; `values: "dateAdded", "dateModified", "author", "content"` <br> The field used to sort quotes                                                                                                                                                                                  |
| order     | `enum`   | `values: "asc", "desc"` &nbsp; `default: depends on sortBy` <br> The order in which results are sorted. The default order depends on the sortBy field. For string fields that are sorted alphabetically, the default order is ascending. For number and date fields, the default order is descending.        |
| limit     | `Int`    | `Min: 1` &nbsp; `Max: 150` &nbsp; `Default: 20` <br> Sets the number of results per page.                                                                                                                                                                                                                    |
| page      | `Int`    | `Min: 1` &nbsp; `Default: 1` <br> The page of results to return. If the value is greater than the total number of pages, request will not return any results                                                                                                                                                 |

**Response**

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

**Examples**

Get the first page of quotes, with 20 results per page [try in browser](https://api.quotable.io/quotes?page=1)

```HTTP
GET /quotes?page=1
```

Get the second page of quotes, with 20 results per page [try in browser](https://api.quotable.io/quotes?page=2)

```HTTP
GET /quotes?page=2
```

Get all quotes with the tags `love` `OR` `happiness` [try in browser](https://api.quotable.io/quotes?tags=love|happiness)

```HTTP
GET /quotes?tags=love|happiness
```

Get all quotes with the tags `technology` `AND` `famous-quotes` [try in browser](https://api.quotable.io/quotes?tags=technology,famous-quotes)

```HTTP
GET /quotes?tags=technology,famous-quotes
```

Get all quotes by author, using the author's `slug`. [try in browser](https://api.quotable.io/quotes?author=albert-einstein)

```HTTP
GET /quotes?author=albert-einstein
```

<br>

## Get Quote By ID

```HTTP
GET /quotes/:id
```

Get a quote by its ID

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
  tags: string[]
}
```

<br>

## List Authors

```HTTP
GET /authors
```

Get all authors matching the given query. This endpoint can be used to list authors, with several options for sorting and filter. It can also be used to get author details for one or more specific authors, using the author slug or ids.

**Query parameters**

| param  | type     | Description                                                                                                                                                                                                                                                                                       |
| :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| slug   | `string` | Filter authors by slug. The value can be one or more author slugs. To get multiple authors by slug, the value should be a pipe separated list of slugs.                                                                                                                                           |
| sortBy | `enum`   | `Default: "name"` &nbsp; `values: "dateAdded", "dateModified", "name", "quoteCount"` <br> The field used to sort authors.                                                                                                                                                                      |
| order  | `enum`   | `values: "asc", "desc"` <br> The order in which results are sorted. The default order depends on the sortBy field. For string fields that are sorted alphabetically (ie `name`), the default order is ascending. For number and date fields (ie `quoteCount`) the default order is descending. |
| limit  | `Int`    | `Min: 1` &nbsp; `Max: 150` &nbsp; `Default: 20` <br> Sets the number of results per page.                                                                                                                                                                                                      |
| page   | `Int`    | `Min: 1` &nbsp; `Default: 1` <br> The page of results to return. If the value is greater than the total number of pages, request will not return any results                                                                                                                                   |

**Response**

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

**Examples**

Get all authors, sorted alphabetically by name [try in browser](https://api.quotable.io/authors?sortBy=name&order=asc)

```HTTP
GET /authors?sortBy=name
```

Get all authors, sorted by number of quotes in descending order [try in browser](https://api.quotable.io/authors?sortBy=quoteCount&order=desc)

```HTTP
GET /authors?sortBy=quoteCount&order=desc
```

Get a single author by slug. [try in browser](https://api.quotable.io/authors?slug=albert-einstein)

```HTTP
GET /authors?slug=albert-einstein
```

Get multiple authors by slug. In this case, you provide a pipe-separated list of slugs [try in browser](https://api.quotable.io/authors?slug=albert-einstein|abraham-lincoln)

```HTTP
GET /authors?slug=albert-einstein|abraham-lincoln
```

<br>

## Search Quotes (beta)

```HTTP
GET /search/quotes
```

This endpoint allows you to search for quotes by keywords, content, and/or author name. Unlike the [List Quotes](#list-quotes) endpoint, this method is powered by [Atlas Search](https://docs.atlas.mongodb.com/atlas-search/) and is designed to power a search bar UI.

- Search results are sorted by score
- The query can be wrapped in quotes to search for an exact phrase. In this case, results will only include quotes that match the query exactly.
- Supports fuzzy search (optional). This allows for minor typos and misspelling in the search query. For more info on how this works, refer to the [Atlas docs](https://docs.atlas.mongodb.com/reference/atlas-search/text/#fields)

**Query Params**

| Param              | Type     | Description                                                                                                                                                                                                                                   |
| :----------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| query              | `String` | The search string. The query can be wrapped in quotes to search for an exact phrase.                                                                                                                                                          |
| fields             | `String` | `Default: "content,author,tags"` <br> Specify the fields to search by. This takes a comma separated list of field names. Supported search fields are "content", "author", "tags". By default, it will search by all fields simultaneously. |
| fuzzyMaxEdits      | `Int`    | `Min: 0` &nbsp; `Max: 2` &nbsp; `Default: 0` <br>  The maximum number of single-character edits required to match the specified search term. Setting this to zero disables fuzzy matching.                                                 |
| fuzzyMaxExpansions | `Int`    | `Max: 150` &nbsp; `Min: 0` &nbsp; `Default: 50` <br>  When fuzzy search is enabled, this is the maximum number of variations to generate and search for. This limit applies on a per-token basis.                                          |
| limit              | `Int`    | `Min: 0` &nbsp; `Max: 150` &nbsp; `Default: 20` <br>  The maximum number of results per page                                                                                                                                               |
| page               | `Int`    | `Min: 1` &nbsp; `Default: 1` <br>  Sets the page number for pagination                                                                                                                                                                     |

**Response**

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

**Examples**

Search for "every good technology is basically magic" ([try in browser](https://api.quotable.io/search/quotes?query=every+good+technology+is+basically+magic&fields=content))

```HTTP
GET /search/quotes?query=every good technology is basically magic
```

> Results:
>
> - "Any sufficiently advanced technology is equivalent to magic."

Search for the phrase "divided house"

```HTTP
GET /search/quotes?query=divided house
```

> Results
>
> - "A house divided against itself cannot stand."

Search for quotes with the keywords "life" or "happiness" ([try in browser](https://api.quotable.io/search/quotes?query=life+happiness))

```HTTP
GET /search/quotes?query=life happiness
```

Search for quotes by an author named "kennedy" ([try in browser](https://api.quotable.io/search/quotes?query=kennedy&fields=author))

```HTTP
GET /search/quotes?query=Kennedy&fields=author
```

<br>

## Search Authors (beta)

```HTTP
GET  /search/authors
```

This endpoint allows you search for authors by name. It is designed to power a search bar for authors that displays autocomplete suggests as the user types.

- Powered by [Atlas Search](https://docs.atlas.mongodb.com/atlas-search/).
- Real autocomplete
- Results are sorted by score
- Parses the query into "terms". Things like initials, prefixes, suffixes, and stopwords are not considered search terms. They will still impact the score of a result, but are not required to match.

```
Example
query="John F. Kennedy"
terms=["john", "kennedy"]

 term      term
  |         |
John  F.  Kennedy  Jr.
      |             |
   initial        suffix

Example
query="Saint Augustine of Hippo"
terms=["Augustine", "Hippo"]

        term        term
          |          |
 Saint Augustine of Hippo
   |             |
prefix        stopword
```

**Query Parameters**

| Param          | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| query          | `String`  | The search query                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| autocomplete   | `Boolean` | `default: true` <br>  Enables autocomplete matching                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| matchThreshold | `Int`     | `Min: 1` &nbsp; `Max: 3` &nbsp; `Default: 2` <br>  Sets the minimum number of search terms (words) that must match for an author to be included in results. Basically, if this is set to 1, the results will include all authors that match at least one part of the name. So query="John F. Kennedy" the results would include all authors that match either "john" `OR` "kennedy". <br> If this is set to `2`: when the search query includes two or more "terms", at least two of those terms must match. So query="John F. Kennedy" would only return authors that match "John" `AND` "Kennedy". |
| limit          | `Int`     | `Min: ` &nbsp; `Max: 150` &nbsp; `Default: 20` <br>  Maximum number of results per page                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| page           | `Int`     | `Min: 1` &nbsp; `Default: 1` <br> Sets the page number for pagination                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Response**

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

**Examples**

Search for author named "Einstein" ([try in browser](https://api.quotable.io/search/authors?query=einstein))

```HTTP
GET /search/authors?query=Einstein
```

> Results:
>
> - Albert Einstein

Autocomplete search for "Einstein" ([try in browser](https://api.quotable.io/search/authors?query=Einst))

```HTTP
GET /search/authors?query=Einst
```

> Results:
>
> - Albert Einstein

Search for "John Adams" ([try in browser](https://api.quotable.io/search/authors?query=john+adams))

```HTTP
GET /search/authors?query=john adams
```

> Results
>
> - John Adams
> - John Quincy Adams

Search for "John Quincy Adams" ([try in browser](https://api.quotable.io/search/authors?query=john+quincy+adams))

```HTTP
GET /search/authors?query=john quincy adams
```

> Results:
>
> - John Quincy Adams)
> - John Adams

<br>

## Get Author By Slug

Get a _single_ `Author` by `slug`. This method can be used to get author details such as bio, website link, and profile image.

If you want to get all _quotes_ by a specific author, use the [/quotes](#list-quotes) endpoint and filter by author author name/slug.

If you want to get _multiple_ authors by slug in a single request, use the [/authors](#list-authors) endpoint and filter by `slug`.

```HTTP
GET /authors/:id
```

**Response**

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
}
```

<br>

## List Tags

```HTTP
GET /tags
```

Get a list of all tags

**Query parameters**

| param  | type   | Description                                                                                                                                                                                                                                                          |
| :----- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sortBy | `enum` | `Default: "name"` &nbsp; `values: "dateAdded", "dateModified", "name", "quoteCount"` <br> The field used to sort tags.                                                                                                                                            |
| order  | `enum` | `values: "asc", "desc"` <br> The order in which results are sorted. The default order depends on the sortBy field. For string fields that are sorted alphabetically, the default order is ascending. For number and date fields, the default order is descending. |

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

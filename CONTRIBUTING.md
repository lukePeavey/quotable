# Contributing

All contributions are greatly appreciated!

## Discussions

Use the Discussion area to ask questions, get help, discuss ideas, etc.

![](https://user-images.githubusercontent.com/8286271/125716446-d7af1019-58c2-4ad6-93da-b21e7d0bb303.jpg)

## Issues

Please select the appropriate issue template when opening a new issue. For

### :bulb: Feature

Suggest a new API feature

### :zap: Enhancement

Suggest changes to improve an existing API method. For example, adding a new sorting method, etc.

### :bug: Bug

If something is not working as expected (based on the current documentation), file a bug report.

Bugs should be reproducible using a API client like Postman or Chrome.

## Pull Requests

All pull requests are welcome!

- [Fork][fork-a-repo] the repository on GitHub.

- [Clone][cloning-a-repo] the forked repo to your local machine.

- Create a new [feature branch][feature-branch] from master

- Commit your changes

- Push your changes back up to your fork.

- When you're ready, submit a [pull request][pull-requests] so that we can review your changes

If you have an existing fork, make sure to pull the latest changes from the upstream repository before working on a new contribution.

```shell
$ git remote add upstream https://github.com/lukePeavey/quotable.git
$ git pull upstream master
```

## Running the API Locally

If you are working on changes to the source code, you will want to run the server locally so you test your changes as you work.

**Requirements**

- node >= 12.x
- npm >= 6.x
- mongodb >= 4.2

**1. Create a database**

Create a MongoDB database called quotable. If you don't have MongoDB setup locally, you can use [MongoDB Atlas][mongodb/atlas] to create a free hosted database.

**2. Environment Variables**

You need to set the `MONGODB_URI` environment variable to point to your database. Create a file called `.env` in the root directory of the project. Add the following line (replace `<your-database-uri>` with the connection string for your database).

```shell
MONGODB_URI=<your-mongodb-uri>
```

**3. Install dependencies**

```shell
$ npm install
```

**4. Seed the database**

This script will populate your database with the sample data included in the repository.

```shell
$ npm run database:seed data/sample
```

**4. Start the Server**

The server will automatically restart when you make changes to the code.

```shell
$ npm run start:dev
```

**5. Running Tests**

Before submitting a PR, make sure all tests are passing.

```shell
# Runs tests
$ npm run test
# Check for lint issues
$ npm run lint
```

[mongodb/atlas]: https://www.mongodb.com/cloud/atlas
[fork-a-repo]: https://help.github.com/en/articles/fork-a-repo
[cloning-a-repo]: https://help.github.com/en/articles/cloning-a-repository
[feature-branch]: https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
[pull-requests]: https://help.github.com/en/articles/about-pull-requests

#!/usr/bin/env

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
require('dotenv').config({})
const mongoose = require('mongoose')
const upperFirst = require('lodash/upperFirst')
const chalk = require('chalk')
const Table = require('cli-table3')
const fs = require('fs')
const path = require('path')
const Spinner = require('./utils/Spinner')
require('../src/models')

// -------------------------------------------------------------------------

// A CLI script thats seeds a MongoDB database using Mongoose models and data
// from JSON files.
//
// Usage:
// npm run database:seed <dir> <MONGODB_URI>
//
// Args:
// <dir> (required) The path to the data directory (relative to project root).
// The data directory should contain JSON files for each of the database
// models defined in `src/models`.
//
// <MONGODB_URI> (optional) The mongodb database to connect to. By default it
// will use the value from environment variables.

// -------------------------------------------------------------------------

/** Converts a collection name to model name (ie 'quotes' -> 'Quote') */
function getModelName(COLLECTION_NAME) {
  return upperFirst(COLLECTION_NAME.replace(/s$/, ''))
}

/** Parses and validates CLI arguments */
function parseArgs() {
  const args = process.argv.slice(2)
  const DIR = args[0] && path.join(process.cwd(), args[0])
  const MONGODB_URI = args[1] || process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  if (!DIR) {
    throw new Error('Missing argument `<dir>`')
  }
  // Make sure the directory exists
  if (!fs.existsSync(DIR)) {
    throw new Error(`Data directory does not exist:\n${DIR}`)
  }
  // Make sure the directory contains JSON files
  if (!fs.readdirSync(DIR).filter(file => file.endsWith('.json')).length) {
    throw new Error(`Data directory does not contain JSON files\n${DIR}`)
  }
  return { DIR, MONGODB_URI }
}

/** Reads and parses the data files. */

function readDataFiles(DIR) {
  const files = fs.readdirSync(DIR).filter(FILE => /(.json)$/.test(FILE))
  return files.reduce((data, FILE) => {
    const MODEL_NAME = getModelName(path.basename(FILE, '.json'))
    if (!mongoose.modelNames().includes(MODEL_NAME)) {
      throw new Error(`Could not find model for the following file:\n${FILE}`)
    }
    const documents = JSON.parse(fs.readFileSync(path.join(DIR, FILE)))
    return [...data, [MODEL_NAME, documents]]
  }, [])
}

/** Opens a mongoose connection */
function openConnection(MONGODB_URI) {
  return mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    connectTimeoutMS: 5000,
  })
}

/** Closes a mongoose connection */
function closeConnection() {
  return mongoose.connection.close()
}

/** Seeds a database collection */
async function seedCollection([MODEL_NAME, documents]) {
  const model = mongoose.models[MODEL_NAME]
  // Remove all existing data from the collection
  await model.deleteMany({})
  // Insert `documents`.
  const result = await model.insertMany(documents, {
    ordered: true,
    rawResult: true,
  })
  return [MODEL_NAME, result]
}

/** Outputs a table showing the results of the seeding process */
function logResults(results) {
  const table = new Table({})
  table.push(
    ...results.map(([MODEL_NAME, result]) => {
      return [`${MODEL_NAME}s`, `Inserted ${result.insertedCount} documents`]
    })
  )
  console.log(table.toString())
}

async function run() {
  const spinner = new Spinner()
  try {
    spinner.start('Parsing data files')
    const { DIR, MONGODB_URI } = parseArgs()
    const data = readDataFiles(DIR)
    spinner.succeed()

    spinner.start('Connecting to database')
    await openConnection(MONGODB_URI)
    spinner.succeed()

    spinner.start('Seeding collections')
    const results = await Promise.all(data.map(seedCollection))
    await closeConnection()
    spinner.succeed()

    logResults(results)
    process.exit(0)
  } catch (error) {
    spinner.fail()
    console.error(chalk.red(`\n${error.name}: ${error.message}\n`))
    // console.error(error)
    process.exit(1)
  }
}

run()

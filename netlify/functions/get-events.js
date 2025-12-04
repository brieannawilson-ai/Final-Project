const fs = require('fs')

exports.handler = async function (event, context) {
  try {
    // Local demo: read the packaged data/events.json file
    const raw = fs.readFileSync('./data/events.json', 'utf8')
    const events = JSON.parse(raw || '[]')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ events }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}

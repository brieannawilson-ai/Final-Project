const fs = require('fs')

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    if (!body || !body.title) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing event data (title required)' }),
      }
    }

    // Read current events (if present)
    let events = []
    try {
      const raw = fs.readFileSync('./data/events.json', 'utf8')
      events = JSON.parse(raw || '[]')
    } catch (e) {
      events = []
    }

    const newEvent = Object.assign({ id: Date.now().toString() }, body)
    events.push(newEvent)

    // Attempt to write back (works locally with netlify dev but is ephemeral when deployed)
    try {
      fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2), 'utf8')
    } catch (e) {
      // ignore write errors
    }

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ event: newEvent }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}


// logs into fauna
import { query as q } from 'faunadb'
import faunadb from 'faunadb'

import { getProfile } from './profile'



export async function get(req, res, next) {

  try {
    
    const client = new faunadb.Client({ secret: process.env.FAUNA_GUESTBOOK_KEY })

    const messages = await client.query(
      q.Map( // array of messages
        q.Paginate(
          q.Match(q.Index('guestbook')),
          { size: 100 }
        ),
        q.Lambda('X',q.Get(q.Var('X')))
      )
    )

		// const data = await response.json();

    req.session.messages = messages

    console.log('messages:', messages)

    // whitelist / remove pointers from client
    const clean = {data:messages.data.reduce((acc,val) => {
      console.log('messages::::', val)
      return [...acc, {
        data:{
          message: val.data.message,
          username: val.data.username,
        },
        ts: val.ts,
      }]
    },[])}

		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify(clean))

  } catch (error) {
    console.error('signature.js error:', error)
    res.statusCode = 403
    res.end()
    // next(error)
  }

}





export async function post(req, res, next) {

  const { sigName, sigMessage, sigPointer } = req.body
  const secret = req.session.secret

  try {
    
		// const user = await getProfile(secret)
  	console.log('[messages] creating signature::::', sigName, sigMessage, sigPointer)

    const client = new faunadb.Client({ secret: process.env.FAUNA_GUESTBOOK_KEY })

    const data = {
			username: sigName,
			message: sigMessage,
			pointer: sigPointer
    }
    const queryResponse = await client.query(
      q.Create(
      	q.Collection('Guestbook'),
      	{data} // shape is { data: } — we want the data object in here
      )
    )

    // const signatureInfo = { name: queryResponse.data.name, message: queryResponse.data.message, _ts: queryResponse.ts, ref: queryResponse.ref}
 		// console.log('sig info / success!', signatureInfo)

		// const data = await response.json();
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify(data))

  } catch (error) {
    console.error('signature.js create error:', error)
    res.statusCode = 403
    res.end()
    // next(error)
  }
}



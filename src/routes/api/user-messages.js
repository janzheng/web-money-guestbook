
// logs into fauna
import { query as q } from 'faunadb'
import faunadb from 'faunadb'

import { getProfile } from './profile'



export async function get(req, res, next) {

  try {
    
    const client = new faunadb.Client({ secret: process.env.FAUNA_USERS_KEY })

    const messages = await client.query(
      q.Let({
        messages: q.Map( // array of messages
          q.Paginate(
            q.Match(q.Index('all-messages')),
            { size: 100 }
          ),
          q.Lambda('X',q.Get(q.Var('X')))
        ),
        users: q.Map(
          q.Var('messages'),
          q.Lambda('Y',q.Get(q.Select(["data","user"],q.Var('Y'))))
        ),
        merged: q.Merge(
          { messages: q.Var('messages')},
          { users: q.Var('users')},
        )
      }, q.Var('merged') )
    )

		// const data = await response.json();

    req.session.messages = messages

		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify(messages))

  } catch (error) {
    console.error('signature.js error:', error)
    res.statusCode = 403
    res.end()
    // next(error)
  }

}





export async function post(req, res, next) {

  const { sigName, sigMessage } = req.body
  const secret = req.session.secret

  try {
    
		const user = await getProfile(secret)
  	console.log('[messages] creating signature::::', sigName, sigMessage, user.id)

    const client = new faunadb.Client({ secret: process.env.FAUNA_MESSAGES_KEY })

    const data = {
			name: sigName,
			message: sigMessage,
			user: user.id
    }
    const queryResponse = await client.query(
      q.Create(
      	q.Collection('messages'),
      	{data} // shape is { data: } — we want the data object in here
      )
    )

    const signatureInfo = { name: queryResponse.data.name, message: queryResponse.data.message, _ts: queryResponse.ts, ref: queryResponse.ref}
 		console.log('sig info / success!', signatureInfo)

		// const data = await response.json();
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify(signatureInfo))

  } catch (error) {
    console.error('signature.js create error:', error)
    res.statusCode = 403
    res.end()
    // next(error)
  }
}



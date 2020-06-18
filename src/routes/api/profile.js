
// logs into fauna
import { query as q } from 'faunadb'
import faunadb from 'faunadb'

export const getProfile = async faunaSecret => {
	const faunaClient = new faunadb.Client({secret: faunaSecret})
  const user = await faunaClient.query(q.Get(q.Identity()))
  const id = await faunaClient.query(q.Identity())
  return {id, user}
}

export function get(req, res, next) {

  const secret = req.session.secret

  if (!secret) {
		res.statusCode = 401
    res.end('No access')
  }

  try {
		getProfile(secret).then((result) => {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(result))
		}).catch((err) => {
			console.error('profile.js fauna no access', err)
			// res.statusCode = 401
	    // res.end('No access')
			throw new Error(err)
		})
  } catch(err) {
			console.error('profile.js something went wrong', err)
			throw new Error(err)
  }
}



// https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw


// const pointers = {
//   '$alice.example': 50,
//   '$bob.example': 40,
//   '$connie.example': 9.5,
//   '$dave.example': 0.5
// }
function getPointers(req) {

	// this is if we used user objects
  // const ptrArr = req.session.messages.users['data'].reduce((acc,user) => {
  // 	return [...acc, user.data.pointer]
  // },[])

  const ptrArr = req.session.messages['data'].reduce((acc,message) => {
    if(!message.data || !message.data.pointer)
      return acc
    
  	return [...acc, message.data.pointer]
  },[])

  const pointers = {}
  const len = ptrArr.length

  // console.log('ptrArr:', ptrArr)

  ptrArr.map(ptr => {
  	const num = ptrArr.reduce((acc, val) => (ptr === val ? acc + 1 : acc), 0) // how many times does it appear in the list
  	// console.log('ptr:', ptr, num)
  	pointers[ptr] = num/len * 100
  })

  return pointers
}

// this is the same `pickPointer()` function implemented in the previous snippet
function pickPointer (req) {
	const pointers = getPointers(req)
	// console.log('pointer list:', pointers)

  const sum = Object.values(pointers).reduce((sum, weight) => sum + weight, 0)
  let choice = Math.random() * sum
  
  for (const pointer in pointers) {
    const weight = pointers[pointer]
    if ((choice -= weight) <= 0) {
      return pointer
    }
  }
}


// the meta tag in the client should take care of paying
// function payPointer (res, pointer=pickPointer()) {
//   // turn the payment pointer into a URL in accordance with the payment pointer spec
//   // https://paymentpointers.org/
//   const asUrl = new URL(pointer.startsWith('$') ? 'https://' + pointer.substring(1) : pointer)
//   asUrl.pathname = asUrl.pathname === '/' ? '/.well-known/pay' : asUrl.pathname

//   // redirect to our chosen payment pointer so they get paid
//   // res.redirect(302, asUrl.href)
//   let url = asUrl.pathname
// 	let str = `Redirecting to ${url}`

// 	res.writeHead(302, {
// 		Location: url,
// 		'Content-Type': 'text/plain',
// 		'Content-Length': str.length
// 	})
// }


export async function get(req, res, next) {
  const pointer = pickPointer(req)
	// payPointer(res, pointer)
  // console.log('New pointer:', pointer)
	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify(pointer))
}

// export async function post(req, res, next) {
//   // is this request meant for Web Monetization?
//   if (req.header('accept').includes('application/spsp4+json')) {
//   	payPointer(res)
//   } else {
//   	// otherwise we're setting the pointers

//     next()
//   }
// }
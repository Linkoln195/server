const express = require('express')
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')

const client = new MongoClient(
	'mongodb+srv://user:user@cluster0.pkejb9l.mongodb.net/clicker-db?retryWrites=true&w=majority'
)

const app = express()
app.use(express.json())
app.use(cors())

const startDB = async () => {
	try {
		await client.connect()
		console.log('DB is OK')
	} catch (err) {
		console.log(err)
	}
}

startDB()
const clicks = client.db().collection('clicks')

app.post('/count-add', async (request, response) => {
	try {
		const clickCount = request.body.clickCount
		console.log(clickCount)
		await clicks.findOneAndUpdate(
			{ clickCount: Number },
			{ $set: { clickCount: clickCount } }
		)
		response.end('+1')
	} catch (err) {
		console.log(err)
		response.status(500).json({
			message: 'Error',
		})
	}
})

app.get('/get-clicks', async (request, response) => {
	try {
		const clickCount = await client
			.db()
			.collection('clicks')
			.findOne({ clickCount: Number })
			.then(response => {
				const count = response.clickCount
				return count
			})
		response.json(clickCount)
	} catch (err) {
		console.log(err)
		response.status(500).json({
			message: 'Error',
		})
	}
})

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on PORT: 4444`)
})

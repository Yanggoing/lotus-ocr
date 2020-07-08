const Client = require('aliyun-api-gateway').Client
const client = new Client('203814369', 'vont22ythnz5obhsz4ggv3n6b4ktee0r')
const express = require('express')
const bodyParser = require('body-parser')


const app = express()

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "content-type")
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
    if (req.method.toLowerCase() == 'options')
        res.send(200)
    else
        next()
})

app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}))

app.post('/getCarNumberInfo', async (req, res) => {
    var result = await client.post("https://ocrcp.market.alicloudapi.com/rest/160601/ocr/ocr_vehicle_plate.json", {
        data: {
            image: req.body.img
        },
        headers: {
            accept: 'application/json'
        }
    })
    res.json(result)
})


app.post('/getTextInfo', async (req, res) => {
    var result = await client.post("https://tysbgpu.market.alicloudapi.com/api/predict/ocr_general", {
        data: {
            image: req.body.img
        },
        headers: {
            accept: 'application/json'
        }
    })
    res.json(result)
})

app.listen(9999)
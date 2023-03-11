
const { response } = require('express')
const express = require('express')

const uuid = require('uuid')

const app = express()

app.use(express.json())

const port = 3000

const orders = []


const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(user => user.id === id)

    if(index < 0){
        return response.json({message: "User not found"})
    }

    request.userId = id
    request.userIndex = index

    next()
}

const checkMethod = (request, response, next) => {
    console.log(request.method, request.url)
    next()
}


app.get ("/order",checkMethod, (request,response)=>{
    return response.json(orders)
})


app.post("/order",checkMethod, (request,response)=>{
    const {order,clientName,price}= request.body

    const newOrder = {id: uuid.v4(), order,clientName,price, status: "Em processamento"}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put("/order/:id",checkUserId,checkMethod, (request, response)=>{
    const id =request.userId 
    const index = request.userIndex 
    const {order,clientName,price}= request.body
    const updatedOrder = {id, order,clientName,price,status:"Em processamento"}
    orders[index] = updatedOrder
    return response.status(203).json(updatedOrder)
})

app.delete("/order/:id",checkUserId,checkMethod, (request, response)=>{
    const index = request.userIndex

    orders.splice(index,1)

    return response.status(204).json()
})

app.get("/order/:id", checkUserId,checkMethod, (request, response) => {
    const index = request.userIndex
    return response.json(orders[index])
})

app.patch("/order/:id", checkUserId,checkMethod, (request, response)=>{
    const id = request.userId
    const index = request.userIndex
    const {order, clientName, price} = orders[index] // ele esta recebendo pelo index do array

    const finishedOrder = {id, order, clientName, price, status: "Pronto"}
    orders[index] = finishedOrder
    return response.status(200).json(finishedOrder)
})

app.listen(port,()=>{
    console.log(`🚀 Server started running on port ${port}`)
})
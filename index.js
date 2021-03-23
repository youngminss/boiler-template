const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://youngmin:abcd1234@boilertemplate.4bi8j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log("success !"))
.catch( err => console.log(err))

app.get('/', (req, res) => res.send("Hello World !!"));

app.listen(port, () => console.log(`Eample app listening on port ${port}!`));

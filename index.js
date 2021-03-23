const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const { User } = require('./models/User');  // User 스키마 가져오기
const config = require('./config/key');     // URI 정보 가져오기 (develop모드 or production 모드)

app.use(bodyParser.urlencoded({extended: true}));   // application/x-www-form-urlencoded 형태의 데이터를 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json()); // application/json 형태의 데이터를 분석해서 가져올 수 있게 해준다.

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI , {
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log("MongoDB Connected..."))
.catch( err => console.log(err))

app.get('/', (req, res) => res.send("Hello WEB Server !!"));

app.post('/register', (req, res) => {

    // 회원 가입 할때, 필요한 정보들을 client에서 가져오면
    // 그것들을 Database에 넣어준다.
    const user = new User(req.body);    // req.body = 객체형태 => bodyParser 때문에 가능한 것
    user.save( (err, doc) => {
        if(err) return res.json({ success : false, err });
        return res.status(200).json({
            success: true
        });
    })
})




app.listen(port, () => console.log(`Eample app listening on port ${port}!`));

const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');     // URI 정보 가져오기 (develop모드 or production 모드)
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');  // User 스키마 가져오기

app.use(bodyParser.urlencoded({extended: true}));   // application/x-www-form-urlencoded 형태의 데이터를 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json()); // application/json 형태의 데이터를 분석해서 가져올 수 있게 해준다.
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI , {
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log("MongoDB Connected..."))
.catch( err => console.log(err))

app.get('/', (req, res) => res.send("Hello WEB Server !!"));

app.post('/api/users/register', (req, res) => {

    // 회원 가입 할때, 필요한 정보들을 client에서 가져오면
    // 그것들을 Database에 넣어준다.
    const user = new User(req.body);    // req.body = 객체형태 => bodyParser 때문에 가능한 것
    
    // 아래, save 전에, 비밀번호 암호화
    
    user.save( (err, doc) => {
        if(err) return res.json({ success : false, err });
        
        return res.status(200).json({
            success: true
        });
    })
})

app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 조회한다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하느 유저가 없습니다."
            })
        }
        // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다."})
            
            // 비밀번호까지 같다면, Token 생성하기
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // token을 저장한다. 어디에 ? => localStorage ? 쿠기 ? 세션 ? 여기선, 일단 여기선, 쿠기에 저장함
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess : true, userId : user._id })
            })
        })
    })
})

// auth : 미들웨어, req받고 cb하기전에, 중간에 작동하는 것
app.get('/api/users/auth', auth, (req,res) => {

    // 여기까지 미들웨어를 통과해 왔다는 애기는, Authentication 이 True 라는 말.
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })
})

app.get('/api/users/logout', auth, (req,res) => {

    User.findOneAndUpdate( { _id : req.user.id }, { token : '' }, (err, user) => {

        if(err) return res.json( { success : false, err});
        return res.status(200).send( {
            success : true
        })
    })
})

app.listen(port, () => console.log(`Eample app listening on port ${port}!`));

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   // bcrypt 가져오기
const saltRounds = 10;      // salt 를 몇개 만들껀데 ? (소금 몇개 ~?)
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const jwt = require('jsonwebtoken');


// userSchma 생성
const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50,
    },
    email : {
        type : String,
        trim : true,    // trim : 문자열 내, 공백 제거기능
        unique : 1      // unique : 똑같은 값 존재하지 못하게
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {        // role 은 관리자 or 사용자 구분 용
        type : Number,
        default : 0
    },
    image : String,
    token : {       // 유효성 토큰
        type : String 
    },
    tokenExp : {    // 유효성 만료
        type : Number
    }
})

// 유저정보 들어오기전에...작동
userSchema.pre('save', function( next ){

    var user = this;

    // 비밀번호 암호화 시킨다.
    // = salt 만들어서 추가하고,암호화 한다.
    bcrypt.genSalt(saltRounds, function( err, salt ) {
        if(err) return next(err);

        // user.password = 순수 비밀번호
        // hash = 암호화 된 비밀번호

        if(user.isModified('password')){
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;    // 유저 비밀번호를 <- 해쉬 값으로
                next();
            })
        } else {
            next();
        }
    })
})  

userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    // plainPassword 예 : 1234567 , 암호화된 비밀번호 예 : $2b$10$hWXszdbnCJJyhkZ8AIyycufm0JYq3HXXS9Lz4cpBCSoyO0VcnIGF2
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })

}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //user._id + 'secretToken' = token

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}   

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token,'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음, 클라이언트에서 가져온 token과 DB에 token이 일치하는지 확인
        user.findOne({ "_id" : decoded, "token" : token }, function(err, user) {

            if(err) return cb(err);
            cb(null, user);
        })
    })
}
// 위에 만든, 스키마를 => 모델로 감싸기
const User = mongoose.model('User', userSchema);

// 외부에서, 이 모델을 사용하기 위해, exports
module.exports = { User }
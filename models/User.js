const mongoose = require('mongoose');

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

// 위에 만든, 스키마를 => 모델로 감싸기
const User = mongoose.model('User', userSchema);

// 외부에서, 이 모델을 사용하기 위해, exports
module.exports = { User }
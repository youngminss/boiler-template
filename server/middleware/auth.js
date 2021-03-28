let auth = (req, res, next) => {

    const { User } = require('../models/User');
    // 인증 처리를 하는 곳

    // 클라이언트 쿠기에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    
    // 토큰을 복호화(decode) 한 후, 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        
        // 유저가 없으면 인증 No !!
        if(err) throw err;
        if(!user) return res.json({ isAuth : false, error : true });
        
        // 유저가 있으면 인증 Ok !
        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth }
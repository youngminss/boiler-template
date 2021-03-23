if(process.env.NODE_ENV === 'production'){
    // deploy(배포), production 모드 경우
    module.exports = require('./prod');
} else {
    // development (개발자) 모드 경우
    module.exports = require('./dev');
}
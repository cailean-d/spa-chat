module.exports = function(req){

    let userinfo = {
        ip : req.clientIp,
        device : req.device.type,
        os : req.useragent.os,
        browser : req.useragent.browser,
        version : parseInt(req.useragent.version),
        platform : req.useragent.platform
    }
    req.session.userinfo = userinfo;
}
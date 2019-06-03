const url = "http://www.huishenghuo.net:7001"
exports.serviceUrl=url+"/mpServicerService"
exports.chatUrl = "http://www.huishenghuo.net:3000" //"http://192.168.0.29:3000"

exports.accountUrl = {
  update: url + "/mpServicerAccount/update",
  register:url+"/mpServicerAccount/register",
  login: url + "/mpServicerAccount/login"
} //"http://localhost:7001"
// exports.socketIoUrl="http://www.huishenghuo.net:7001/wxServicer"
//  
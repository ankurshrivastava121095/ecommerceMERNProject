const middleWare = (req, res, next) => {
    const authHeader = req.headers["x-authorization"]
    // console.log("authHeader",authHeader);
    if (authHeader) {
        const id = authHeader.split(" ")[1]
        req.user_id = id
        next()
    } else {
        res.status(401).send("You are not authenticated")
    }
  }
  
  
  module.exports =  middleWare
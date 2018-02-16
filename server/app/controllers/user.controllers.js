var path = require('path');
const user = require("../models/user.model");
const jwt    = require('jsonwebtoken');
const express = require("express");
const app = express();


const jwtConfig = require("../../config/jwt.config");

exports.register = (req, res)=>{
    
    user.count({email: req.body.email}, (err, result)=>{
        console.dir(result);
        if(result){
            res.status(500).json({
                error: 'email already exist',
         });
        } else{

            user.count({username: req.body.username}, (err, result)=>{
                console.dir(result);
        if(result){
            res.status(500).json({
                error: 'username already exist',
         })
        }
         else{
            user.create(req.body,  (err, small) => {
                if (err) {
                    console.dir(err);
                    res.status(500).json({
                        error: err,
                 });
                }else{
                    res.status(200).json({
                        message: 'You have successfully  registered',
                        id: small._id
                    });
                }
            });
        
    }

    });
    
    
};
    })
}

exports.login = (req, res)=>{
user.findOne({
email :req.body.email
}, (err, user)=>{
    if(err){
        console.dir(err);
                    res.status(500).json({
                        error: err,
                 });
    }else{
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
          } else if (user) {
      
            // check if password matches
            if (user.password != req.body.password) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                const payload = {
                    userId: user._id,
                    username : user.username,
                    firstname : user.firstname,
                    lastname : user.lastname,
                    avatar : user.avatar,
                    email : user.email 
                  };
                  console.dir(payload);
                      var token = jwt.sign({
                        user: payload
                      },jwtConfig.secret);
              
                      // return the information including token as JSON
                      res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                      });
                    } 
    }
}
});
};

exports.forget = (req, res)=>{
    
};

exports.getUser = (req, res)=>{
    user.find({})
    .exec()
    .then(results =>{
        res.json(results);
    });
};

exports.logout = (req, res)=>{
    
}

exports.verifyToken = (req, res, next)=>{
   
    const bearerHeader = req.headers.authorization;
    
    if(typeof bearerHeader === 'undefined'){
                res.status(403).json({forbidden:"forbidden", login:false});
    }else{
        const bearer =  bearerHeader.split(" ");
        const token = bearer[1];
        console.dir(token);
        req.token = token;
        next();
    }
   
}
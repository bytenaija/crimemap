

var path = require('path');

const crimes = require("../models/crime.model");
const jwt    = require('jsonwebtoken');
const jwtConfig = require("../../config/jwt.config");

/* //getting form to test imput. Will remove this later
exports.getForm = (req, res)=>{
    res.sendFile(path.resolve(__dirname, '..', '..', "index.html"));
}; */

//finding and returning all the crimes in the database
exports.findAll = (req, res)=>{
    crimes.find()
    .exec()
    .then(results =>{
        res.json(results);
    });

};

//adding crime to the database
exports.addCrime = (req, res)=>{
    console.dir(req.token);
    jwt.verify(req.token, jwtConfig.secret, (err, authData)=>{
        console.dir(authData);
        if(err){
            res.status(403).json(err);
        }else{
            req.body.posted_by = authData._id
            crimes.create(req.body, function (err, small) {
                if (err) {
                    console.dir(err);
                }else{
                    res.status(200).json({
                        message: 'Crime updated',
                        results: small
                    });
                }
            });
        }
    })
    console.log("Adding crime to the database");
    console.dir(req.body);

};

//finding and returning one crime
exports.findOne = (req, res)=>{
const id = req.params.crimeId;
console.dir(req.param.crimeId);
crimes.findById(id)
.exec()
.then(result =>{
    res.json(result);
});
};


//editing crime
exports.editCrime = (req, res, next)=>{
   
   crimes.findOneAndUpdate({ _id: req.params.crimeId}, {$set: req.body})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'Crime updated',
            results: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};


//deleting crime
exports.delete = (req, res)=>{
crimes.findOneAndRemove({_id: req.params.crimeId})
.exec()
.then(result=>{
    console.log(result);
        res.status(200).json({
            message: 'Crime deleted',
            results: result
        });
})
};

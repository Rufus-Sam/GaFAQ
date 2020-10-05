var express = require("express");
var router  = express.Router({mergeParams : true});
var Question = require("../models/question");
var Answer	= require("../models/answer");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn, function(req, res){
	Question.findById(req.params.id, function(err, question){
		if(err){
			console.log(err);
		} else {
			res.render("answers/new", {question : question});
		}
	});	
});

router.post("/",middleware.isLoggedIn, function(req, res){

	Question.findById(req.params.id,function(err,question){
		if(err){
			console.log(err);
			res.redirect("/home");
		}else{
			//connect new comment to campground
			Answer.create(req.body.answer,function(err,answer){
				if(err){
					console.log(err);
				}else{
					answer.author.id = req.user._id;
					answer.author.username = req.user.username;
					answer.save();	

					question.answers.push(answer);
					question.save();
					
					res.redirect("/home/"+question._id);
				}
			});
		}
	});	
});

router.get("/:answer_id/edit",middleware.checkAnswerOwnership, function(req, res){
	Question.findById(req.params.id, function(err, question){
		if(err){
			console.log(err);
		} else {
			Answer.findById(req.params.answer_id, function(err, answer){
				if(err){
					console.log(err);
				} else{
					res.render("answers/edit", {question_id : req.params.id, answer : answer});	
				}
			});
		}
	});	
	
});

router.put("/:answer_id",middleware.checkAnswerOwnership, function(req, res){
	Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer){
		if(err){
			console.log(err);
		} else{
			res.redirect("/home/" + req.params.id);
		}
	});
});
	
router.delete("/:answer_id",middleware.checkAnswerOwnership, function(req, res){
	Answer.findByIdAndRemove(req.params.answer_id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home/" + req.params.id);
		}
		
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router
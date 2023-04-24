/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const transitem = require('../models/transitem');
const router1 = express.Router();
const Item = require('../models/transitem')
const User = require('../models/User')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router1.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.items = await Item.find({userId:req.user._id})
      res.render('transaction');
});


/* add the value in the body to the list associated to the key */
router1.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      console.dir(req.body)
      const transaction = new Item(
        {description:req.body.item,
         amount: parseInt(req.body.amount),
         category: req.body.category,
         date:req.body.date,
         userId: req.user._id
        })
      await transaction.save();
      res.redirect('/transaction')
});

router1.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:itemId")
      await transitem.deleteOne({_id:req.params.itemId});
      res.redirect('/transaction')
});

router1.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/edit/:itemId")
      const item = 
      await transitem.findById({_id:req.params.itemId});
      res.locals.item = item
      res.render('edit')
      
});

router1.post('/transaction/edit/transaction/Update',
  isLoggedIn,
  async (req, res, next) => {
      const {itemId,description,amount,category,date} = req.body;
      console.log("inside /transaction/:itemId");
      await transitem.findOneAndUpdate(
        {_id:itemId},
        {$set: {description,amount,category,date}} );
      res.redirect('/transaction')
});

router1.get('/transaction/groupByCategory',
  isLoggedIn,
  async (req, res, next) => {
      let results =
            await transitem.aggregate(
                [ 
                  {$group:{
                    _id:'$category',
                    amount:{$sum:"$amount"}
                    }},             
                ])
        //res.json(results)
        res.render('groupByCategory',{results})
});

router1.get('/transaction/sortByCategory',
  isLoggedIn,
  async (req, res, next) => {
      let results =
            await transitem.aggregate(
                [ 
                  {$sort:{"category": 1}},             
                ])
              
        //res.json(results)
        res.render('sortByCategory',{results})
});

router1.get('/transaction/sortByAmount',
  isLoggedIn,
  async (req, res, next) => {
      let results =
            await transitem.aggregate(
                [ 
                  {$sort:{amount: 1}},             
                ])
              
        //res.json(results)
        res.render('sortByAmount',{results})
});

router1.get('/transaction/sortByDescription',
  isLoggedIn,
  async (req, res, next) => {
      let results =
            await transitem.aggregate(
                [ 
                  {$sort:{description: 1}},             
                ])
              
        //res.json(results)
        res.render('sortByDescription',{results})
});

router1.get('/transaction/sortByDate',
  isLoggedIn,
  async (req, res, next) => {
      let results =
            await transitem.aggregate(
                [ 
                  {$sort:{"date": 1}},             
                ])
              
        //res.json(results)
        res.render('sortByDate',{results})
});


module.exports = router1;

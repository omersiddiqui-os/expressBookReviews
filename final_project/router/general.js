const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist=(username)=>{
    let userswithsamename=users.filter((user)=>user.username===username);
    userswithsamename.length>0?true:false;
}
public_users.post("/register", (req,res) => {
  
  const username=req.body.username;
  const password=req.body.password;

  if(username && password){
      if(!doesExist(username)){
          users.push({
              "username":username,
              "password":password
          })
          return res.status(200).json({message:"User successfully registered. Now you can log in."})
      }
      else return res.status(404).json({message:"User already exists!"})
  }
  else return res.status(404).json({message:"Unable to register user"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    Promise.resolve(books)
    .then(books=>res.status(200).send(books))
    .catch(err=>res.status(500).send(err))
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn=req.params.isbn;
  Promise.resolve(books)
  .then(books=>res.status(200).send(books[isbn]))
  .catch(err=>res.status(500).send(err))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;  
  let keys=(Object.keys(books));
  for(let i=1;i<keys.length+1;i++){
    if(books[i]['author']===author){
        Promise.resolve(books)
        .then(books=>res.status(200).send(books[i]))
        .catch(err=>res.status(500).send(err))        
    }
  }
  
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;  
    let keys=(Object.keys(books));
    for(let i=1;i<keys.length+1;i++){
      if(books[i]['title']===title){
        Promise.resolve(books)
        .then(books=>res.status(200).send(books[i]))
        .catch(err=>res.status(500).send(err))
      }
    }
  return res.status(300).json({message:"Unable to find book"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn=req.params.isbn;
    res.send(books[isbn]['review']);
  return res.status(300).json({message: "Unable to find book"});
});

module.exports.general = public_users;


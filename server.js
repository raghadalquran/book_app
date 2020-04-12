'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3030;
const app = express();
const superagent = require('superagent');
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/hello',(req,res)=>{
  res.render('./pages/index');
})
app.get('/' , (req,res)=>{
  res.render('./pages/index');
})
app.get('/searches/new',(req,res)=>{
  res.render('./pages/searches/new');
})
app.post('/searches',(request,response)=>{
  const inputt = request.body.search;
  const radio = request.body.radio;
  let url;
  if(radio === 'title'){
    url = `https://www.googleapis.com/books/v1/volumes?q=${inputt}`;
  }else if(radio === 'author') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${inputt}`;
  }
  console.log(request.body);
  superagent.get(url)
    .then(bookData =>{
      let dataArray = bookData.body.items.map(value =>{
        return new Book(value);
      })
      response.render('./pages/searches/show',{data:dataArray});
    })
    .catch((error) => {
      errorHandler(error, request, response);
    });

})
function Book (value){
  this.image = value.volumeInfo.imageLinks.smallThumbnail;
  this.title = value.volumeInfo.title;
  this.author= value.volumeInfo.authors[0];
  this.description = value.volumeInfo.description;
}

function errorHandler (err,req,res){
  res.status(500).send(err);
}

app.get('*',(req,res)=>{
  res.status(404).send('This route does not exist!!');
})
app.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`)
})

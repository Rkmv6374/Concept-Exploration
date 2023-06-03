import express from 'express'
import jwt from 'jsonwebtoken'
import bodyParser  from 'body-parser'

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const data =[
  {
    id:5,
    username:"aman raj",
    password:"1234",
    admin:true
  },
  {
    id:2,
    username:"sunita",
    password:"1234",
    admin:true
  }
  ,{
    id:4,
    username:"chandan",
    password:"1234",
    admin:false
  },{
    id:3,
    username:"chandani",
    password:"1234",
    admin:false
  },{
    id:1,
    username:"shatrughna",
    password:"1234",
    admin:true
  },
  {
    id:6,
    username:"mahesh",
    password:"1234",
    admin:false
  }
]

const generateAccessToken = (user)=>
{
  if(!user)  res.status(500).json("user is undefined for generateAccessTokens!");
  return (jwt.sign({id:user.id,username:user.username},"mySecretKey",{expiresIn:'5s'}));
}

const generateRefreshToken = (user)=>
{
  if(!user)  res.status(500).json("user is undefined for generateRefreshTokens!");
  return (jwt.sign({id:user.id,username:user.username},"myRefreshSecretKey"));
}


const verify =(req,res,next)=>
{
  const authheader = req.headers['authorization'];
 
  if(authheader)
  {  const authuser = authheader.split(' ')[1];
     jwt.verify(authuser,"mySecretKey",(err,user)=>
     {
      if(err)  res.status(500).json("token is not matched");
      else { req.user = user;  
        // console.log(user);
         next();}
     });
   
  }
  else{
     res.status(500).json("user is not authenticated");
    
  }
 
}
 
//  refreshing the tokken 
//  giving refresh token in token data then get the new access token 



let refreshtokenarray = []
app.post('/api/refreshtoken',(req,res)=>
{
   const tokens = req.body.token;
  //  console.log(tokens);
   if(tokens)
   {
     if(!refreshtokenarray.includes(tokens)) res.status(501).json("refreshtoken is not found!")
      else
      {const verifying = jwt.verify(tokens,"myRefreshSecretKey",(err,user)=>
      {
         if(err) res.status(500).json("refreshToken is not valid!!!");
         else{
          refreshtokenarray.filter((rt)=>rt!=tokens);
          const newaccesstoken = generateAccessToken(user);
          const newrefreshtoken = generateRefreshToken(user);
           refreshtokenarray.push(newrefreshtoken);
          res.status(200).json(
            {
              accesstoken:newaccesstoken,
              refreshtoken:newrefreshtoken
            }
          )
         }
      })}
   }
   else{
    res.status(500).json("refreshtoken user is undefined!!");
   }
})

app.post("/api/login",(req,res)=>
{
  const {username , password} = req.body;
  const user = data.find((e)=> e.username===username && e.password === password);
  if(user)
  {
     const accesstoken = generateAccessToken(user);
     const refreshtoken = generateRefreshToken(user);
     refreshtokenarray.push(refreshtoken);

     res.status(200).json({
      username:user.username,
      id:user.id,
      refreshtoken,
      accesstoken
     })
  }
  else
  {
    res.status(500).json("credentials are wrong!! please check it !!!");
  }
})


app.delete("/api/delete/:userId",verify,(req,res)=>
{
  const user  = (req.params.userId == req.user.id || req.user.admin);
  if(user)
  {
     res.status(200).json("user has been deleted!!");
  }
  else{
     
    res.status(500).json("userId and token has not matched or user is not admin !!!");
  }
  
})

app.post("/api/logout",verify,(req,res)=>
{
  const tokken = req.body.token;
  // console.log(tokken);
  if(!tokken) res.status(500).json("refreshtoken is invalid while you are loging out")
  refreshtokenarray.filter((tt)=>tt!=tokken);
  res.status(201).json("you are successfully logedout!!")
  
} 
)

app.listen(4040,(err)=>
{
  if(!err) console.log("server is connected to port : 4040");
})



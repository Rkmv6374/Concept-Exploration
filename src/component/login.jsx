import { useState } from "react";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import './login.css'

const Login =()=>
{    
    const [del,setDel] = useState(false);
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);
    const [user , setUser] = useState(null);
    const [logedin,setLogedin] = useState(false);
    const [success,setSuccess] = useState(false);
    
    const handleSubmit = async(e)=>
    {   
        e.preventDefault();
        try{

            const users = await axios.post("/login",{username:username,password:password});
            // console.log(users.data);
            setUser(users.data);
            setLogedin(true);
        }
        catch(err)
        {
           console.log("error found while axios handleSubmit")
        }
    }
    const refreshToken = async()=>
    {
        try{
             
            const token  = await axios.post("/refreshtoken",{token:user.refreshtoken});
            // console.log(token.data);

            setUser({
                ...user,
                accesstoken:token.data.accesstoken,
                refreshtoken:token.data.refreshtoken
            })
            return token.data;

        }catch(err)
        {
            console.log("err in while calling refresh token");
        }
    }

    const awt = axios.create();
    awt.interceptors.request.use(
        async(config)=>
    {
        try
        {
           let currentDate = new Date();
           const jwtdecode = jwt_decode(user.accesstoken);
        //    console.log(jwtdecode);
           if(currentDate.getTime()>jwtdecode.exp*1000)
           {
            const alltoken = await refreshToken();
            config.headers['authorization'] = "Bearer " +alltoken.accesstoken;
           }
           return config;
        }
        catch(err)
        {
             console.log(err);
        }
    });

    const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accesstoken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accesstoken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


    
    //  axios interceptor 
   

    const handleDelete = async()=>
    {
        try{

             const dele = await awt.delete("/delete/"+user.id,{headers:{authorization:"Bearer " +user.accesstoken},})
             setDel(true);
        }
        catch(err)
        {
        console.log("error found in delete handling function")
        }
    }
    
    const handleLogout = async()=>
    {
        try{
            const config = 
            {
                headers:{
                    authorization:'Bearer '+user.accesstoken
                }
            }
            const data =
                {
                    token:user.refreshtoken
                };
            const logged = await awt.post('/logout',data,config);
            setLogedin(false);
            setUser(null);
            setDel(false);
        }
        catch(err)
        {
            console.log("error found in logout handle function")
        }
    }

    return (
     <>
      
      <p className="home">
       <h2 className="title">Log In</h2>
        {!user ?(<form action="" className="form" onSubmit={handleSubmit}>
         <label  className="username">Username </label>
         <input type="text" className="username" onChange={(e)=>setUsername(e.target.value)}/> 
         <label  className="password">Password </label>
         <input type="password" className="password" onChange={(e)=>setPassword(e.target.value)}/> <br></br>
         <button className="submitButton" type="submit">Submit</button>
         </form>):(<>you are logged in !!!</>)}
      
      {user&&logedin&&(<div className="delete">
       {!del?(<button className="deleteButton" onClick={handleDelete}>Your ID</button>):(<div className="deleteBtn">You are Successfully Deleted!</div>)}
       
      </div>)}
      
      {user && logedin&&(<div>
         <button className="deleteButton" onClick={handleLogout}>
          Log Out
         </button>
      </div>)}
      
      </p>
     </>
    );
}

export default Login;
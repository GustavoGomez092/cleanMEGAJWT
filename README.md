# MEGA JWT Boilerpalte

Hi! This is a boilerplate for a GraphQL Server with Apollo, MongoDB, JWT & Bcrypt.




## .ENV

The .env file needs to cotain at least:

|Entry name      |description					 |type                         |
|----------------|-------------------------------|-----------------------------|
|DB_USER		 |user name for the DB           |String                       |
|DB_PASS 		 |DB Password 		             |String                       |
|DB_URI          |DB URI without `@`             |String                       |
|JWT_SECRET 	 |Custom JWT secret              |String                       |
|NODE_ENV  		 |your environment               |String                       |
|DB_USER_DEV 	 |development DB user            |String                       |
|DB_PASS_DEV 	 |development DB password        |String                       |
|DB_URI_DEV 	 |development DB URI without `@` |String                       |
|PORT 			 |Server Port                    |Int                          |
|CLOSE_TO_EXPIRE |Set when the JWT is close to expire|Int                      |
|JWT_EXPIRATION  |Set JWT expiration             |Int                          |
|TOKEN_EXPIRES   |Set if JWT should expire       |Bool                         |

 
## Using the Tokens

User Sign Up and Log in implemented!
to log in a user don't forget to add the authorization header with the following structure:

{
 "Authorization" : "Bearer `Add your token here`" 
}
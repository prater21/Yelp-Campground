# Yelp-Campground

Project with Udemy The Web Developer Bootcamp 2023

[__>>LIVE DEMO__](https://yelp-campground-ic3l.onrender.com/) 
###### takes some time to wake up the server

Test User

    Username : test
    Password : test1234

<img width="60%" alt="image (4)" src="https://github.com/prater21/Yelp-Campground/assets/126800695/3955c6d0-4e8a-4529-a891-f286a1f6a22c"> 

<img width="48%" alt="image (4)" src="https://github.com/prater21/Yelp-Campground/assets/126800695/2be20fc5-98aa-4248-be8d-010b47232c4e">

<img width="50%"  alt="image (4)" src="https://github.com/prater21/Yelp-Campground/assets/126800695/4b6a7341-65e1-4328-a9ea-60e5a7c0d7e6">


## Features

- Authentication
  - Login with username and password
  
- Authorization
  - Only authenticated user can update and delete Campgrounds
  - Only authenticated user can delete Reviews

- Campground create, edit, delete

- Review create, delete

## RESTful Api
- Campgrounds
  
  Read all campgrounds
   
      Get /campgrounds
      
  Read a campground
   
      Get /campgrounds/:id

  Create a campground
   
      Post /campgrounds
  
  Update a campground
   
      Put /campgrounds/:id
      
  Delete a campground
   
      Delete /campgrounds/:id  
  
- Reviews

  Create a review to specific campground
   
      Post /campgrounds/:id/reviews
      
  Delete a review to specific campground
   
      Delete /campgrounds/:id/reviews/:reviewId

## Built with

### Frontend
- [ejs](https://www.npmjs.com/package/ejs)
- [Bootstrap](https://getbootstrap.com/)

### Backend
- [express](https://www.npmjs.com/package/express)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [mongoose](https://mongoosejs.com/)
- [passport](https://www.npmjs.com/package/passport)
- [passport-local](https://www.npmjs.com/package/passport-local)
- [express-session](https://www.npmjs.com/package/express-session)

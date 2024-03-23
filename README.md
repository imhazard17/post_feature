FUNCTIONALITY:-

- User, Post, Like, Comment are the db resources
- Can signup (create), login users using jwt based authentication
- Logged in users can upload images when creating posts and setting profile pictures (implemented using multer)
- One post can have maximum 7 images
- Each file can be a maximum of 3MB
- Logged in users can do CUD actions on their own posts, comments and likes (only CD for likes)
- Unauthenticated users can only perform read operations
- We can also access data about the posts of the user when we search for a user

---------------------------------------------------------------------------------------------------------------------------------

SETUP INSTRUCTIONS:-

i) run `npm i`
ii) install postgresql in your pc if not already installed. Watch this installation tutorial: https://www.youtube.com/watch?v=HmziePvMwkE
iii) open `psql` using your credentials and keep the server running while testing the api
iv) create .env file with apprepriate values of fields:-
![Screenshot](https://github.com/imhazard17/user_mvp/assets/57060375/29288738-1434-45a1-838d-80adf623c58d)
v) run `npx prisma migrate dev --name init`
vi) run `prisma generate`
vii) run `node app.js` and using postman run test the api endpoints

---------------------------------------------------------------------------------------------------------------------------------

API ENDPOINTS:-     (NOTE: ** means it is a protected route hence should send authorization token in header)
                    (Did not include returned values for the api endpoints will do it later)

USERS:

i) GET /user/all     [get all users]
ii) GET /user/my-details**    [get current logged in user]
iii) GET /user/search/:username     [get user based on searched username]
iv) POST /user/auth/signup      [create new user]
v) GET /user/auth/login     [login user]
vi) PUT /user/change-details**        [update user details]
vii) DELETE /user/delete-profile**        [delete logged in user]

POSTS:

i) GET /post/search/:id     [search post based on postId]
ii) GET /post/get-all/:username     [get all post of a particular username]
iii) POST /post/create**      [create post of logged in user]
iv) PUT /post/update/:id**      [update post based on postId]
v) DELETE /post/delete/:id**      [delete post based on postId]

COMMENT:

i) GET /comment/:postId     [get all comments on a post]
ii) POST /comment/:postId       [create comment on a post of id with postId]
iii) PUT /comment/:id       [update comment on a comment id]
iv) DELETE /comment/:id        [delete comment on a comment id]

LIKE:

i) GET /like/count/:postId      [number of like on a post]
ii) POST /like/:postId      [create a like on a post based on postId]
iii) DELETE /like/:id       [delete like based on id]

(NOTE check which data to send in body by the schema of the resouces defined on `schema.prisma` file)
(NOTE on endpoints /user/auth/signup and /user/change-details can upload minimum 0 files and maximum 1 file with key = `file` in formData field of body on postman)
(NOTE on endpoints /post/create and /post/update              can upload minimum 1 file and maximum 7 files with key = `file` in formData field of body on postman)

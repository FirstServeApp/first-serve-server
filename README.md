# FirstServe-server Docs

## All Endpoints

| path                          | method | description                          | go to                                  |
| :--------------------         | :----- | :---------------------------         | ----------------------:                |
| /match/create                 | POST   | Create a new match                   | [-->](#create-a-match)                 |
| /match/all                    | GET    | Returns all user matches             | [-->](#get-all-matches)                |
| /match/filter/date            | GET    | Returns matches by date              | [-->](#filter-matches-by-date)         |
| /match/filter/players         | GET    | Returns matches by opponents         | [-->](#filter-matches-by-players)      |
| /match/:id                    | GET    | Returns match by id                  | [-->](#get-a-match-by-id)              |
| /match/:id                    | DELETE | Delete match by id                   | [-->](#delete-a-match)                 |
| auth/signup                   | POST   | Create a new user account            | [-->](#user-signup)                    |
| auth/login                    | POST   | Log-in to account                    | [-->](#user-login)                     |
| auth/logout                   | POST   | Logout from current user             | [-->](#user-logout)                    |
| auth/refresh                  | POST   | Refresh access token                 | [-->](#refresh-access-token)           |
| auth/signup/google            | POST   | Sign in with Google                  | [-->](#user-signup-with-google)        |
| auth/signup/apple             | POST   | Sign in with Apple                   | [-->](#user-signup-with-apple)         |
| auth/signup/facebook          | POST   | Sign in with Facebook                | [-->](#user-signup-with-facebook)      |
| auth/forgot-password/send-otp | POST   | Send OTP code to user email          | [-->](#send-otp-for-forgot-password)   |
| auth/forgot-password/verify   | POST   | Verify entered OTP code              | [-->](#verify-otp-for-forgot-password) |
| auth/forgot-password/change   | POST   | Change password after verification   | [-->](#change-password-with-otp)       |
| auth/reset-password           | PATCH  | Reset password of authenticated user | [-->](#reset-password)                 |
| image/upload                  | POST   | Upload image to Cloudinary           | [-->](#upload-image)                   |
| image/:url                    | DELETE | Delete an image from Cloudinary      | [-->](#delete-image)                   |
| user/                         | GET    | Return current user info             | [-->](#get-current-user)               |
| user/delete                   | DELETE | Delete user account                  | [-->](#delete-account)                 |
| user/change/avatar            | PATCH  | Change user avatar                   | [-->](#change-profile-image)           |
| user/change/name              | PATCH  | Change user name                     | [-->](#change-name)                    |


## Match Endpoints

**Base endpoint: `/match`**

### Create a match

Create a new match.

- **URL:** `/create`
- **Method:** `POST`
- **Authentication required:** Yes
- **Request Body:**

| field name    | type    | required | description                                       |
| :----         | :---    | :------- | :---------                                        |
| winner        | string  | true     | The winner of the match.                          |
| opponentName  | string  | false    | The name of the opponent. Defaults to "Player 2". |
| duration      | number  | true     | The duration of the match in minutes              |
| setsArr       | ISet[]  | true     | An array of sets                                  |

- **Responses:**
  - **`200 OK`:** The match was created successfully. Returns the created match object.
  - **`400 Bad request`:** Match wasn't created
  - **`500 Internal server error`:** Match wasn't created

### Get All Matches

Retrieve all matches.

- **URL:** `/all`
- **Method:** `GET`
- **Authentication required:** Yes
- **Query parameters:**
  - **`page` (number):** The page number for pagination. Defaults to 1.
  - **`pageSize` (number):** The number of matches to return per page. Defaults to 20. Min: 5, Max: 50.
- **Responses:**
  - **`200 OK`:** The matches were retrieved successfully. Returns an array of match objects.
  - **`400 Bad request`:** Invalid query parameters. Returns error message.
  - **`500 Internal server error`:** Returns status code `500`.

### Filter Matches by Date

Retrieve matches filtered by date.

- **URL:** `/filter/date`
- **Method:** `GET`
- **Authentication required:** Yes
- **Query parameters:**
  - **`startDate` (string, required):** The start date to filter matches (format: YYYY-MM-DDTHH:mm:ss.sss).
  - **`endDate` (string, required):** The end date to filter matches (format: YYYY-MM-DDTHH:mm:ss.sss).
  - **`page` (number):** The page number for pagination. Defaults to 1.
  - **`pageSize` (number):** The number of matches to return per page. Defaults to 20. Min: 5, Max: 50.
- **Responses:**
  - **`200 OK`:** The filtered matches were retrieved successfully. Returns an array of match objects.
  - **`400 Bad request`:** Invalid query parameters. Returns error message.
  - **`500 Internal server error`:** Returns status code `500`.

### Filter Matches by Players

Retrieve matches filtered by players.

- **URL:** `/filter/players`
- **Method:** `GET`
- **Authentication required:** Yes
- **Query parameters:**
  - **`players` (encodedURIComponent string, required):** The encoded array of players names.
  - **`page` (number):** The page number for pagination. Defaults to 1.
  - **`pageSize` (number):** The number of matches to return per page. Defaults to 20. Min: 5, Max: 50.
- **Responses:**
  - **`200 OK`:** The filtered matches were retrieved successfully. Returns an array of match objects.
  - **`400 Bad request`:** Invalid query parameters. Returns error message.
  - **`500 Internal server error`:** Returns status code `500`.

### Get a Match by ID

Retrieve a match by its ID.

- **URL:** `/:id`
- **Method:** `GET`
- **Authentication required:** Yes
- **URL Parameters:**
  - **`id` (ObjectId, required):** The ID of the match.
- **Responses:**
  - **`200 OK`:** The match was retrieved successfully. Returns the match object.
  - **`404 Not found`:** No match found with this id. Returns error message.
  - **`400 Bad request`:** Invalid url parameters. Returns error message.
  - **`500 Internal server error`:** Returns status code `500`.

### Delete a Match

Delete a match by its ID.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Authentication required:** Yes
- **URL Parameters:**
  - **`id` (ObjectId, required):** The ID of the match.
- **Responses:**
  - **`200 OK`:** The match was deleted successfully. Returns empty object.
  - **`404 Not found`:** No match found with this id. Returns error message.
  - **`400 Bad request`:** Invalid url parameters. Returns error message.
  - **`500 Internal server error`:** Returns status code `500`.

## Auth Endpoints

**Base endpoint: `/auth`**

### User Signup

Create a new user account.

- **URL:** `/signup`
- **Method:** `POST`
- **Request Body:**

| field name    | type    | required | description                                        |
| :----         | :---    | :------- | :---------                                         |
| name          | string  | true     | The name of the user. Min: 1, Max: 16              |
| email         | string  | true     | The valid email address of the user.               |
| password      | string  | true     | The password for the user account. Min: 1, Max: 16 |
| avatar        | string  | false    | An URL of image                                    |

- **Responses:**
  - **`200 OK`:** The user account was created successfully. Returns the pair of access and refresh tokens
  - **`400 Bad request`:** The user account wasn't created. Returns error message.
  - **`500 Internal server error`:** The user account wasn't created.

### User Login

Authenticate and login a user.

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  - **`email` (string, required):** The email address of the user.
  - **`password` (string, required):** The password for the user account.
- **Responses:**
  - **`200 OK`:** The user was authenticated and logged in successfully. Returns the pair of access and refresh tokens
  - **`404 Not found`:** The user with this email not found. Returns error message.
  - **`400 Bad request`:** Invalid request body. Returns error message.
  - **`500 Internal server error`:** The user wasn't logged in.

### User Logout

Log out the currently authenticated user.

- **URL:** `/login`
- **Method:** `POST`
- **Authentication required:** Yes
- **Request Body:**
  - **`refreshToken` (string, required):** The refreshToken of current user.
- **Responses:**
  - **`200 OK`:** The user was successfully logged out.
  - **`500 Internal server error`:** The user wasn't logged out.

### Refresh Access Token

Refresh the access token for the currently authenticated user.

- **URL:** `/refresh`
- **Method:** `POST`
- **Request Body:**
  - **`refreshToken` (string, required):** The refreshToken of current user.
- **Responses:**
  - **`200 OK`:** The access token was successfully refreshed. Returns the pair of access and refresh tokens
  - **`500 Internal server error`:** Access token wasn't refreshed.

### User Signup with Google

Create a new user account using Google authentication.

- **URL:** `/google`
- **Method:** `POST`
- **Request Body:**

| field name    | type    | required | description                                        |
| :----         | :---    | :------- | :---------                                         |
| googleId      | string  | true     | The Google ID token for authentication.            |
| name          | string  | true     | The name of the user. Min: 1, Max: 16              |
| email         | string  | true     | The valid email address of the user.               |
| avatar        | string  | false    | An URL of image                                    |

- **Responses:**
  - **`200 OK`:** The user account was created/signed in successfully using Google authentication. Returns the pair of access and refresh tokens
  - **`400 Bad request`:** The user account wasn't created. Returns error message.
  - **`500 Internal server error`:** The user account wasn't created.

### User Signup with Facebook

Create a new user account using Facebook authentication.

- **URL:** `/facebook`
- **Method:** `POST`
- **Request Body:**

| field name    | type    | required | description                                        |
| :----         | :---    | :------- | :---------                                         |
| facebookId    | string  | true     | The Facebook access token for authentication.      |
| name          | string  | true     | The name of the user. Min: 1, Max: 16              |
| email         | string  | true     | The valid email address of the user.               |
| avatar        | string  | false    | An URL of image                                    |

- **Responses:**
  - **`200 OK`:** The user account was created/signed in successfully using Facebook authentication. Returns the pair of access and refresh tokens
  - **`400 Bad request`:** The user account wasn't created. Returns error message.
  - **`500 Internal server error`:** The user account wasn't created.

### User Signup with Apple

Create a new user account using Apple authentication.

- **URL:** `/apple`
- **Method:** `POST`
- **Request Body:**

| field name    | type    | required | description                                        |
| :----         | :---    | :------- | :---------                                         |
| appleId       | string  | true     | The Apple ID token for authentication.             |
| name          | string  | true     | The name of the user. Min: 1, Max: 16              |
| email         | string  | true     | The valid email address of the user.               |
| avatar        | string  | false    | An URL of image                                    |

- **Responses:**
  - **`200 OK`:** The user account was created/signed in successfully using Apple authentication. Returns the pair of access and refresh tokens
  - **`400 Bad request`:** The user account wasn't created. Returns error message.
  - **`500 Internal server error`:** The user account wasn't created.

### Send OTP for Forgot Password

Send an OTP (One-Time Password) to the user's email address for the forgot password process.

- **URL:** `/forgot-password/send-otp`
- **Method:** `POST`
- **Request Body:**
  - **`email` (string, required):** The email address of the user.
- **Responses:**
  - **`200 OK`:** The OTP was successfully sent to the user's email address. Returns id for verifying.
  - **`400 Bad request`:** Invalid request body. Returns error message.
  - **`500 Internal server error`:** The OTP wasn't sent to the user's email address.

### Verify OTP for Forgot Password

Verify the OTP (One-Time Password) entered by the user during the forgot password process.

- **URL:** `/forgot-password/verify`
- **Method:** `POST`
- **Request Body:**
  - **`id` (string, required):** The id of otp returned on previous step.
  - **`otp` (string, required):** The OTP entered by the user.
- **Responses:**
  - **`200 OK`:** The OTP was successfully verified.
  - **`400 Bad request`:** Invalid request body. Returns error message.
  - **`500 Internal server error`:** The otp wasn't verified.

### Change Password with OTP

Change the user's password using the verified OTP.

- **URL:** `/forgot-password/change`
- **Method:** `POST`
- **Request Body:**
  - **`id` (string, required):** The id of otp returned on previous step.
  - **`password` (string, required):** The new password for the user account.
- **Responses:**
  - **`200 OK`:** The password was successfully changed.
  - **`400 Bad request`:** Invalid request body. Returns error message.
  - **`500 Internal server error`:** The password wasn't changed.

### Reset Password

Reset the password for the currently authenticated user.

- **URL:** `/reset-password`
- **Method:** `PATCH`
- **Authentication required:** Yes
- **Request Body:**
  - **`password` (string, required):** The new password for the user account.
- **Responses:**
  - **`200 OK`:** The password was successfully changed.
  - **`400 Bad request`:** Invalid request body. Returns error message.
  - **`500 Internal server error`:** The password wasn't changed.

## Image Endpoints

**Base endpoint: `/image`**

### Upload Image

Upload an image file to the Cloudinary.

- **URL:** `/upload`
- **Method:** `POST`
- **Authentication required:** Yes
- **Request Headers:**
  - **`Content-Type`:** `multipart/form-data;`
- **Request Body:**
  - **`image` (file < 5mb, required):** The image file to upload.
- **Responses:**
  - **`200 OK`:** The image was successfully uploaded. Returns the URL to the image.
  - **`400 Bad request`:** Invalid request. Returns error message.
  - **`500 Internal server error`:** The image wasn't uploaded.

### Delete Image

Delete an uploaded image from Cloudinary.

- **URL:** `/:url`
- **Method:** `DELETE`
- **Authentication required:** Yes
- **URL parameters:**
  - **`url` (string, required):** The url of an uploaded image to delete.
- **Responses:**
  - **`200 OK`:** The image was successfully deleted.
  - **`400 Bad request`:** Invalid request. Returns error message.
  - **`500 Internal server error`:** The image wasn't deleted.

## User Endpoints

**Base enpoint: `/user`**

### Get Current User

Retrieve the details of the currently authenticated user.

- **URL:** `/`
- **Method:** `GET`
- **Authentication required:** Yes
- **Responses:**
  - **`200 OK`:** The current user details were successfully retrieved.
  - **`401 Unauthorized`:** The user is not authenticated or the access token is invalid.
  - **`500 Internal server error`:** Returns error message.

### Delete Account

Delete the account of the currently authenticated user.

- **URL:** `/delete`
- **Method:** `DELETE`
- **Authentication required:** Yes
- **Responses:**
  - **`200 OK`:** The account was successfully deleted.
  - **`401 Unauthorized`:** The user is not authenticated or the access token is invalid.
  - **`500 Internal server error`:** Returns error message.

### Change Profile Image

Change the profile image of the currently authenticated user.

- **URL:** `/change/avatar`
- **Method:** `POST`
- **Authentication required:** Yes
- **Request Headers:**
  - **`Content-Type`:** `multipart/form-data;`
- **Request Body:**
  - **`image` (file < 5mb, required):** The image file to set as the new profile image.
- **Responses:**
  - **`200 OK`:** The profile image was successfully changed.
  - **`401 Unauthorized`:** The user is not authenticated or the access token is invalid.
  - **`500 Internal server error`:** The profile image wasn't changed

### Change Name

Change the name of the currently authenticated user.

- **URL:** `/change/name`
- **Method:** `POST`
- **Authentication required:** Yes
- **Request Body:**
  - **`name` (string, required):** The new name for the user. Min: 1, Max: 16
- **Responses:**
  - **`200 OK`:** The name was successfully changed.
  - **`401 Unauthorized`:** The user is not authenticated or the access token is invalid.
  - **`500 Internal server error`:** The name wasn't changed

## Models & interfaces
### `ISet`

    ServesEnum = ['Ace', 'Winner', 'Forced Error', 'Unforced Error', 'Double Faults']
    {
      _id: Schema.Types.ObjectId; // The unique ID of the set.
      index: number; // The index of the set. Required.
      myScore: number; // The score of the user. Required.
      opponentScore: number; // The score of the opponent. Required.
      myServes: ServesEnum[]; // An array of serves made by the user. Required.
      opponentServes: ServesEnum[]; // An array of serves made by the opponent. Required.
    }

### `IMatch`

    {
      _id: Schema.Types.ObjectId; // The unique ID of the match.
      user_id: Schema.Types.ObjectId; // The ID of the user associated with the match. Required.
      winner: string; // The winner of the match. Required.
      opponentName: string; // The name of the opponent. Default: 'Player 2'.
      sets: Schema.Types.ObjectId[]; // An array of set IDs associated with the match. Required.
      duration: number; // The duration of the match. Required.
    }

### `IUser`

    {
      _id: Schema.Types.ObjectId; // The unique ID of the user.
      name: string; // The name of the user. Required.
      email: string; // The email address of the user. Required.
      avatar: string; // The URL of the user's avatar.
      password: string; // The password of the user. Required.
      createdAt: Date; // The date when the user was created.
      updatedAt: Date; // The date when the user was last updated.
    }

### `ISocialUser`

    {
      _id: Schema.Types.ObjectId; // The unique ID of the user.
      googleId: string; // The Google ID of the user.
      appleId: string; // The Apple ID of the user.
      facebookId: string; // The Facebook ID of the user.
      name: string; // The name of the user. Required.
      email: string; // The email address of the user. Required.
      avatar: string; // The URL of the user's avatar.
      createdAt: Date; // The date when the user was created.
      updatedAt: Date; // The date when the user was last updated.
    }

## Environment Variables

This is a documentation for the required environment variables used in the application.

| name                  | description                                                                    | values/examples             |
| :-------------------- | :----------------------------------------------------------------------------- | :-------------------------: |
| NODE_ENV              | Specifies the current environment mode of the application.                     | `development`, `production` |
| PORT                  | Specifies the port number on which the server will listen. Default Value: 8080 | `4040`                      |
| DB_URL                | Specifies the URL or connection string for the database.                       | `mongodb+srv://...`         |
| JWT_ACCESS_SECRET     | Specifies the secret key used to sign the access tokens for authentication.    | `my-access-secret`          |
| JWT_REFRESH_SECRET    | Specifies the secret key used to sign the refresh tokens for token refreshing. | `my-refresh-secret`         |
| SMTP_USER             | Specifies the username or email address for the SMTP server for sending        | `example@gmail.com`         |
| SMTP_PASS             | Specifies the password for the SMTP server for sending emails.                 | `password123`               |
| CLOUDINARY_CLOUD_NAME | Specifies the cloud name for the Cloudinary service for image hosting.         | `my-cloud-name`             |
| CLOUDINARY_API_KEY    | Specifies the API key for the Cloudinary service for image hosting.            | `my-api-key`                |
| CLOUDINARY_API_SECRET | Specifies the API secret for the Cloudinary service for image hosting.         | `my-api-secret`             |

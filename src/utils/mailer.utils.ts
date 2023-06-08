const getMailHTML = (otp: string) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FirstServe Password Recovery</title>
        <style>
          body {
            background-color: #F2F2F2;
            margin: 0;
            padding: 0;
            font-family: 'Lato', sans-serif;
            font-size: 16px;
            line-height: 1.5em;
            text-align: center;
          }

          table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%;
            margin: 0 auto;
          }

          table td {
            font-family: 'Lato', sans-serif;
            font-size: 16px;
            vertical-align: top;
          }

          .header {
            background-color: #C4F042;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            color: #1d1d1d;
            font-size: 24px;
            font-weight: bold;
            line-height: 1.5em;
            padding: 20px;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
          }

          .content {
            background-color: #FFFFFF;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);
            margin: 0 auto;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }

          .content p {
            margin: 0 0 1em;
          }

          .content h1 {
            color: #1d1d1d;
            font-size: 30px;
            font-weight: normal;
            margin: 20px 0 30px;
            text-align: center;
          }

          .content .code {
            background-color: #C4F042;
            border-radius: 5px;
            color: #1d1d1d;
            display: inline-block;
            font-size: 36px;
            font-weight: bold;
            line-height: 1.5em;
            padding: 5px 15px;
            text-align: center;
          }

          .footer {
            background-color: #FFFFFF;
            border-top: 1px solid #E2E2E2;
            color: #999999;
            font-size: 12px;
            line-height: 1.5em;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <table class="wrapper" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <table class="header" cellpadding="0" cellspacing="0">
                <tr>
                  <td> FirstServe Password Recovery </td>
                </tr>
              </table>
              <table class="content" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1>Use the following OTP code to recover your password</h1>
                    <p>Your OTP code is:</p>
                    <p class="code">${otp}</p>
                  </td>
                </tr>
              </table>
              <table class="footer" cellpadding="0" cellspacing="0">
                <tr>
                  <td> © 2023 FirstServe </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export default getMailHTML

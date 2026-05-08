
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(
  process.env.SENDGRID_API_KEY as string
);

export const sendResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink =
    `http://localhost:5173/reset-password?token=${token}`;

  const msg = {
    to: email,

    from: process.env.EMAIL_FROM as string,

    subject: "Reset Your BedWatch Password",

    html: `
      <div
        style="
          background-color:#f4f7fb;
          padding:40px 20px;
          font-family:Arial,sans-serif;
        "
      >
        <div
          style="
            max-width:500px;
            margin:auto;
            background:white;
            border-radius:12px;
            padding:40px 30px;
            box-shadow:0 4px 12px rgba(0,0,0,0.08);
          "
        >
          <h2
            style="
              color:#4F46E5;
              margin-top:0;
            "
          >
            BedWatch
          </h2>

          <h1
            style="
              margin-top:10px;
              color:#222;
              font-size:26px;
            "
          >
            Reset Password
          </h1>

          <p
            style="
              margin-top:20px;
              color:#555;
              font-size:16px;
              line-height:1.7;
            "
          >
            We received a request to reset
            your BedWatch account password.
          </p>

          <p
            style="
              color:#555;
              font-size:15px;
              line-height:1.7;
            "
          >
            Click the button below to
            continue securely.
          </p>

          <div style="margin:35px 0;">
            <a
              href="${resetLink}"
              style="
                background-color:#4F46E5;
                color:white;
                text-decoration:none;
                padding:14px 28px;
                border-radius:8px;
                font-size:15px;
                font-weight:bold;
                display:inline-block;
              "
            >
              Reset Password
            </a>
          </div>

          <p
            style="
              color:#777;
              font-size:14px;
              line-height:1.6;
            "
          >
            This secure link will expire in
            15 minutes.
          </p>

          <p
            style="
              color:#999;
              font-size:12px;
              margin-top:25px;
              word-break:break-all;
            "
          >
            ${resetLink}
          </p>
        </div>
      </div>
    `,
  };

  await sgMail.send(msg);
};
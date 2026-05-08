import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
export const sendAccountCreatedEmail = async (
  email: string,
  token: string,
  role: string,
) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  const msg = {
    to: email,

    from: process.env.EMAIL_FROM as string,

    subject: "Your BedWatch Account Has Been Created",

    html: `
        <div
          style="
            background:#f4f7fb;
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
              Welcome to BedWatch
            </h2>

            <p
              style="
                color:#555;
                line-height:1.7;
              "
            >
              Your account has been created
              successfully as
              <strong>${role}</strong>.
            </p>

            <p
              style="
                color:#555;
                line-height:1.7;
              "
            >
              Please click below button to
              set your password and activate
              your account.
            </p>

            <div style="margin-top:30px;">
              <a
                href="${resetLink}"
                style="
                  background:#4F46E5;
                  color:white;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  display:inline-block;
                  font-weight:bold;
                "
              >
                Set Password
              </a>
            </div>

            <p
              style="
                margin-top:30px;
                color:#999;
                font-size:13px;
              "
            >
              This link expires in 24 hours.
            </p>
          </div>
        </div>
      `,
  };

  await sgMail.send(msg);
};

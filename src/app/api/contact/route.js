import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, state } = body || {};

    if (!name || !email || !phone || !state) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === "true"
        : smtpPort === 465;
    const mailFrom = process.env.MAIL_FROM || process.env.CONTACT_FROM_EMAIL || smtpUser;
    const mailTo = process.env.MAIL_TO || process.env.CONTACT_RECEIVER_EMAIL || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("Missing SMTP config");
      return new Response(
        JSON.stringify({ ok: false, error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    const subject = `New Mayrake Lead: ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nState: ${state}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee;">
          <div style="background: #0052cc; color: #fff; padding: 16px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Mayrake - The Clothing Effect</h2>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; font-size: 16px;">
              <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${phone}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>State:</strong></td><td>${state}</td></tr>
            </table>
          </div>
          <div style="background: #f1f1f1; color: #888; padding: 12px 24px; border-radius: 0 0 8px 8px; text-align: center;">
            <small>© Mayrake | The Clothing Effect</small>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ ok: true, message: "Email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Mailer error:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Failed to send email",
        details: err?.code || err?.response || err?.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
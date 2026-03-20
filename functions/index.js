/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const { defineSecret } = require("firebase-functions/params");
const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Secrets for SMTP setup (configure via `firebase functions:secrets:set ...`)
const SMTP_HOST = defineSecret('SMTP_HOST');
const SMTP_PORT = defineSecret('SMTP_PORT');
const SMTP_USER = defineSecret('SMTP_USER');
const SMTP_PASS = defineSecret('SMTP_PASS');
const TO_EMAIL = defineSecret('TO_EMAIL');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.contact = onRequest({ secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL] }, async (req, res) => {
	if (req.method !== 'POST') {
		res.status(405).send('Method Not Allowed');
		return;
	}
	try {
		const { name, email, phone, state, city } = req.body || {};
		if (!name || !email) {
			res.status(400).json({ error: 'Missing required fields: name, email' });
			return;
		}

		// Create transporter once per request (container may reuse it)
		const transporter = nodemailer.createTransport({
			host: SMTP_HOST.value(),
			port: Number(SMTP_PORT.value() || 587),
			secure: Number(SMTP_PORT.value() || 587) === 465,
			auth: {
				user: SMTP_USER.value(),
				pass: SMTP_PASS.value(),
			},
		});

				const mailOptions = {
						from: `SOP Edits Enquiry <${SMTP_USER.value()}>`,
						to: TO_EMAIL.value() || SMTP_USER.value(),
						subject: `New enquiry • ${name}`,
						replyTo: email,
						text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nState: ${state || "-"}\nCity: ${city || "-"}`,
						html: `
							<div style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:#f6f7f9;padding:24px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.06);overflow:hidden;">
									<tr>
										<td style="padding:16px 20px;background:#0ea5e9;color:#fff;font-weight:700;font-size:16px;">
											SOP Edits • New Enquiry
										</td>
									</tr>
									<tr>
										<td style="padding:20px;">
											<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
												<tr>
													<td style="width:140px;color:#64748b;font-size:13px;padding:8px 0;">Name</td>
													<td style="color:#0f172a;font-size:14px;padding:8px 0;">${name}</td>
												</tr>
												<tr>
													<td style="width:140px;color:#64748b;font-size:13px;padding:8px 0;">Email</td>
													<td style="color:#0f172a;font-size:14px;padding:8px 0;">${email}</td>
												</tr>
												<tr>
													<td style="width:140px;color:#64748b;font-size:13px;padding:8px 0;">Phone</td>
													<td style="color:#0f172a;font-size:14px;padding:8px 0;">${phone || '-'}</td>
												</tr>
												<tr>
													<td style="width:140px;color:#64748b;font-size:13px;padding:8px 0;">State</td>
													<td style="color:#0f172a;font-size:14px;padding:8px 0;">${state || '-'}</td>
												</tr>
												<tr>
													<td style="width:140px;color:#64748b;font-size:13px;padding:8px 0;">City</td>
													<td style="color:#0f172a;font-size:14px;padding:8px 0;">${city || '-'}</td>
												</tr>
											</table>
											<div style="margin-top:18px;color:#64748b;font-size:12px;">This email was generated from the website contact form.</div>
										</td>
									</tr>
								</table>
							</div>
						`,
				};

		await transporter.sendMail(mailOptions);
		logger.info('Contact email sent', { to: TO_EMAIL.value() || SMTP_USER.value() });
		res.status(200).json({ ok: true });
	} catch (err) {
		logger.error('Contact error', err);
		res.status(500).json({ error: 'Server error' });
	}
});

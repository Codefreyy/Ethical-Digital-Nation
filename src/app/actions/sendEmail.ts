'use server';

import { Resend } from 'resend';
import ParticipantsEmail from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to, from, subject, text, replyTo,
}: any, formData: any) {
    try {
        const response = await resend.emails.send({
            reply_to: replyTo,
            from,
            to,
            subject,
            react: ParticipantsEmail({ subject, content: text }),
        });
        return { success: true, response };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

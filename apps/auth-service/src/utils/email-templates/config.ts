export type EmailTemplateData = Record<string, unknown>;

export type EmailTemplateConfig = {
    /** Email subject line shown in the inbox */
    subject: string | ((data: EmailTemplateData) => string);
};

/**
 * Register every EJS template here when you add a new one.
 * `sendMail` resolves the inbox subject from this map.
 */
export const EMAIL_TEMPLATES: Record<string, EmailTemplateConfig> = {
    "user-activation-mail": {
        subject: "Verify your email - E-market",
    },
    "user-forgot-password-email": {
        subject: "Reset your password - E-market",
    },
};

export const resolveEmailSubject = (
    templateName: string,
    data: EmailTemplateData,
    override?: string
): string => {
    if (override) {
        return override;
    }

    const config = EMAIL_TEMPLATES[templateName];
    if (!config) {
        throw new Error(
            `No email subject configured for template "${templateName}". Add it to EMAIL_TEMPLATES in email-templates/config.ts.`
        );
    }

    return typeof config.subject === "function"
        ? config.subject(data)
        : config.subject;
};

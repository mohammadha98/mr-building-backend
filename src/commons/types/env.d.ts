namespace NodeJS {
  interface ProcessEnv {
    // APP
    APP_NAME: string;
    APP_CONTENT: string;
    APP_PORT: number;
    APP_ROOT_PATH: string;
    APP_MODE: string;
    #APP_MODE: string;
    REDIS_PASSWORD: string;
    APP_URL: string;
    APP_CONTENT_PATH: string;

    // JWT
    JWT_SECRET_KEY: string;
    JWT_SECRET_KEY_ADMIN: string;
    DATABASE_URL: string;

    // mailer
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_SECURE: boolean;
  }
}

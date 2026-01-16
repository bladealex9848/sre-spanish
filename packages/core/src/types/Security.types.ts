export type OAuthConfig = {
    oAuthAppID: string;
    oAuthAppSecret: string;
    oAuthBaseUrl: string;
    oAuthResource?: string;
    oAuthScope?: string;
};

export type EncryptionSettings = {
    encryption?: {
        key?: string;
        algorithm?: string;
    };
};

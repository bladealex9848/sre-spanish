//==[ SRE: AWS Types ]======================
export type AWSCredentials = {
    accessKeyId: string;
    secretAccessKey: string;
};

export type AWSRegionConfig = {
    region: string;
};

export type AWSConfig = AWSCredentials & AWSRegionConfig;
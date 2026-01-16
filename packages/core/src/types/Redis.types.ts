//==[ SRE: Redis Types ]======================

export type RedisConfig = {
    name: string;
    password: string;
    hosts: string | string[] | any[];
    prefix?: string;
};

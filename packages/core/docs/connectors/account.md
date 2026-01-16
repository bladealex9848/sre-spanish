# Account Connectors

The Account subsystem provides user authentication, authorization, and account management functionality. It handles user identity, permissions, and access control for the SRE system.

## Available Connectors

### DummyAccount

**Role**: Development account connector  
**Summary**: Provides a simplified account system for development and testing. Always returns a default user without actual authentication, useful for prototyping and local development.

| Setting          | Type    | Required | Default                               | Description                      |
| ---------------- | ------- | -------- | ------------------------------------- | -------------------------------- |
| `defaultUser`    | object  | No       | `{id: 'dev-user', name: 'Developer'}` | Default user object              |
| `permissions`    | array   | No       | `['*']`                               | Default permissions for the user |
| `allowAnonymous` | boolean | No       | `true`                                | Allow anonymous access           |
| `logAccess`      | boolean | No       | `true`                                | Log account access attempts      |

**Example Configuration:**

```typescript
import { SRE } from '@smythos/sre';

SRE.init({
    Account: {
        Connector: 'DummyAccount',
        Settings: {
            defaultUser: {
                id: 'admin',
                name: 'Admin User',
                email: 'admin@example.com',
            },
            permissions: ['read', 'write', 'admin'],
            allowAnonymous: false,
            logAccess: true,
        },
    },
});
```

**Use Cases:**

-   Development and testing environments
-   Prototyping applications
-   Local development without authentication overhead
-   Testing access control logic
-   Demo applications

---

### AWSAccount

**Role**: AWS IAM-based account connector  
**Summary**: Provides authentication and authorization using AWS Identity and Access Management (IAM). Integrates with AWS services for enterprise-grade identity management.

| Setting           | Type    | Required | Default | Description                               |
| ----------------- | ------- | -------- | ------- | ----------------------------------------- |
| `region`          | string  | Yes      | -       | AWS region for IAM operations             |
| `accessKeyId`     | string  | No       | -       | AWS access key ID (can use IAM roles)     |
| `secretAccessKey` | string  | No       | -       | AWS secret access key (can use IAM roles) |
| `userPoolId`      | string  | No       | -       | Cognito User Pool ID if using Cognito     |
| `clientId`        | string  | No       | -       | Cognito App Client ID                     |
| `roleArn`         | string  | No       | -       | IAM role ARN for assume role operations   |
| `sessionDuration` | number  | No       | `3600`  | Session duration in seconds               |
| `mfaRequired`     | boolean | No       | `false` | Require multi-factor authentication       |

**Example Configuration:**

```typescript
import { SRE } from '@smythos/sre';

SRE.init({
    Account: {
        Connector: 'AWSAccount',
        Settings: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_XXXXXXXXX',
            clientId: 'your-cognito-client-id',
            roleArn: 'arn:aws:iam::123456789012:role/SREUserRole',
            sessionDuration: 7200,
            mfaRequired: true,
        },
    },
});
```

**Use Cases:**

-   Production environments using AWS infrastructure
-   Enterprise applications requiring compliance
-   Multi-service AWS deployments
-   Applications with strict security requirements
-   Integration with existing AWS identity systems

---

### JSONFileAccount

**Role**: File-based account connector  
**Summary**: Provides user management using a local JSON file for storing user accounts and permissions. Suitable for small applications with simple user management needs.

| Setting            | Type    | Required | Default               | Description                         |
| ------------------ | ------- | -------- | --------------------- | ----------------------------------- |
| `usersFile`        | string  | No       | `./.smyth/users.json` | Path to users JSON file             |
| `encryptPasswords` | boolean | No       | `true`                | Encrypt stored passwords            |
| `hashAlgorithm`    | string  | No       | `bcrypt`              | Password hashing algorithm          |
| `saltRounds`       | number  | No       | `10`                  | Salt rounds for bcrypt              |
| `sessionTimeout`   | number  | No       | `3600`                | Session timeout in seconds          |
| `maxLoginAttempts` | number  | No       | `5`                   | Maximum failed login attempts       |
| `lockoutDuration`  | number  | No       | `900`                 | Account lockout duration in seconds |

**Example Configuration:**

```typescript
import { SRE } from '@smythos/sre';

SRE.init({
    Account: {
        Connector: 'JSONFileAccount',
        Settings: {
            usersFile: './config/users.json',
            encryptPasswords: true,
            hashAlgorithm: 'bcrypt',
            saltRounds: 12,
            sessionTimeout: 7200,
            maxLoginAttempts: 3,
            lockoutDuration: 1800,
        },
    },
});
```

**Use Cases:**

-   Small to medium applications
-   Internal tools and dashboards
-   Applications with simple user management
-   Situations requiring user persistence without external services
-   Development environments with realistic user data

## Account Operations

All account connectors support these standard operations:

| Operation                                 | Description                    |
| ----------------------------------------- | ------------------------------ |
| `authenticate(credentials)`               | Verify user credentials        |
| `authorize(user, resource, action)`       | Check user permissions         |
| `getCurrentUser()`                        | Get current authenticated user |
| `createUser(userData)`                    | Create new user account        |
| `updateUser(userId, userData)`            | Update user information        |
| `deleteUser(userId)`                      | Remove user account            |
| `getUserPermissions(userId)`              | Get user permissions           |
| `setUserPermissions(userId, permissions)` | Update user permissions        |

## User Object Structure

Standard user object format across all connectors:

```typescript
interface User {
    id: string;
    name: string;
    email?: string;
    permissions: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    lastLogin?: Date;
    active: boolean;
}
```

## Security Best Practices

### General Guidelines

-   Always use HTTPS for authentication endpoints
-   Implement proper session management
-   Use strong password policies
-   Enable account lockout mechanisms
-   Regular audit user accounts and permissions
-   Implement proper logging for security events

### JSONFileAccount Security

-   Store user files outside of web-accessible directories
-   Use strong password hashing (bcrypt with high salt rounds)
-   Set restrictive file permissions (600)
-   Regular backup user data
-   Consider encryption for sensitive user data

### AWSAccount Security

-   Use IAM roles instead of access keys when possible
-   Implement least-privilege access policies
-   Enable CloudTrail for audit logging
-   Use AWS Cognito for user pool management
-   Implement proper MFA policies
-   Regular review IAM policies and roles

## Integration Examples

### Environment-Based Configuration

```typescript
import { SRE } from '@smythos/sre';

SRE.init({
    Account: {
        Connector: process.env.NODE_ENV === 'production' ? 'AWSAccount' : 'DummyAccount',
        Settings:
            process.env.NODE_ENV === 'production'
                ? {
                      region: process.env.AWS_REGION,
                      userPoolId: process.env.COGNITO_USER_POOL_ID,
                  }
                : {
                      defaultUser: { id: 'dev', name: 'Developer' },
                  },
    },
});
```

### Multi-Connector Setup

```typescript
import { SRE } from '@smythos/sre';

// Development
SRE.init({
    Account: {
        Connector: 'JSONFileAccount',
        Settings: {
            usersFile: './dev-users.json',
            sessionTimeout: 86400,
        },
    },
});

// Production
SRE.init({
    Account: {
        Connector: 'AWSAccount',
        Settings: {
            region: 'us-east-1',
            userPoolId: 'prod-user-pool',
            mfaRequired: true,
        },
    },
});
```

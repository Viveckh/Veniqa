# AWS S3 Setup

When you set up the S3 bucket for image storage, the following are example settings for permissions. Feel free to customize based on your  needs.

## Block Public Access Settings

* Block public access to buckets and objects granted through new access control lists (ACLs): `ON`
* Block public access to buckets and objects granted through any access control lists (ACLs): `ON`
* Block public access to buckets and objects granted through new public bucket or access point policies: `OFF`
* Block public and cross-account access to buckets and objects through any public bucket or access point policies: `OFF`

## Bucket Policy
An example bucket policy that allows GET requests from any domain (for thumbnail visibility when sharing links).

```
{
    "Version": "2012-10-17",
    "Id": "Policy1544293475857",
    "Statement": [
        {
            "Sid": "Stmt1544293474782",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME-FOR-VENIQA-IMAGES/*"
        }
    ]
}
```

## CORS Configuration

The following example CORS configuration fulfills the GET requests from any HTTPS domain, but only fulfills the HEAD/PUT/POST/DELETE requests if they originate from our demo admin site - [https://admin.veniqa.com](https://admin.veniqa.com). Make updates to the following based on your own domains.

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>https://*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
<CORSRule>
    <AllowedOrigin>https://admin.veniqa.com</AllowedOrigin>
    <AllowedOrigin>https://www.admin.veniqa.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>

```

> **NOTE**: If you are accessing these buckets from your local host for development, add the following rule as well.

```
<CORSRule>
    <AllowedOrigin>http://localhost:YOUR_SERVER_PORT_HERE</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
```

> **HELPFUL TIP**: HTTP and HTTPS require separate rules. Allowing access to `https://DOMAIN-X.com` does not automatically allow access to `http://DOMAIN-X.com`.
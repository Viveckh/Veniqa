# SSL Setup

Althought not required for development purposes, it is highly recommended you bind your domains and servers with a SSL Certificate. You can get started with free SSL certificates provisioned through [Lets Encrypt](https://letsencrypt.org/). Below is one of the many ways you can provision and upload SSL certificates to your servers.

### Lets Encrypt Manual Mode

### Install Certbot using Homebrew
```brew install certbot```

### Provision a new certificate in manual mode. 

In this example, we're provisioning certificates for our demo sites.

```
certbot certonly --manual --preferred-challenges dns -d admin-server.veniqa.com

certbot certonly --manual --preferred-challenges dns -d shop-server.veniqa.com

```

### Verify domain ownership
The process will ask you to plug in a `TXT` DNS record in your DNS Management Portal to verify your domain ownership. 
> When plugging in record name in domain providers like GoDaddy, just input `_acme-challenge.subdomain_name` (primary domain name like `veniqa.com` will be appended automatically by godaddy during queries)

### Copy certificates to accessible folders (optional)
By default, Lets Encrypt will generate certificates in secure `/etc/` folders. If you need to move them to a more accessible location for external upload, use the following command - where the first path is the source dir and second path is the destination dir.

`cp -RL /etc/letsencrypt/live/admin-server.veniqa.com /Users/Shared/Playground/CodeForLyf/ssl-certificates/`

### Convert certificate to PFX (if necessary)
Some cloud providers like Azure ask for a PFX certificate, so for such needs you can convert the LetsEncrypt's PEM certificate to PFX format using the following command in the certificate directory.

`openssl pkcs12 -export -out certificate.pfx -inkey privkey.pem -in cert.pem -certfile chain.pem`

### Certificate ready for use
Go ahead and upload the SSL certificate using your hosting providers's control panel.

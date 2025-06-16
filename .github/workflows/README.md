# GCP VM Deployment Setup

This GitHub Action deploys the Bandera Skyworks website to a Google Cloud Platform Virtual Machine.

## Prerequisites

1. A GCP VM instance with a web server (Nginx or Apache) installed
2. A GCP service account with necessary permissions
3. GitHub repository secrets configured

## Required GitHub Secrets

Add these secrets to your repository (Settings → Secrets and variables → Actions):

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_VM_NAME`: Name of your VM instance
- `GCP_ZONE`: Zone where your VM is located (e.g., `us-central1-a`)
- `GCP_SERVICE_ACCOUNT_EMAIL`: Service account email
- `GCP_SA_KEY`: Service account JSON key (entire JSON content)

## GCP Setup

### 1. Create a Service Account

```bash
# Create service account
gcloud iam service-accounts create github-deploy \
    --display-name="GitHub Deploy Account"

# Get the email
gcloud iam service-accounts list
```

### 2. Grant Permissions

```bash
# Grant compute instance admin role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.instanceAdmin"

# Grant service account user role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 3. Create Service Account Key

```bash
gcloud iam service-accounts keys create github-deploy-key.json \
    --iam-account=github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

Copy the contents of `github-deploy-key.json` to the `GCP_SA_KEY` secret.

### 4. VM Web Server Setup

Ensure your VM has a web server installed:

```bash
# For Nginx
sudo apt-get update
sudo apt-get install nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# For Apache
sudo apt-get update
sudo apt-get install apache2
sudo systemctl enable apache2
sudo systemctl start apache2
```

### 5. Configure Web Server

For Nginx, create `/etc/nginx/sites-available/banderaskyworks`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/banderaskyworks;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/banderaskyworks /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Firewall Rules

Ensure your VM allows HTTP/HTTPS traffic:

```bash
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server

gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --source-ranges 0.0.0.0/0 \
    --target-tags https-server

# Add tags to your VM
gcloud compute instances add-tags YOUR_VM_NAME \
    --tags http-server,https-server \
    --zone YOUR_ZONE
```

## Usage

The deployment will trigger automatically when:
- Code is pushed to the `main` branch
- Code is pushed to the `beta` branch
- Manually triggered via GitHub Actions tab

## Customization

- Modify the `DEPLOY_DIR` in the workflow to change deployment location
- Add more branches to the `on.push.branches` array
- Adjust file patterns in the `gcloud compute scp` command
- Add build steps if needed (e.g., for preprocessors or bundlers)
# Zap - Setup

## GitLab

### GitLab vulnerability scanning

1. from the GitLab project -> *CI/CD* -> *Scheduled* -> *New schedule*:
   - description: `Python Vulnerabilities`
   - interval pattern: `0 11 * * WED` (each Wednesday at 11:00)
   - cron timezone: `London`
   - target branch: `streamlit`

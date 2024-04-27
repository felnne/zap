import base64

def encode_url(sharing_url):
    base64_value = base64.b64encode(sharing_url.encode('utf-8')).decode('utf-8')
    encoded_url = "u!" + base64_value.rstrip('=').replace('/', '_').replace('+', '-')
    return encoded_url

sharing_url = "https://nercacuk.sharepoint.com/:t:/s/BASMagicTeam/ETlZ95IWwH1Ln3oH5zdfRiMBsZDOl3JmSkQqp8evRwTgXQ"
print(encode_url(sharing_url))

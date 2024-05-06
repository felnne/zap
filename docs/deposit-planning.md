# Deposits planning

## Datasets

- triggered by email (or possibly GitLab issue through data management project)
- template email generated from Zap [1]
- how to generate template?

[1]

```
Hello,

This is an automated email requesting the deposit of the following resource:

## Overview

Resource title:

> {{identification.title.value}}

Resource unique identifier:

> {{file_identifier}}

Resource summary:

> {{identification.purpose}}

## Artefacts for deposit

There are 2 artefacts for deposit, accessible from the URLs below for approximately 90 days.

Once deposited, the relevant transfer option URL and distributor should be updated in the resource metadata.

## Artefacts

### Artefact 1/2

- {{distribution.*.transfer_option.online_resource.href}}

### Artefact 2/2

- {{distribution.*.transfer_option.online_resource.href}}

## Metadata and item links

ISO 19115 metadata for this resource is available at:

- https://data.bas.ac.uk/records/iso-19139-xml/{{file_identifier}}.xml

A human readable version for this metadata is available at:

- https://data.bas.ac.uk/items/{{file_identifier}}

## Data Transfer Agreement

A signed data transfer agreement for this deposit is availble at:

https://nercacuk.sharepoint.com/:w:/s/BASMagicTeam/EZFcqovUtQNKm-rLY8MOLukBsk572RdCrcSio21tj-3MLw?e=oMGFi4

Note: This DTA is a template used for all deposits.

--

This email was generated from a template provided by Zap ⚡️ (https://zap.data.bas.ac.uk) with possible further editing
by the sender.

Feedback on Zap ⚡️ can be sent to MAGIC (magic@bas.ac.uk), who maintain it.
```

## Products

### Summary

- have a flow based implementation for products deposit files (inc. with support for anon access)
- have a theoretical implemention of an anon access proxy but can't solve how to get an auth token without admin consent

### Deposit flow

- made a [Flow](https://make.powerautomate.com/environments/Default-b311db95-32ad-438f-a101-7ba061712a4e/flows/bed9ad47-aedc-454a-bd75-06faab2a10d1/runs) to deposit in existing scratch document library
- doesn't have `artefact_id` col for some reason
- already have the production SharePoint site for this setup but no document libraries yet
- HTTP get action doesn't follow redirects
- don't need to create folder before creating content within it (not tested beyond a single depth)
- also fine if parent folder already exists
- creates sharing link (view only, tenant wide access)
- tried with:
  - https://www.bas.ac.uk/robots.txt (tiny)
  - https://www.bas.ac.uk/sitemap.xml (KBs)
  - https://www.bas.ac.uk/wp-content/uploads/2015/05/public_information_leaflet_bas_aircraft.pdf (1.2MB)
  - https://www.bas.ac.uk/wp-content/uploads/2023/09/A68-a-Povl-Abrahamsen-BAS.mp4 (~20MB)
- can we check whether a flow worked?
   - yes, can return a response, currently returns sharing link as a `location` header (could be anything)
   - means response takes time needed to succeed which is useful
   - doesn't handle errors as such so need to check for 201 Created (Ok) vs 202 Accepted (Not Ok)
- for accessing files without needing basweb to be accessible from flow:
  - could use get file via SFTP action instead (using a new key pair for my user account)

Payload:

```json
{
    "url": "https://example.com/file.txt",
    "artefact_id": "123",
    "resource_id": "abc",
    "open_access": true
}
```

Example response: `https://nercacuk.sharepoint.com/:t:/s/BASMagicTeam/ETlZ95IWwH1Ln3oH5zdfRiMBsZDOl3JmSkQqp8evRwTgXQ`

### Anon access proxy

- based on https://learn.microsoft.com/en-us/graph/api/shares-get?view=graph-rest-1.0&tabs=http#encoding-sharing-urls
- Python encoder: `scripts/ms-sharing-link-encoder.py`
- PA encoder: [7]
- example request [1], response [2]
- adding `/driveItem` [3] gives us a download link [4], adding `$expand=listItem` [5] gives metadata fields too [6]
- adding a new boolean `open_access` field in that document library gives: `{"record_id": "test3", "open_access": true}`
- that's everything needed to access a sharing link, determine if open access and either:
  - redirect them to the pre-signed download (if open)
  - redirect to sharing link (if closed)
- prototype [flow](https://make.powerautomate.com/environments/Default-b311db95-32ad-438f-a101-7ba061712a4e/flows/d160f941-eac1-43fc-9a08-24d266b5e52e/details)

Problem 1 - how to authenticate that graph request?

- I assumed PA would have a 'make authenticated graph call' (it does but only for teams related resources)
- instead you need to create a app registration and essentially make the request yourself manually (which is rubbish)
- I looked at using the 'Resource Owner Password Credentials' flow to use the credentials for the anon user we have
- this requires to go through an app registration too, so I used the products distribution service (as a client)
- this gave an error that the user needs to consent to the application interactively first
- I tried to do that using the 'Device Code' flow and got an error that admin consent is needed
- I don't understand why that's the case as everything is using delegated permissions in the app registration
- my user can't be used for this in any case as it requires MFA
- as an experiment, I tried to use the token the Graph Explorer has but these have an intentionally really short expiary
- I could create a more traditional app for this, but worried this would end up with the same problem after more work

Problem 2 - how to avoid needing a post request trigger?

- i.e. want [GET] `https://{power_automate_endpoint}?=url={sharing_url}` rather than [POST] `{"url": "{sharing_url}"}`
- otherwise what do we put in the transfer option href?
- could have a second proxy that converts GET to POST but that's very clunky
- actually we'll will want something like that as we don't want to directly embed a PA flow URL in records
- that could be done in HAProxy potentially, or the downloads proxy (whether in Lambda or refactored into Flask app)

---

[1] https://graph.microsoft.com/v1.0/shares/u!aHR0cHM6Ly9uZXJjYWN1ay5zaGFyZXBvaW50LmNvbS86dDovcy9CQVNNYWdpY1RlYW0vRVRsWjk1SVd3SDFMbjNvSDV6ZGZSaU1Cc1pET2wzSm1Ta1FxcDhldlJ3VGdYUQ

[2]

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#shares/$entity",
    "id": "u!aHR0cHM6Ly9uZXJjYWN1ay5zaGFyZXBvaW50LmNvbS86dDovcy9CQVNNYWdpY1RlYW0vRVRsWjk1SVd3SDFMbjNvSDV6ZGZSaU1Cc1pET2wzSm1Ta1FxcDhldlJ3VGdYUQ",
    "name": "robots.txt"
}
```

[3] https://graph.microsoft.com/v1.0/shares/u!aHR0cHM6Ly9uZXJjYWN1ay5zaGFyZXBvaW50LmNvbS86dDovcy9CQVNNYWdpY1RlYW0vRVRsWjk1SVd3SDFMbjNvSDV6ZGZSaU1Cc1pET2wzSm1Ta1FxcDhldlJ3VGdYUQ/driveItem

[4]

(Irrelevant bits removed, download link is time limited so won't last)

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#Collection(driveItem)/$entity",
    "@microsoft.graph.downloadUrl": "https://nercacuk.sharepoint.com/sites/BASMagicTeam/_layouts/15/download.aspx?UniqueId=92f75939-c016-4b7d-9f7a-07e7375f4623&Translate=false&tempauth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBFeHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXVkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwL25lcmNhY3VrLnNoYXJlcG9pbnQuY29tQGIzMTFkYjk1LTMyYWQtNDM4Zi1hMTAxLTdiYTA2MTcxMmE0ZSIsImNhY2hla2V5IjoiMGguZnxtZW1iZXJzaGlwfDEwMDMwMDAwODhlNzcxMjdAbGl2ZS5jb20iLCJjaWQiOiI5RlpDV3BrVjVuSUFWckVGZXYwRzRnPT0iLCJlbmRwb2ludHVybCI6ImllUU1VQjFFdkZES0hydVc1K2FLMmlIdVowSjd3aC9HM2hmOUE0dE5DM009IiwiZW5kcG9pbnR1cmxMZW5ndGgiOiIxMzgiLCJleHAiOiIxNzEzNjE4NDMzIiwiZmFtaWx5X25hbWUiOiJGZW5uZWxsIiwiZ2l2ZW5fbmFtZSI6IkZlbGl4IiwiaXBhZGRyIjoiMjAuMTkwLjE2OS45NiIsImlzbG9vcGJhY2siOiJUcnVlIiwiaXNzIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIiwibmJmIjoiMTcxMzYxNDgzMyIsInB1aWQiOiIxMDAzMDAwMDg4RTc3MTI3Iiwic2NwIjoibXlmaWxlcy5yZWFkIGFsbGZpbGVzLnJlYWQgbXlmaWxlcy53cml0ZSBhbGxmaWxlcy53cml0ZSBncm91cC53cml0ZSBhbGxzaXRlcy53cml0ZSBhbGxwcm9maWxlcy5yZWFkIGFsbHByb2ZpbGVzLndyaXRlIiwic2l0ZWlkIjoiWVdVMU56Y3hPV1l0WlRkaFlpMDBaVGxoTFdJMU9HWXRNbVZsTURRd1lqTmxOak00IiwidGlkIjoiYjMxMWRiOTUtMzJhZC00MzhmLWExMDEtN2JhMDYxNzEyYTRlIiwidHQiOiIyIiwidXBuIjoiZmVsbm5lQGJhcy5hYy51ayIsInZlciI6Imhhc2hlZHByb29mdG9rZW4ifQ.PfmO5BEMN46DloGVw6iv-rJklHRL9fk3dRi64ZzEMc4&ApiVersion=2.0",
}
```

[5] https://graph.microsoft.com/v1.0/shares/u!aHR0cHM6Ly9uZXJjYWN1ay5zaGFyZXBvaW50LmNvbS86dDovcy9CQVNNYWdpY1RlYW0vRVRsWjk1SVd3SDFMbjNvSDV6ZGZSaU1Cc1pET2wzSm1Ta1FxcDhldlJ3VGdYUQ/driveItem$expand=listItem

[6]

(again, stripped down)

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#shares('u%21aHR0cHM6Ly9uZXJjYWN1ay5zaGFyZXBvaW50LmNvbS86dDovcy9CQVNNYWdpY1RlYW0vRVRsWjk1SVd3SDFMbjNvSDV6ZGZSaU1Cc1pET2wzSm1Ta1FxcDhldlJ3VGdYUQ')/driveItem(listItem())/$entity",
    "@microsoft.graph.downloadUrl": "https://nercacuk.sharepoint.com/sites/BASMagicTeam/_layouts/15/download.aspx?UniqueId=92f75939-c016-4b7d-9f7a-07e7375f4623&Translate=false&tempauth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBFeHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXVkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwL25lcmNhY3VrLnNoYXJlcG9pbnQuY29tQGIzMTFkYjk1LTMyYWQtNDM4Zi1hMTAxLTdiYTA2MTcxMmE0ZSIsImNhY2hla2V5IjoiMGguZnxtZW1iZXJzaGlwfDEwMDMwMDAwODhlNzcxMjdAbGl2ZS5jb20iLCJjaWQiOiIraE5IYVo4UFlyWkdwRDlpbVJYUHVRPT0iLCJlbmRwb2ludHVybCI6ImllUU1VQjFFdkZES0hydVc1K2FLMmlIdVowSjd3aC9HM2hmOUE0dE5DM009IiwiZW5kcG9pbnR1cmxMZW5ndGgiOiIxMzgiLCJleHAiOiIxNzEzNjE4ODcyIiwiZmFtaWx5X25hbWUiOiJGZW5uZWxsIiwiZ2l2ZW5fbmFtZSI6IkZlbGl4IiwiaXBhZGRyIjoiMjAuMTkwLjE2OS45NiIsImlzbG9vcGJhY2siOiJUcnVlIiwiaXNzIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIiwibmJmIjoiMTcxMzYxNTI3MiIsInB1aWQiOiIxMDAzMDAwMDg4RTc3MTI3Iiwic2NwIjoibXlmaWxlcy5yZWFkIGFsbGZpbGVzLnJlYWQgbXlmaWxlcy53cml0ZSBhbGxmaWxlcy53cml0ZSBncm91cC53cml0ZSBhbGxzaXRlcy53cml0ZSBhbGxwcm9maWxlcy5yZWFkIGFsbHByb2ZpbGVzLndyaXRlIiwic2l0ZWlkIjoiWVdVMU56Y3hPV1l0WlRkaFlpMDBaVGxoTFdJMU9HWXRNbVZsTURRd1lqTmxOak00IiwidGlkIjoiYjMxMWRiOTUtMzJhZC00MzhmLWExMDEtN2JhMDYxNzEyYTRlIiwidHQiOiIyIiwidXBuIjoiZmVsbm5lQGJhcy5hYy51ayIsInZlciI6Imhhc2hlZHByb29mdG9rZW4ifQ.RSHU3y8Gft2_xORGffoi4xRkWTXSq3ZU0039oZtGwsg&ApiVersion=2.0",
    "listItem@odata.context": "https://graph.microsoft.com/v1.0/$metadata#shares('u%21aHR0cHM6Ly9uZXJjYWN1ay5zaGFyZXBvaW50LmNvbS86dDovcy9CQVNNYWdpY1RlYW0vRVRsWjk1SVd3SDFMbjNvSDV6ZGZSaU1Cc1pET2wzSm1Ta1FxcDhldlJ3VGdYUQ')/driveItem/listItem/$entity",
    "listItem": {
        "fields": {
            "record_id": "test3"
        }
    }
}
```

[7]

```
concat('u!', replace(replace(replace(base64(triggerBody()?['url']), '=', ''), '/', '_'), '+', '-'))
```

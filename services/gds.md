
Bot traffic
```
CASE 
   WHEN REGEXP_MATCH(userAgent, '(?i).*(Bot|Spider|Crawl).*') 
   THEN 1
   ELSE 0
END
```

Browser
```
CASE 
   WHEN REGEXP_MATCH(userAgent, '(?i).*(Bot|Spider|Crawl).*') 
   THEN 'Bot' 
   WHEN REGEXP_MATCH(userAgent, '(?i).*Firefox.*') 
   AND NOT REGEXP_MATCH(userAgent, '(?i).*Seamonkey.*') 
   THEN 'Firefox' 
   WHEN REGEXP_MATCH(userAgent, '(?i).*Seamonkey.*')  
   THEN 'Seamonkey' 
   WHEN REGEXP_MATCH(userAgent, '(?i).*Chrome.*')
   AND NOT REGEXP_MATCH(userAgent, '(?i).*Chromium.*')
   THEN 'Chrome' 
   WHEN REGEXP_MATCH(userAgent, '(?i).*Chromium.*')  
   THEN 'Chromium' 
   WHEN REGEXP_MATCH(userAgent, '(?i).*Safari.*')
   AND NOT REGEXP_MATCH(userAgent, '(?i).*Chrome.*')
   AND NOT REGEXP_MATCH(userAgent, '(?i).*Chromium.*')
   THEN 'Safari' 
   WHEN REGEXP_MATCH(userAgent, '(?i).*OPR.*')  
   OR REGEXP_MATCH(userAgent, '(?i).*Opera.*')
   THEN 'Opera'
   WHEN REGEXP_MATCH(userAgent, '(?i).*MSIE.*') 
   OR REGEXP_MATCH(userAgent, '(?i).*Trident.*')
   THEN 'Internet Explorer' 
   ELSE 'Other' 
END
```

Device type
```
CASE
  WHEN REGEXP_MATCH(userAgent, "(?i).*Mobi.*")
  THEN "Mobile"
  
  ELSE "Desktop"
END
```

To Date
`TODATE(timestamp,'%Y-%m-%d')`

Domain
`REGEXP_EXTRACT(href,'http[s]*://([^/|$|#|\\?]*)')`

Page
`REGEXP_EXTRACT(href,'http[s]*://([^$|#|\\?]+)')`

Source
`REGEXP_EXTRACT(href,"utm_source=([^&#]+)")`

Medium
`REGEXP_EXTRACT(href,"utm_medium=([^&#]+)")`

Source / Medium
`CONCAT(REGEXP_EXTRACT(href,"utm_source=([^&#]+)"),REGEXP_EXTRACT(href,"utm_medium=([^&#]+)"))`

Campaign
`REGEXP_EXTRACT(href,"utm_campaign=([^&#]+)")`

Screensize
`CONCAT(width," x ",height)`


Link sharing
```
CASE 
	WHEN REGEXP_MATCH(refHash,"#[a-zA-Z0-9]{22,}") THEN True
    ELSE False
END
```

Valid referrers
`REGEXP_EXTRACT(refHash,"#[a-zA-Z0-9]{22,}")`

Path
`REGEXP_EXTRACT(Page,'(/[^$|#|\\?]*)')`

Channel Grouping
```
CASE
	WHEN REGEXP_CONTAINS(Medium,"(?i)(social|social media|social-network|social-media|sm|social network|post|organic|sharing|share|buffer)") THEN "Organic Social"
    WHEN REGEXP_CONTAINS(referrer,"(?i)(facebook|linkedin|twitter|reddit|quora|instagram|snapchat|pinterest|t\\.co|hackernews)") AND Source IS NULL THEN "Organic Social"
    WHEN REGEXP_CONTAINS(Medium,"(?i)(facebook|linkedin|twitter|reddit|quora|instagram|snapchat|pinterest|t\\.co|hackernews|post)") THEN "Organic Social"
    WHEN REGEXP_CONTAINS(Medium,"(?i)(email|newsletter)") THEN "Email"
    WHEN Medium="affiliate" THEN "Affiliates"
    WHEN Medium="referral" THEN "Referral"
    WHEN REGEXP_CONTAINS(Medium,"(?i)(cpc|cpm|cpa)") AND REGEXP_CONTAINS(Source,"(?i)^(facebook|twitter|linkedin|pinterest|snapchat|tiktok)$") THEN "Paid Social"
    WHEN REGEXP_CONTAINS(Medium,"(?i)(cpc|cpm|cpa)") AND REGEXP_CONTAINS(Source,"^(google|bing|yahoo)$") THEN "Paid Search"
    WHEN REGEXP_CONTAINS(Medium,"(?i)(ppc|paidsearch)$ ") THEN "Paid Search"
    WHEN REGEXP_CONTAINS(Source,"google|adwords") AND Medium="cpc" THEN "Paid Search"
    WHEN REGEXP_CONTAINS(Medium,"^(display|cpm|banner|retargeting)$") THEN "Paid Display"
    WHEN REGEXP_CONTAINS(Source,"^(criteo|adroll)$") THEN "Paid Display"
    WHEN REGEXP_CONTAINS(Medium,"^(cpv|cpa|cpp|content-text)$") THEN "Other Advertising"
    WHEN REGEXP_CONTAINS(Referrer,"(google|bing|duckduckgo|search\\.yahoo)") AND Source / Medium IS NULL THEN "Organic Search"
    WHEN Source / Medium IS NULL THEN "Direct"
    ELSE "Other"
END
```

True Channel Grouping
```
CASE
	WHEN Link Sharing=True AND Channel Grouping="Direct" THEN "Link Sharing"
    WHEN Link Sharing=True AND Channel Grouping="Organic Social" THEN "Link Sharing"
    WHEN Link Sharing=True AND Channel Grouping="Referral" THEN "Link Sharing"
    ELSE Channel Grouping
END
```

Is Viral
```
CASE
    WHEN REGEXP_MATCH(True Channel Grouping,"Link Sharing") THEN True
    ELSE False
END
```

Linksharing Pageviews
```
CASE 
    WHEN REGEXP_MATCH(True Channel Grouping,"Link Sharing") THEN 1
    ELSE 0
END
```



Virality
`(Record Count-sum(Viral Traffic))/sum(Viral Traffic)`

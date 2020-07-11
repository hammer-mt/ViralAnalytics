SELECT *
FROM `genial-core-277717.firestore_export.posts_raw_extracted` data
LEFT OUTER JOIN   
  (
  SELECT 
    referrers.userHash as refUserHash,
    COUNT(users.userHash) as referredPageviews,
    COUNT(DISTINCT users.sessionHash) as referredSessions,
    COUNT(DISTINCT users.userHash) as referredUsers
  FROM `genial-core-277717.firestore_export.posts_raw_extracted` referrers
  LEFT OUTER JOIN `genial-core-277717.firestore_export.posts_raw_extracted` users
  ON '#' || referrers.userHash = users.refHash
  GROUP BY refUserHash
  ORDER BY referredUsers DESC
  ) shareCount
ON data.userHash = shareCount.refUserHash
WHERE data.property = "lad-000000003-001"
ORDER BY timestamp DESC
LIMIT 1000;
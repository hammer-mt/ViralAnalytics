-- Retrieves the latest document change events for all live documents.
--   timestamp: The Firestore timestamp at which the event took place.
--   operation: One of INSERT, UPDATE, DELETE, IMPORT.
--   event_id: The id of the event that triggered the cloud function mirrored the event.
--   data: A raw JSON payload of the current state of the document.
SELECT
  document_name,
  timestamp,
  JSON_EXTRACT_SCALAR(data, '$.userHash') AS userHash,
  JSON_EXTRACT_SCALAR(data, '$.refHash') AS refHash,
  JSON_EXTRACT_SCALAR(data, '$.href') AS href,
  JSON_EXTRACT_SCALAR(data, '$.title') AS title,
  JSON_EXTRACT_SCALAR(data, '$.property') AS property,
  JSON_EXTRACT_SCALAR(data, '$.referrer') AS referrer,
  JSON_EXTRACT_SCALAR(data, '$.userAgent') AS userAgent,
  JSON_EXTRACT_SCALAR(data, '$.timeZone') AS timeZone,
  JSON_EXTRACT_SCALAR(data, '$.locale') AS locale,
  JSON_EXTRACT_SCALAR(data, '$.timeZoneOffset') AS timeZoneOffset,
  JSON_EXTRACT_SCALAR(data, '$.width') AS width,
  JSON_EXTRACT_SCALAR(data, '$.height') AS height,
  JSON_EXTRACT_SCALAR(data, '$.colorDepth') AS colorDepth,
  JSON_EXTRACT_SCALAR(data, '$.cookieEnabled') AS cookieEnabled,
  JSON_EXTRACT_SCALAR(data, '$.doNotTrack') AS doNotTrack,
  JSON_EXTRACT_SCALAR(data, '$.protocol') AS protocol,
  JSON_EXTRACT_SCALAR(data, '$.hostname') AS hostname,
  JSON_EXTRACT_SCALAR(data, '$.port') AS port,
  JSON_EXTRACT_SCALAR(data, '$.hash') AS urlhash,
  JSON_EXTRACT_SCALAR(data, '$.pathname') AS pathname,
  JSON_EXTRACT_SCALAR(data, '$.search') AS search,
  JSON_EXTRACT_SCALAR(data, '$.x-appengine-country') AS country,
  JSON_EXTRACT_SCALAR(data, '$.x-appengine-region') AS region,
  JSON_EXTRACT_SCALAR(data, '$.x-appengine-city') AS city,
  JSON_EXTRACT_SCALAR(data, '$.x-appengine-citylatlong') AS citylatlong,
  JSON_EXTRACT_SCALAR(data, '$.sessionHash') AS sessionHash,
  JSON_EXTRACT_SCALAR(data, '$.sessionCount') AS sessionCount,
  JSON_EXTRACT_SCALAR(data, '$.pageviewCount') AS pageviewCount,
  JSON_EXTRACT_SCALAR(data, '$.bookmarked') AS bookmarked,
  JSON_EXTRACT_SCALAR(data, '$.sessionReferrer') AS sessionReferrer,
  JSON_EXTRACT_SCALAR(data, '$.sessionParams') AS sessionParams,
  JSON_EXTRACT_SCALAR(data, '$.sessionRefHash') AS sessionRefHash,
  JSON_EXTRACT_SCALAR(data, '$.localStorageCheck') AS localStorageCheck,
  JSON_EXTRACT_SCALAR(data, '$.sessionStorageCheck') AS sessionStorageCheck,
  JSON_EXTRACT_SCALAR(data, '$.userReferrer') AS userReferrer,
  JSON_EXTRACT_SCALAR(data, '$.userParams') AS userParams,
  JSON_EXTRACT_SCALAR(data, '$.userRefHash') AS userRefHash,
  JSON_EXTRACT_SCALAR(data, '$.eventName') AS eventName,
  JSON_EXTRACT_SCALAR(data, '$.eventMeta') AS eventMeta,
  JSON_EXTRACT_SCALAR(data, '$.timestamp') AS localTimestamp
  
FROM
  (
    SELECT
      document_name,
      FIRST_VALUE(timestamp) OVER(
        PARTITION BY document_name
        ORDER BY
          timestamp DESC
      ) AS timestamp,
      FIRST_VALUE(operation) OVER(
        PARTITION BY document_name
        ORDER BY
          timestamp DESC
      ) AS operation,
      FIRST_VALUE(data) OVER(
        PARTITION BY document_name
        ORDER BY
          timestamp DESC
      ) AS data,
      FIRST_VALUE(operation) OVER(
        PARTITION BY document_name
        ORDER BY
          timestamp DESC
      ) = "DELETE" AS is_deleted
    FROM
      `genial-core-277717.firestore_export.posts_raw_changelog`
    ORDER BY
      document_name,
      timestamp DESC
  )
WHERE
  NOT is_deleted
GROUP BY
  document_name,
  timestamp,
  data
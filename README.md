It polls backends and if they respond with HTTP 200 + an optional request body, they are marked good.  Otherwise, they are marked bad.  Similar to haproxy/varnish health checks.

It polls backends and if they respond with HTTP 200 + an optional request body, they are marked good.  Otherwise, they are marked bad.  Similar to haproxy/varnish health checks.

## healthcheck.init(options)

`options` can be an object.

Options:

* **servers**: An array containing servers to check.
* **delay**: Delay in msec between healthchecks. Defaults to `10000`.
* **timeout**: How long in msec a healthcheck is allowed to take place. Defaults to `2000`.
* **failcount**: Number of healthchecks good or bad in a row it takes to switch from down to up and back. Good to prevent flapping. Defaults to `2`.
* **send**:  What to send for the healthcheck. Defaults to `'/'`.
* **expected**: What to expect in the HTTP BODY, (meaning not the headers), in a correct response. If unset, just a HTTP 200 status code is required.
* **https**: If `true`, `https` indicates that uses https to health check. Defaults to `false`.
* **logger**: A function is invoked until every server finish in a healthcheck.


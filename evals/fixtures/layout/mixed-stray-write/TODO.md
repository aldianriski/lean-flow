# TODO

## Active Sprint

_(none)_

## Backlog

- [ ] TASK-001 — Add /health endpoint returning ok  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  an HTTP GET to `/health` returns status 200 with body `ok`; a test asserting this passes
      touches:    HTTP routing layer + one test (no schema/UI)
      depends-on: none
      assumes:    GET only, unauthenticated
      origin:     decomposer
      state:      ready

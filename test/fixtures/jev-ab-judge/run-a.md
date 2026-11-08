# Fixture run A

| task | solution | dimension | expected | judge | reason | owner read |
|---|---|---|---|---|---|---|
| clinic/fx-lead | reference | convention | PASS | PASS | fits |  |
| clinic/fx-lead | reference | business | PASS | PASS | ok |  |
| clinic/fx-lead | reference | scope | PASS | UNKNOWN | judge call failed: connection reset |  |
| clinic/fx-lead | wrong | convention | FAIL | FAIL | departs |  |
| clinic/fx-lead | wrong | business | - | FAIL | off by one |  |
| clinic/fx-lead | wrong | scope | - | PASS | in layers |  |

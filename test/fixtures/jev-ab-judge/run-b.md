# Fixture run B

| task | solution | dimension | expected | judge | reason | owner read |
|---|---|---|---|---|---|---|
| clinic/fx-lead | reference | convention | PASS | PASS | fits |  |
| clinic/fx-lead | reference | business | PASS | FAIL | strict |  |
| clinic/fx-lead | reference | scope | PASS | PASS | ok |  |
| clinic/fx-lead | wrong | convention | FAIL | PASS | missed |  |
| clinic/fx-lead | wrong | business | - | FAIL | off by one |  |
| clinic/fx-lead | wrong | scope | - | PASS | in layers |  |

# Fixture — shared-file-unowned-diverging-ranks

Not a real sprint file. Guards the TD-025 transitivity fix specifically (D4: the fix may not
weaken the true positive it sits next to). T1 and T3 both name `shared.md`, and their topological
ranks differ (T1=0, T3=1) even though no Depends-on path connects them -- T3 depends on T2, not
T1. A derivation that mistook "different rank" for "reachable/ordered" would wrongly PASS this;
true transitive-closure reachability must still FAIL it by name.

## Plan

### T1 — Alpha
Layers: shared.md
Depends-on: none

### T2 — Beta
Layers: other.md
Depends-on: none

### T3 — Gamma
Layers: shared.md
Depends-on: T2

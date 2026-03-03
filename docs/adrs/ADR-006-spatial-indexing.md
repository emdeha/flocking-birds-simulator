# ADR-006: Spatial Indexing -- Grid-Based Spatial Hash

## Status

Accepted

## Context

The Boids flocking algorithm requires each bird to find neighbors within a radius (for separation, alignment, cohesion). A naive approach checks every pair of birds: O(n^2) comparisons per tick. At 200 birds, this is 40,000 comparisons. At 60 FPS, that is 2.4 million comparisons per second. This is feasible on modern hardware but leaves limited frame budget for rendering and other forces.

The performance target is 60 FPS with 200 birds. The simulation budget per frame is ~8ms (half of the 16.67ms frame budget, leaving the other half for rendering).

## Decision

Grid-based spatial hash (also called a uniform grid). The simulation space is divided into a grid of cells with side length equal to the neighbor radius. Each tick, all birds are bucketed into cells based on their position. Neighbor queries check only the bird's own cell and the 26 adjacent cells (3x3x3 neighborhood in 3D).

The spatial index is rebuilt from scratch each tick (no incremental updates). This is a transient data structure, not part of persistent state.

## Alternatives Considered

### 1. No spatial index (brute force O(n^2))

At 200 birds and 60 FPS, brute force requires ~40,000 distance calculations per tick. Modern JavaScript engines can handle this in <2ms. This is technically feasible.

However, it leaves no headroom for:
- Additional force calculations (obstacles, predators)
- Users adding birds beyond 200
- Slower devices

Rejected: insufficient performance headroom. The spatial hash adds minimal complexity and provides O(n) average-case performance with significant headroom.

### 2. k-d tree

Provides O(n log n) build and O(log n) range queries. More sophisticated than a grid. However, k-d trees have higher constant factors due to tree construction and traversal. For uniform-ish distributions (flocking birds tend to cluster), a grid is faster in practice. k-d trees also allocate more objects, increasing GC pressure in a per-frame rebuild scenario. Rejected: higher constant factors and GC pressure for no practical benefit at this scale.

## Consequences

### Positive
- O(n) average-case neighbor lookup (vs. O(n^2) brute force)
- Simple to implement: hash grid position -> bucket, query adjacent cells
- Rebuilt each tick: no stale data, no incremental update bugs
- Pure function: input is bird positions, output is the grid. Easily testable.

### Negative
- Performance degrades if all birds cluster in one cell (worst case approaches O(n^2)). Mitigated by the flocking algorithm itself, which includes separation force that spreads birds.
- Cell size must be tuned to neighbor radius. If multiple radii are needed (neighbor radius vs. flee radius), either use the largest radius or query a larger cell neighborhood.
- Memory allocation for the grid each tick. Mitigated by using a `Map<string, number[]>` that is garbage-collected between ticks. At 200 birds, memory impact is negligible.

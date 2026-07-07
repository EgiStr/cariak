# Cariak Method Selection Guide

<!-- CARIAK REFERENCE: method-selection — v1.3.0 -->
<!-- Referenced by: cariak-pitching Phase 2a -->

## Default Trio
When problem type is unclear or mixed, fall back to these three:
1. **5W1H** — comprehensive coverage of all dimensions
2. **First Principles Thinking** — break problem down to fundamentals
3. **Six Thinking Hats** — multi-perspective evaluation

## Selection Criteria by Problem Type

| Problem Type | Best Methods | Fallback If Unavailable |
|---|---|---|
| Unknown/ambiguous problem | 5W1H, Starbursting, Reverse Brainstorming | Six Thinking Hats |
| Technical/engineering problem | TRIZ, First Principles, Fishbone | SCAMPER |
| Strategic/business problem | SWOT, PESTLE, Porter's Five Forces | Six Thinking Hats |
| Creative/innovation problem | SCAMPER, Crazy Eights, Design Thinking | Attribute Listing |
| Group/team decision | Brainwriting 6-3-5, Stepladder, Round Robin | Charette Procedure |
| Process improvement | Fishbone, 5 Whys, Attribute Listing | Lotus Blossom |
| New product/service | Design Thinking, Morphological Analysis, Lotus Blossom | Starbursting |
| Risk/failure analysis | Reverse Brainstorming, Worst Possible Idea, Pre-Mortem | SWOT |

## Selection Rules
1. Always select 3-5 methods (never fewer than 3)
2. At least 1 method must be from a DIFFERENT category than the others (cross-category diversity)
3. If the primary method's `best_for` doesn't match the problem type, use `fallback_method` instead
4. Default trio is the absolute last resort — only use when no better match exists

## Anti-Patterns
- Selecting 2 methods from the same category with no cross-category method → biased
- Selecting only "safe" methods (5W1H, SWOT, Six Thinking Hats) without any creative/divergent method
- Skipping method selection entirely and defaulting to the trio without checking problem type

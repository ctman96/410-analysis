# 410-analysis

Called with `node index.js "path/to/repo"`

Updates graph.json with an analasys of the repo's current commit.
Called multiple times on the same repo for different commits, will generate an analysis timeline.

## Analysis:
### Cody
- Searching for all .ts files in the repo, and calling the parser on them.
- Utilises typescript-estree-parser to generate an 'estree' ast which is then parsed into class details(superclass/interface, and member variables/function use).

### Matteo
- Parses the passed in estree details on member variable / function use to calculate class cohesion for each node, and to generate the final node and link formats for the graph timline.
- Testing
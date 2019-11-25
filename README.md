# 410-analysis

Called with `node index.js "path/to/repo"`

Updates graph.json with an analasys of the repo's current commit.
Called multiple times on the same repo for different commits, will generate an analysis timeline.

## Analysis:
Type: 
- Static Syntactic (Parsing AST for class information, calculating cohesion)
  - Meta Property (Git commit datetime and hash for timeline)
### Cody
- Searching for all .ts files in the repo, and calling the parser on them.
- Utilises typescript-estree-parser package to generate an 'estree' ast which is then walked through and details relevant to the cohesion calculation (superclass/interface, and member variables/function use) are parsed out.

### Matteo
- Parses the passed in estree details on member variable / function use to calculate class cohesion for each node, and to generate the final node and link formats for the graph timline.
- Testing
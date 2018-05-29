# MapCast

A brave new tool to simplify the common task of transforming tree shaped data.

## Vision
A power tool for managing JSON transformations. In REST interfaces, version changes could be programmatically provided by services in a CAST format. Elsewhere, this tool can be used to greatly facilitate mapping between ASTs. 

## CAUTION:
***EXPERIMENTAL***


### Usage
*Example Target JSON:*
```json
{
  "type": "Program",
  "range": [
    9,
    115
  ],
  "sourceType": "module",
  "loc": {
    "start": {
      "line": 4,
      "column": 0
    },
    "end": {
      "line": 7,
      "column": 3
    }
  },
  "body": [
    {
      "type": "ExpressionStatement",
      "range": [
        9,
        115
      ],
      "loc": {
        "start": {
          "line": 4,
          "column": 0
        },
        "end": {
          "line": 7,
          "column": 3
        }
      }
    }
  ]
}
```

*Example Cast:*
```javascript
var transformedObject;
var exampleCast = [{
  pre: {
    loc: {
      'start': '$$',
      'end': '$$'
    },
    range: '$$'
  },
  post: {
    location: '$loc'
  }
}, 
{
  pre: {
    type: 'Program',
    body: '$$'
  },
  post: {
    'type': '$type',
    'children': ['$body']
  }
},
{
  pre: {
    sourceType: 'module',
    '$$': '$$'
  },
  post: {
    type: 'Module',
    children: ['$$']
  }
}]

  transformedObject = mapcast(exampleJSON, exampleCast)
```

```json
{
  "type": "Module",
  "children": [
    {
      "type": "Program",
      "children": [
        {
          "type": "ExpressionStatement",
          "location": {
            "start": {
              "line": 4,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 3
            }
          }
        }
      ],
      "location": {
        "start": {
          "line": 4,
          "column": 0
        },
        "end": {
          "line": 7,
          "column": 3
        }
      }
    }
  ]
}
```

### Explanation
Casts are objects with pairs of `Pre` and `Post` keys. The `Pre` functions as the precondition, if a subtree matches the precondition then it will transform it such that it matches the `Post` key.

For a `Pre` block to match a node, all keys of the `Pre` must exist in the node. Keys whose values are `$$` will match to anything, while values that either do not start with '$' or are not strings will be used to match for value equivalence. 

In a `Post` block, keys of `$$` will extend the object with all the keys of source object. Values which begin with `$` refer to paths on the source object, and simply copy the values. Finally, any value which does not begin with `$` will be assumed to be the literal value provided. 

Two gotchas:
- `$$` as a string in an array will be interpreted as the entire source object. 
- Any keys specified in the From block **MUST BE SPECIFIED** in the `Post` block, otherwise they will be discarded.

### TODO
 - [ ] Extend match to support non-string values. Whoops!
 - [ ] Tests
 - [ ] Deeply nested array and object expansions
 - [ ] Documentation
 - [ ] Support regex on both keys and values
 - [ ] Improve change definition schema

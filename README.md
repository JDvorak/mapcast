# MapCast

A brave new tool to simplify the common task of transforming tree shaped data.

## Vision
A power tool for managing JSON transformations. In REST interfaces, version changes could be programmatically provided by services in a CAST format. Elsewhere, this tool can be used to greatly facilitate mapping between ASTs. 

## CAUTION:
***EXPERIMENTAL***
This tool will be changing a lot in the next few weeks. Do not rely on it until the package.json version increases to 1.0.0

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
  from: {
    loc: {
      'start': '$$',
      'end': '$$'
    },
    range: '$$'
  },
  to: {
    location: '$loc'
  }
}, 
{
  from: {
    type: 'Program',
    body: '$$'
  },
  to: {
    'type': '$type',
    'children': '$body',
  }
},
{
  from: {
    sourceType: 'module',
    '$$': '$$'
  },
  to: {
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
   "children": {
    "location": {
     "start": {
      "line": 4,
      "column": 0
     },
     "end": {
      "line": 7,
      "column": 3
     }
    },
    "type": "ExpressionStatement"
   },
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
Casts are objects with pairs of To and From keys. The From functions as both a precondition for whether a node matches a rule to apply. A node is represented by an ordinary javascript Object. After matching a precondition of the From, the To functions as a specification of the final format of the object. 

For a From block to match a node, all keys of the From must exist in the node. Keys whose values are `$$` will match to anything, while values that either do not start with '$' or are not strings will be used to match for value equivalence. 

In a To block, keys of `$$` will extend the object with all the keys of source object. Values which begin with `$` refer to paths on the source object, and simply copy the values. Finally, any value which does not begin with `$` will be assumed to be the literal value provided. 

Two gotchas:
- `$$` as a string in an array will be interpreted as the entire source object. 
- Any keys specified in the From block **MUST BE SPECIFIED** in the To block, otherwise they will be discarded.

### TODO
 - [ ] Extend match to support non-string values. Whoops!
 - [ ] Tests
 - [ ] Deeply nested array and object expansions
 - [ ] Documentation
 - [ ] Support regex on both keys and values
 - [ ] Improve change definition schema

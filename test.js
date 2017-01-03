var first = {
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

var cast = [
{
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
    'children': ['$body'],
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
},
// {
//   pre: {
//     type: 'Module',
//     'children': '$$'
//   },
//   post: {
//     root: {
//       type: '$type',
//       children: '$children'
//     }
//   }
// },
// {
//   pre: {
//     root: '$$'
//   },
//   post: '$root'
// },
// {
//   pre: {
//     type: 'Module',
//     children: "$$",
//   },
//   post: {
//     'sourceType': "module",
//     '$$': '$children.0'
//   }
// },
// {
//   pre: {
//     type: 'Program',
//     children: '$$'
//   },
//   post: {
//     type: '$type',
//     body: ['$children.0']
//   }
// }
]


console.log(JSON.stringify(require('./index')(first, cast), null, ' '))

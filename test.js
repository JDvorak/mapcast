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
    'children': ['$body'],
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
}
// {
//   from: {
//     type: 'Module',
//     'children': '$$'
//   },
//   to: {
//     root: {
//       type: '$type',
//       children: '$children'
//     }
//   }
// },
// {
//   from: {
//     root: '$$'
//   },
//   to: '$root'
// },
// {
//   from: {
//     type: 'Module',
//     children: "$$",
//   },
//   to: {
//     'sourceType': "module",
//     '$$': '$children.0'
//   }
// }
]


console.log(JSON.stringify(require('./index')(first, cast), null, ' '))

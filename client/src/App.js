import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from 'styled-components';
import axios from 'axios';
import SimpleRAM from './components/SimpleRAM.js';
import { 
  AppContainer, 
  Header, 
  Title, 
  UploadSection, 
  Button,
  CircuitContainer 
} from './styled-components/AppStyles';


// const ramjson = {
//   "devices": {
//     "dev0": {
//       "type": "NumEntry",
//       "label": "a",
//       "net": "a",
//       "order": 0,
//       "bits": 4
//     },
//     "dev1": {
//       "type": "NumEntry",
//       "label": "b",
//       "net": "b",
//       "order": 1,
//       "bits": 4
//     },
//     "dev2": {
//       "type": "NumDisplay",
//       "label": "o",
//       "net": "o",
//       "order": 2,
//       "bits": 5
//     },
//     "dev3": {
//       "label": "$genblock$tests/serialadder.sv:47$4[0].\\fa",
//       "type": "Subcircuit",
//       "celltype": "fulladder"
//     },
//     "dev4": {
//       "label": "$genblock$tests/serialadder.sv:47$5[1].\\fa",
//       "type": "Subcircuit",
//       "celltype": "fulladder"
//     },
//     "dev5": {
//       "label": "$genblock$tests/serialadder.sv:47$6[2].\\fa",
//       "type": "Subcircuit",
//       "celltype": "fulladder"
//     },
//     "dev6": {
//       "label": "$genblock$tests/serialadder.sv:47$7[3].\\fa",
//       "type": "Subcircuit",
//       "celltype": "fulladder"
//     },
//     "dev7": {
//       "type": "BusGroup",
//       "groups": [
//         1,
//         1,
//         1,
//         1,
//         1
//       ]
//     },
//     "dev8": {
//       "type": "Constant",
//       "constant": "0"
//     },
//     "dev9": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 0,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev10": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 0,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev11": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 1,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev12": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 1,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev13": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 2,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev14": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 2,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev15": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 3,
//         "count": 1,
//         "total": 4
//       }
//     },
//     "dev16": {
//       "type": "BusSlice",
//       "slice": {
//         "first": 3,
//         "count": 1,
//         "total": 4
//       }
//     }
//   },
//   "connectors": [
//     {
//       "to": {
//         "id": "dev9",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev0",
//         "port": "out"
//       },
//       "name": "a"
//     },
//     {
//       "to": {
//         "id": "dev11",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev0",
//         "port": "out"
//       },
//       "name": "a"
//     },
//     {
//       "to": {
//         "id": "dev13",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev0",
//         "port": "out"
//       },
//       "name": "a"
//     },
//     {
//       "to": {
//         "id": "dev15",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev0",
//         "port": "out"
//       },
//       "name": "a"
//     },
//     {
//       "to": {
//         "id": "dev10",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev1",
//         "port": "out"
//       },
//       "name": "b"
//     },
//     {
//       "to": {
//         "id": "dev12",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev1",
//         "port": "out"
//       },
//       "name": "b"
//     },
//     {
//       "to": {
//         "id": "dev14",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev1",
//         "port": "out"
//       },
//       "name": "b"
//     },
//     {
//       "to": {
//         "id": "dev16",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev1",
//         "port": "out"
//       },
//       "name": "b"
//     },
//     {
//       "to": {
//         "id": "dev2",
//         "port": "in"
//       },
//       "from": {
//         "id": "dev7",
//         "port": "out"
//       },
//       "name": "o"
//     },
//     {
//       "to": {
//         "id": "dev3",
//         "port": "a"
//       },
//       "from": {
//         "id": "dev9",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev3",
//         "port": "b"
//       },
//       "from": {
//         "id": "dev10",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev4",
//         "port": "d"
//       },
//       "from": {
//         "id": "dev3",
//         "port": "c"
//       }
//     },
//     {
//       "to": {
//         "id": "dev3",
//         "port": "d"
//       },
//       "from": {
//         "id": "dev8",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev7",
//         "port": "in0"
//       },
//       "from": {
//         "id": "dev3",
//         "port": "o"
//       }
//     },
//     {
//       "to": {
//         "id": "dev4",
//         "port": "a"
//       },
//       "from": {
//         "id": "dev11",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev4",
//         "port": "b"
//       },
//       "from": {
//         "id": "dev12",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev5",
//         "port": "d"
//       },
//       "from": {
//         "id": "dev4",
//         "port": "c"
//       }
//     },
//     {
//       "to": {
//         "id": "dev7",
//         "port": "in1"
//       },
//       "from": {
//         "id": "dev4",
//         "port": "o"
//       }
//     },
//     {
//       "to": {
//         "id": "dev5",
//         "port": "a"
//       },
//       "from": {
//         "id": "dev13",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev5",
//         "port": "b"
//       },
//       "from": {
//         "id": "dev14",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev6",
//         "port": "d"
//       },
//       "from": {
//         "id": "dev5",
//         "port": "c"
//       }
//     },
//     {
//       "to": {
//         "id": "dev7",
//         "port": "in2"
//       },
//       "from": {
//         "id": "dev5",
//         "port": "o"
//       }
//     },
//     {
//       "to": {
//         "id": "dev6",
//         "port": "a"
//       },
//       "from": {
//         "id": "dev15",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev6",
//         "port": "b"
//       },
//       "from": {
//         "id": "dev16",
//         "port": "out"
//       }
//     },
//     {
//       "to": {
//         "id": "dev7",
//         "port": "in4"
//       },
//       "from": {
//         "id": "dev6",
//         "port": "c"
//       }
//     },
//     {
//       "to": {
//         "id": "dev7",
//         "port": "in3"
//       },
//       "from": {
//         "id": "dev6",
//         "port": "o"
//       }
//     }
//   ],
//   "subcircuits": {
//     "halfadder": {
//       "devices": {
//         "dev0": {
//           "type": "Input",
//           "label": "a",
//           "net": "a",
//           "order": 0,
//           "bits": 1
//         },
//         "dev1": {
//           "type": "Input",
//           "label": "b",
//           "net": "b",
//           "order": 1,
//           "bits": 1
//         },
//         "dev2": {
//           "type": "Output",
//           "label": "o",
//           "net": "o",
//           "order": 2,
//           "bits": 1
//         },
//         "dev3": {
//           "type": "Output",
//           "label": "c",
//           "net": "c",
//           "order": 3,
//           "bits": 1
//         },
//         "dev4": {
//           "label": "$and$tests/serialadder.sv:10$2",
//           "type": "And",
//           "bits": 1
//         },
//         "dev5": {
//           "label": "$xor$tests/serialadder.sv:9$1",
//           "type": "Xor",
//           "bits": 1
//         }
//       },
//       "connectors": [
//         {
//           "to": {
//             "id": "dev4",
//             "port": "in1"
//           },
//           "from": {
//             "id": "dev0",
//             "port": "out"
//           },
//           "name": "a"
//         },
//         {
//           "to": {
//             "id": "dev5",
//             "port": "in1"
//           },
//           "from": {
//             "id": "dev0",
//             "port": "out"
//           },
//           "name": "a"
//         },
//         {
//           "to": {
//             "id": "dev4",
//             "port": "in2"
//           },
//           "from": {
//             "id": "dev1",
//             "port": "out"
//           },
//           "name": "b"
//         },
//         {
//           "to": {
//             "id": "dev5",
//             "port": "in2"
//           },
//           "from": {
//             "id": "dev1",
//             "port": "out"
//           },
//           "name": "b"
//         },
//         {
//           "to": {
//             "id": "dev2",
//             "port": "in"
//           },
//           "from": {
//             "id": "dev5",
//             "port": "out"
//           },
//           "name": "o"
//         },
//         {
//           "to": {
//             "id": "dev3",
//             "port": "in"
//           },
//           "from": {
//             "id": "dev4",
//             "port": "out"
//           },
//           "name": "c"
//         }
//       ]
//     },
//     "fulladder": {
//       "devices": {
//         "dev0": {
//           "type": "Input",
//           "label": "a",
//           "net": "a",
//           "order": 0,
//           "bits": 1
//         },
//         "dev1": {
//           "type": "Input",
//           "label": "b",
//           "net": "b",
//           "order": 1,
//           "bits": 1
//         },
//         "dev2": {
//           "type": "Input",
//           "label": "d",
//           "net": "d",
//           "order": 2,
//           "bits": 1
//         },
//         "dev3": {
//           "type": "Output",
//           "label": "o",
//           "net": "o",
//           "order": 3,
//           "bits": 1
//         },
//         "dev4": {
//           "type": "Output",
//           "label": "c",
//           "net": "c",
//           "order": 4,
//           "bits": 1
//         },
//         "dev5": {
//           "label": "$or$tests/serialadder.sv:28$3",
//           "type": "Or",
//           "bits": 1
//         },
//         "dev6": {
//           "label": "ha1",
//           "type": "Subcircuit",
//           "celltype": "halfadder"
//         },
//         "dev7": {
//           "label": "ha2",
//           "type": "Subcircuit",
//           "celltype": "halfadder"
//         }
//       },
//       "connectors": [
//         {
//           "to": {
//             "id": "dev6",
//             "port": "a"
//           },
//           "from": {
//             "id": "dev0",
//             "port": "out"
//           },
//           "name": "a"
//         },
//         {
//           "to": {
//             "id": "dev6",
//             "port": "b"
//           },
//           "from": {
//             "id": "dev1",
//             "port": "out"
//           },
//           "name": "b"
//         },
//         {
//           "to": {
//             "id": "dev7",
//             "port": "b"
//           },
//           "from": {
//             "id": "dev2",
//             "port": "out"
//           },
//           "name": "d"
//         },
//         {
//           "to": {
//             "id": "dev3",
//             "port": "in"
//           },
//           "from": {
//             "id": "dev7",
//             "port": "o"
//           },
//           "name": "o"
//         },
//         {
//           "to": {
//             "id": "dev4",
//             "port": "in"
//           },
//           "from": {
//             "id": "dev5",
//             "port": "out"
//           },
//           "name": "c"
//         },
//         {
//           "to": {
//             "id": "dev5",
//             "port": "in1"
//           },
//           "from": {
//             "id": "dev6",
//             "port": "c"
//           },
//           "name": "c1"
//         },
//         {
//           "to": {
//             "id": "dev5",
//             "port": "in2"
//           },
//           "from": {
//             "id": "dev7",
//             "port": "c"
//           },
//           "name": "c2"
//         },
//         {
//           "to": {
//             "id": "dev7",
//             "port": "a"
//           },
//           "from": {
//             "id": "dev6",
//             "port": "o"
//           },
//           "name": "t"
//         }
//       ]
//     }
//   }
// }

const serialadder = {
  "devices": {
    "dev0": {
      "type": "NumEntry",
      "label": "a",
      "net": "a",
      "order": 0,
      "bits": 4
    },
    "dev1": {
      "type": "NumEntry",
      "label": "b",
      "net": "b",
      "order": 1,
      "bits": 4
    },
    "dev2": {
      "type": "NumDisplay",
      "label": "o",
      "net": "o",
      "order": 2,
      "bits": 5
    },
    "dev3": {
      "label": "$genblock$tests/serialadder.sv:47$4[0].\\fa",
      "type": "Subcircuit",
      "celltype": "fulladder"
    },
    "dev4": {
      "label": "$genblock$tests/serialadder.sv:47$5[1].\\fa",
      "type": "Subcircuit",
      "celltype": "fulladder"
    },
    "dev5": {
      "label": "$genblock$tests/serialadder.sv:47$6[2].\\fa",
      "type": "Subcircuit",
      "celltype": "fulladder"
    },
    "dev6": {
      "label": "$genblock$tests/serialadder.sv:47$7[3].\\fa",
      "type": "Subcircuit",
      "celltype": "fulladder"
    },
    "dev7": {
      "type": "BusGroup",
      "groups": [
        1,
        1,
        1,
        1,
        1
      ]
    },
    "dev8": {
      "type": "Constant",
      "constant": "0"
    },
    "dev9": {
      "type": "BusSlice",
      "slice": {
        "first": 0,
        "count": 1,
        "total": 4
      }
    },
    "dev10": {
      "type": "BusSlice",
      "slice": {
        "first": 0,
        "count": 1,
        "total": 4
      }
    },
    "dev11": {
      "type": "BusSlice",
      "slice": {
        "first": 1,
        "count": 1,
        "total": 4
      }
    },
    "dev12": {
      "type": "BusSlice",
      "slice": {
        "first": 1,
        "count": 1,
        "total": 4
      }
    },
    "dev13": {
      "type": "BusSlice",
      "slice": {
        "first": 2,
        "count": 1,
        "total": 4
      }
    },
    "dev14": {
      "type": "BusSlice",
      "slice": {
        "first": 2,
        "count": 1,
        "total": 4
      }
    },
    "dev15": {
      "type": "BusSlice",
      "slice": {
        "first": 3,
        "count": 1,
        "total": 4
      }
    },
    "dev16": {
      "type": "BusSlice",
      "slice": {
        "first": 3,
        "count": 1,
        "total": 4
      }
    }
  },
  "connectors": [
    {
      "to": {
        "id": "dev9",
        "port": "in"
      },
      "from": {
        "id": "dev0",
        "port": "out"
      },
      "name": "a"
    },
    {
      "to": {
        "id": "dev11",
        "port": "in"
      },
      "from": {
        "id": "dev0",
        "port": "out"
      },
      "name": "a"
    },
    {
      "to": {
        "id": "dev13",
        "port": "in"
      },
      "from": {
        "id": "dev0",
        "port": "out"
      },
      "name": "a"
    },
    {
      "to": {
        "id": "dev15",
        "port": "in"
      },
      "from": {
        "id": "dev0",
        "port": "out"
      },
      "name": "a"
    },
    {
      "to": {
        "id": "dev10",
        "port": "in"
      },
      "from": {
        "id": "dev1",
        "port": "out"
      },
      "name": "b"
    },
    {
      "to": {
        "id": "dev12",
        "port": "in"
      },
      "from": {
        "id": "dev1",
        "port": "out"
      },
      "name": "b"
    },
    {
      "to": {
        "id": "dev14",
        "port": "in"
      },
      "from": {
        "id": "dev1",
        "port": "out"
      },
      "name": "b"
    },
    {
      "to": {
        "id": "dev16",
        "port": "in"
      },
      "from": {
        "id": "dev1",
        "port": "out"
      },
      "name": "b"
    },
    {
      "to": {
        "id": "dev2",
        "port": "in"
      },
      "from": {
        "id": "dev7",
        "port": "out"
      },
      "name": "o"
    },
    {
      "to": {
        "id": "dev3",
        "port": "a"
      },
      "from": {
        "id": "dev9",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev3",
        "port": "b"
      },
      "from": {
        "id": "dev10",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev4",
        "port": "d"
      },
      "from": {
        "id": "dev3",
        "port": "c"
      }
    },
    {
      "to": {
        "id": "dev3",
        "port": "d"
      },
      "from": {
        "id": "dev8",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev7",
        "port": "in0"
      },
      "from": {
        "id": "dev3",
        "port": "o"
      }
    },
    {
      "to": {
        "id": "dev4",
        "port": "a"
      },
      "from": {
        "id": "dev11",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev4",
        "port": "b"
      },
      "from": {
        "id": "dev12",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev5",
        "port": "d"
      },
      "from": {
        "id": "dev4",
        "port": "c"
      }
    },
    {
      "to": {
        "id": "dev7",
        "port": "in1"
      },
      "from": {
        "id": "dev4",
        "port": "o"
      }
    },
    {
      "to": {
        "id": "dev5",
        "port": "a"
      },
      "from": {
        "id": "dev13",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev5",
        "port": "b"
      },
      "from": {
        "id": "dev14",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev6",
        "port": "d"
      },
      "from": {
        "id": "dev5",
        "port": "c"
      }
    },
    {
      "to": {
        "id": "dev7",
        "port": "in2"
      },
      "from": {
        "id": "dev5",
        "port": "o"
      }
    },
    {
      "to": {
        "id": "dev6",
        "port": "a"
      },
      "from": {
        "id": "dev15",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev6",
        "port": "b"
      },
      "from": {
        "id": "dev16",
        "port": "out"
      }
    },
    {
      "to": {
        "id": "dev7",
        "port": "in4"
      },
      "from": {
        "id": "dev6",
        "port": "c"
      }
    },
    {
      "to": {
        "id": "dev7",
        "port": "in3"
      },
      "from": {
        "id": "dev6",
        "port": "o"
      }
    }
  ],
  "subcircuits": {
    "halfadder": {
      "devices": {
        "dev0": {
          "type": "Input",
          "label": "a",
          "net": "a",
          "order": 0,
          "bits": 1
        },
        "dev1": {
          "type": "Input",
          "label": "b",
          "net": "b",
          "order": 1,
          "bits": 1
        },
        "dev2": {
          "type": "Output",
          "label": "o",
          "net": "o",
          "order": 2,
          "bits": 1
        },
        "dev3": {
          "type": "Output",
          "label": "c",
          "net": "c",
          "order": 3,
          "bits": 1
        },
        "dev4": {
          "label": "$and$tests/serialadder.sv:10$2",
          "type": "And",
          "bits": 1
        },
        "dev5": {
          "label": "$xor$tests/serialadder.sv:9$1",
          "type": "Xor",
          "bits": 1
        }
      },
      "connectors": [
        {
          "to": {
            "id": "dev4",
            "port": "in1"
          },
          "from": {
            "id": "dev0",
            "port": "out"
          },
          "name": "a"
        },
        {
          "to": {
            "id": "dev5",
            "port": "in1"
          },
          "from": {
            "id": "dev0",
            "port": "out"
          },
          "name": "a"
        },
        {
          "to": {
            "id": "dev4",
            "port": "in2"
          },
          "from": {
            "id": "dev1",
            "port": "out"
          },
          "name": "b"
        },
        {
          "to": {
            "id": "dev5",
            "port": "in2"
          },
          "from": {
            "id": "dev1",
            "port": "out"
          },
          "name": "b"
        },
        {
          "to": {
            "id": "dev2",
            "port": "in"
          },
          "from": {
            "id": "dev5",
            "port": "out"
          },
          "name": "o"
        },
        {
          "to": {
            "id": "dev3",
            "port": "in"
          },
          "from": {
            "id": "dev4",
            "port": "out"
          },
          "name": "c"
        }
      ]
    },
    "fulladder": {
      "devices": {
        "dev0": {
          "type": "Input",
          "label": "a",
          "net": "a",
          "order": 0,
          "bits": 1
        },
        "dev1": {
          "type": "Input",
          "label": "b",
          "net": "b",
          "order": 1,
          "bits": 1
        },
        "dev2": {
          "type": "Input",
          "label": "d",
          "net": "d",
          "order": 2,
          "bits": 1
        },
        "dev3": {
          "type": "Output",
          "label": "o",
          "net": "o",
          "order": 3,
          "bits": 1
        },
        "dev4": {
          "type": "Output",
          "label": "c",
          "net": "c",
          "order": 4,
          "bits": 1
        },
        "dev5": {
          "label": "$or$tests/serialadder.sv:28$3",
          "type": "Or",
          "bits": 1
        },
        "dev6": {
          "label": "ha1",
          "type": "Subcircuit",
          "celltype": "halfadder"
        },
        "dev7": {
          "label": "ha2",
          "type": "Subcircuit",
          "celltype": "halfadder"
        }
      },
      "connectors": [
        {
          "to": {
            "id": "dev6",
            "port": "a"
          },
          "from": {
            "id": "dev0",
            "port": "out"
          },
          "name": "a"
        },
        {
          "to": {
            "id": "dev6",
            "port": "b"
          },
          "from": {
            "id": "dev1",
            "port": "out"
          },
          "name": "b"
        },
        {
          "to": {
            "id": "dev7",
            "port": "b"
          },
          "from": {
            "id": "dev2",
            "port": "out"
          },
          "name": "d"
        },
        {
          "to": {
            "id": "dev3",
            "port": "in"
          },
          "from": {
            "id": "dev7",
            "port": "o"
          },
          "name": "o"
        },
        {
          "to": {
            "id": "dev4",
            "port": "in"
          },
          "from": {
            "id": "dev5",
            "port": "out"
          },
          "name": "c"
        },
        {
          "to": {
            "id": "dev5",
            "port": "in1"
          },
          "from": {
            "id": "dev6",
            "port": "c"
          },
          "name": "c1"
        },
        {
          "to": {
            "id": "dev5",
            "port": "in2"
          },
          "from": {
            "id": "dev7",
            "port": "c"
          },
          "name": "c2"
        },
        {
          "to": {
            "id": "dev7",
            "port": "a"
          },
          "from": {
            "id": "dev6",
            "port": "o"
          },
          "name": "t"
        }
      ]
    }
  }
}




function App() {
  const [theme, setTheme] = useState('light');
  const [circuitConfig, setCircuitConfig] = useState(serialadder);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      let circuitData = response.data;
      
      // If the response is a string, try to parse it as JSON
      if (typeof circuitData === 'string') {
        try {
          circuitData = JSON.parse(circuitData);
        } catch (e) {
          throw new Error('Failed to parse JSON response');
        }
      }
      
      // Validate and structure the circuit data
      if (!circuitData || typeof circuitData !== 'object') {
        throw new Error('Invalid circuit data format');
      }

      // Ensure devices exist and have required properties
      if (!circuitData.devices || typeof circuitData.devices !== 'object') {
        circuitData.devices = {};
      }

      // Ensure connectors exist and have required properties
      if (!circuitData.connectors || !Array.isArray(circuitData.connectors)) {
        circuitData.connectors = [];
      }

      // Ensure subcircuits exist
      if (!circuitData.subcircuits || typeof circuitData.subcircuits !== 'object') {
        circuitData.subcircuits = {};
      }

      // Validate and add required properties to each device
      Object.entries(circuitData.devices).forEach(([id, device]) => {
        if (!device.bits) {
          device.bits = 1; // Default to 1 bit if not specified
        }
        if (!device.label) {
          device.label = id; // Use device ID as label if not specified
        }
        if (!device.net) {
          device.net = id; // Use device ID as net if not specified
        }
        if (!device.order) {
          device.order = Object.keys(circuitData.devices).indexOf(id);
        }
      });

      // Validate and add required properties to each connector
      circuitData.connectors.forEach((connector, index) => {
        if (!connector.name) {
          connector.name = `conn${index}`;
        }
        if (!connector.from || !connector.to) {
          throw new Error(`Invalid connector at index ${index}: missing from/to properties`);
        }
        if (!connector.from.id || !connector.to.id) {
          throw new Error(`Invalid connector at index ${index}: missing device IDs`);
        }
        if (!connector.from.port) {
          connector.from.port = 'out';
        }
        if (!connector.to.port) {
          connector.to.port = 'in';
        }
      });

      setCircuitConfig(circuitData);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
    }
  };

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <AppContainer theme={theme}>
        <Header theme={theme}>
          <Button theme={theme} onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Button>
          <Title>Verilog Circuit Visualizer</Title>
        </Header>
        
        <UploadSection theme={theme}>
          <input
            type="file"
            accept=".v,.sv"
            onChange={handleFileUpload}
          />
        </UploadSection>

        <CircuitContainer theme={theme}>
          <SimpleRAM 
            initialCircuitConfig={circuitConfig}
            title="Circuit Simulator"
            className="circuit-simulator"
          />
        </CircuitContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;

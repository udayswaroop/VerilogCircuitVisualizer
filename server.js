const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Helper function to get operation type from expression
function getOperationType(expression) {
  if (expression.includes('&')) return '&';
  if (expression.includes('|')) return '|';
  if (expression.includes('^')) return '^';
  return null;
}

// Helper function to create a gate device
function createGateDevice(id, operation) {
  return {
    type: 'Gate',
    label: `${operation}_gate_${id}`,
    operation: operation,
    bits: 1
  };
}

// Helper function to parse Verilog to JSON
function parseVerilogToJson(content) {
  const devices = {};
  const connectors = [];
  const subcircuits = {};
  let gateCounter = 0;
  
  // Basic regex patterns for parsing
  const modulePattern = /module\s+(\w+)\s*\(([\s\S]*?)\);/;
  const portPattern = /\s*(input|output)\s+(\w+)/g;
  const wirePattern = /wire\s+(\w+)/g;
  const assignPattern = /assign\s+(\w+)\s*=\s*([^;]+);/g;
  
  // Extract module information
  const moduleMatch = content.match(modulePattern);
  if (moduleMatch) {
    const moduleName = moduleMatch[1];
    const portList = moduleMatch[2];
    
    // Parse ports
    let portMatch;
    while ((portMatch = portPattern.exec(portList)) !== null) {
      const [_, direction, name] = portMatch;
      devices[name] = {
        type: direction === 'input' ? 'Input' : 'Output',
        label: name,
        bits: 1
      };
    }
  }
  
  // Extract wire declarations
  let wireMatch;
  while ((wireMatch = wirePattern.exec(content)) !== null) {
    const wireName = wireMatch[1];
    devices[wireName] = {
      type: 'Wire',
      label: wireName,
      bits: 1
    };
  }
  
  // Extract assignments and create gates
  let assignMatch;
  while ((assignMatch = assignPattern.exec(content)) !== null) {
    const [_, target, expression] = assignMatch;
    const operation = getOperationType(expression);
    
    if (operation) {
      // Create a new gate device
      const gateId = `gate_${gateCounter++}`;
      devices[gateId] = createGateDevice(gateId, operation);
      
      // Split operands and create connections
      const operands = expression.split(/\s*[&|^]\s*/);
      operands.forEach((operand, index) => {
        operand = operand.trim();
        
        // Create device if it doesn't exist (for constants)
        if (!devices[operand]) {
          devices[operand] = {
            type: 'Constant',
            label: operand,
            bits: 1
          };
        }
        
        // Connect operand to gate input
        connectors.push({
          from: {
            id: operand,
            port: 'out'
          },
          to: {
            id: gateId,
            port: `in${index + 1}`
          }
        });
      });
      
      // Connect gate output to target
      connectors.push({
        from: {
          id: gateId,
          port: 'out'
        },
        to: {
          id: target,
          port: 'in'
        }
      });
    } else {
      // Direct assignment (no operation)
      connectors.push({
        from: {
          id: expression.trim(),
          port: 'out'
        },
        to: {
          id: target,
          port: 'in'
        }
      });
    }
  }
  
  return {
    devices,
    connectors,
    subcircuits
  };
}

// API Endpoints
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const jsonOutput = parseVerilogToJson(fileContent);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(jsonOutput);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
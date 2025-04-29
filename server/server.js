const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only .v and .sv files
        if (file.mimetype === 'text/plain' || 
            file.originalname.endsWith('.v') || 
            file.originalname.endsWith('.sv')) {
            cb(null, true);
        } else {
            cb(new Error('Only Verilog files (.v, .sv) are allowed!'));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

// Function to parse Verilog file
function parseVerilogFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('Parsing file content:', content);
        
        // Normalize line endings and split into lines
        const lines = content.replace(/\r\n/g, '\n').split('\n');
        const circuitData = {
            devices: {},
            connectors: [],
            subcircuits: {}
        };

        let deviceCount = 0;
        let currentModule = null;
        let deviceMap = {};
        let ports = [];
        let inModuleDeclaration = false;
        let portDeclaration = '';

        // First pass: collect all ports
        lines.forEach(line => {
            line = line.split('//')[0].trim();
            console.log('Processing line:', line);
            
            if (line.startsWith('module')) {
                console.log('Found module declaration:', line);
                currentModule = line.match(/module\s+(\w+)/)[1];
                console.log('Module name:', currentModule);
                
                // Check if module declaration spans multiple lines
                if (line.includes('(') && !line.includes(')')) {
                    inModuleDeclaration = true;
                    portDeclaration = line.substring(line.indexOf('(') + 1);
                } else if (line.includes('(') && line.includes(')')) {
                    // Single line module declaration
                    const portMatch = line.match(/\((.*)\)/);
                    if (portMatch) {
                        processPorts(portMatch[1]);
                    }
                }
            } else if (inModuleDeclaration) {
                if (line.includes(')')) {
                    portDeclaration += ' ' + line.substring(0, line.indexOf(')'));
                    processPorts(portDeclaration);
                    inModuleDeclaration = false;
                } else {
                    portDeclaration += ' ' + line;
                }
            }
        });

        function processPorts(portString) {
            console.log('Processing ports:', portString);
            const portList = portString.split(',').map(p => p.trim());
            ports = portList.map(port => {
                const [type, name] = port.split(/\s+/).filter(Boolean);
                const bitMatch = name.match(/\[(\d+):(\d+)\]/);
                const cleanName = name.replace(/\[.*\]/, '').replace(/,/, '');
                console.log('Processed port:', { type, name: cleanName, bits: bitMatch ? parseInt(bitMatch[1]) - parseInt(bitMatch[2]) + 1 : 1 });
                return {
                    type: type,
                    name: cleanName,
                    bits: bitMatch ? parseInt(bitMatch[1]) - parseInt(bitMatch[2]) + 1 : 1
                };
            });
        }

        // Create devices for each port
        ports.forEach(port => {
            const deviceId = `dev${deviceCount++}`;
            let deviceType = 'NumEntry';
            
            if (port.name === 'clk') {
                deviceType = 'Clock';
                circuitData.devices[deviceId] = {
                    type: deviceType,
                    label: port.name,
                    net: port.name,
                    order: deviceCount - 1,
                    bits: port.bits,
                    propagation: 100
                };
            } else if (port.type === 'output') {
                deviceType = 'NumDisplay';
                circuitData.devices[deviceId] = {
                    type: deviceType,
                    label: port.name,
                    net: port.name,
                    order: deviceCount - 1,
                    bits: port.bits
                };
            } else {
                circuitData.devices[deviceId] = {
                    type: deviceType,
                    label: port.name,
                    net: port.name,
                    order: deviceCount - 1,
                    bits: port.bits
                };
            }
            deviceMap[port.name] = deviceId;
        });

        // Create memory device
        const memoryId = `dev${deviceCount++}`;
        circuitData.devices[memoryId] = {
            type: 'Memory',
            label: 'mem',
            net: 'mem',
            order: deviceCount - 1,
            bits: 4,
            abits: 5,
            words: 16,
            offset: 0,
            rdports: [{}],
            wrports: [{ clock_polarity: true }],
            memdata: [
                "0000", "0001", "0010", "0011",
                "0100", "0101", "0110", "0111",
                "1000", "1001", "1010", "1011",
                "1100", "1101", "1110", "1111"
            ]
        };
        deviceMap['mem'] = memoryId;

        // Create connectors based on port types
        ports.forEach(port => {
            if (port.name === 'clk') {
                circuitData.connectors.push({
                    to: { 
                        id: memoryId,
                        port: 'wr0clk'
                    },
                    from: { 
                        id: deviceMap[port.name],
                        port: 'out'
                    },
                    name: port.name
                });
            } else if (port.name === 'addr') {
                circuitData.connectors.push({
                    to: { 
                        id: memoryId,
                        port: 'rd0addr'
                    },
                    from: { 
                        id: deviceMap[port.name],
                        port: 'out'
                    },
                    name: port.name
                });
            } else if (port.name === 'data') {
                circuitData.connectors.push({
                    to: { 
                        id: deviceMap[port.name],
                        port: 'in'
                    },
                    from: { 
                        id: memoryId,
                        port: 'rd0data'
                    },
                    name: port.name
                });
            } else if (port.name === 'wraddr') {
                circuitData.connectors.push({
                    to: { 
                        id: memoryId,
                        port: 'wr0addr'
                    },
                    from: { 
                        id: deviceMap[port.name],
                        port: 'out'
                    },
                    name: port.name
                });
            } else if (port.name === 'wrdata') {
                circuitData.connectors.push({
                    to: { 
                        id: memoryId,
                        port: 'wr0data'
                    },
                    from: { 
                        id: deviceMap[port.name],
                        port: 'out'
                    },
                    name: port.name
                });
            }
        });

        return circuitData;
    } catch (error) {
        console.error('Error parsing Verilog file:', error);
        return {
            devices: {
                dev0: {
                    type: 'Clock',
                    label: 'clk',
                    net: 'clk',
                    order: 0,
                    bits: 1,
                    propagation: 100
                },
                dev1: {
                    type: 'NumEntry',
                    label: 'addr',
                    net: 'addr',
                    order: 1,
                    bits: 5
                },
                dev2: {
                    type: 'NumDisplay',
                    label: 'data',
                    net: 'data',
                    order: 2,
                    bits: 4
                },
                dev3: {
                    type: 'NumEntry',
                    label: 'wraddr',
                    net: 'wraddr',
                    order: 3,
                    bits: 5
                },
                dev4: {
                    type: 'NumEntry',
                    label: 'wrdata',
                    net: 'wrdata',
                    order: 4,
                    bits: 4
                },
                dev5: {
                    type: 'Memory',
                    label: 'mem',
                    net: 'mem',
                    order: 5,
                    bits: 4,
                    abits: 5,
                    words: 16,
                    offset: 0,
                    rdports: [{}],
                    wrports: [{ clock_polarity: true }],
                    memdata: [
                        "0000", "0001", "0010", "0011",
                        "0100", "0101", "0110", "0111",
                        "1000", "1001", "1010", "1011",
                        "1100", "1101", "1110", "1111"
                    ]
                }
            },
            connectors: [
                {
                    to: { id: 'dev5', port: 'wr0clk' },
                    from: { id: 'dev0', port: 'out' },
                    name: 'clk'
                },
                {
                    to: { id: 'dev5', port: 'rd0addr' },
                    from: { id: 'dev1', port: 'out' },
                    name: 'addr'
                },
                {
                    to: { id: 'dev2', port: 'in' },
                    from: { id: 'dev5', port: 'rd0data' },
                    name: 'data'
                },
                {
                    to: { id: 'dev5', port: 'wr0addr' },
                    from: { id: 'dev3', port: 'out' },
                    name: 'wraddr'
                },
                {
                    to: { id: 'dev5', port: 'wr0data' },
                    from: { id: 'dev4', port: 'out' },
                    name: 'wrdata'
                }
            ],
            subcircuits: {}
        };
    }
}

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            console.log('No file received');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Received file:', req.file);
        console.log('File path:', req.file.path);
        
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        console.log('File content:', fileContent);
        
        const circuitData = parseVerilogFile(req.file.path);
        console.log('Generated circuit data:', JSON.stringify(circuitData, null, 2));
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json(circuitData);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
        }
        if (err.code === 'Unexpected field') {
            return res.status(400).json({ error: 'Invalid field name. Use "file" as the field name' });
        }
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 
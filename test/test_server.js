const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testServer() {
    try {
        // Read the test Verilog file
        const filePath = path.join(__dirname, 'test_circuit.v');
        const fileStream = fs.createReadStream(filePath);

        // Create form data
        const formData = new FormData();
        formData.append('file', fileStream);

        // Send request to server
        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        console.log('Server Response:');
        console.log(JSON.stringify(data, null, 2));

        // Verify the response structure
        console.log('\nVerifying response structure...');
        
        // Check if devices exist
        if (!data.devices) {
            throw new Error('Response missing devices property');
        }

        // Check if all devices have required properties
        Object.entries(data.devices).forEach(([id, device]) => {
            console.log(`\nChecking device ${id}:`);
            console.log(`Type: ${device.type}`);
            console.log(`Label: ${device.label}`);
            console.log(`Bits: ${device.bits}`);
            
            if (!device.type || !device.label || typeof device.bits !== 'number') {
                throw new Error(`Device ${id} missing required properties`);
            }
        });

        console.log('\nTest passed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testServer(); 
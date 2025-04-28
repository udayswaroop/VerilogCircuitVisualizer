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

const defaultCircuitConfig = {
  devices: {
    dev0: {
      type: "Clock",
      label: "clk",
      net: "clk",
      order: 0,
      bits: 1,
      propagation: 100,
    },
    dev1: {
      type: "NumEntry",
      label: "addr",
      net: "addr",
      order: 1,
      bits: 5,
    },
    dev2: {
      type: "NumDisplay",
      label: "data",
      net: "data",
      order: 2,
      bits: 4,
    },
    dev3: {
      type: "NumEntry",
      label: "wraddr",
      net: "wraddr",
      order: 3,
      bits: 5,
    },
    dev4: {
      type: "NumEntry",
      label: "wrdata",
      net: "wrdata",
      order: 4,
      bits: 4,
    },
    dev5: {
      label: "mem",
      type: "Memory",
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
        "1100", "1101", "1110", "1111",
      ],
    },
  },
  connectors: [
    {
      to: { id: "dev5", port: "wr0clk" },
      from: { id: "dev0", port: "out" },
      name: "clk",
    },
    {
      to: { id: "dev5", port: "rd0addr" },
      from: { id: "dev1", port: "out" },
      name: "addr",
    },
    {
      to: { id: "dev2", port: "in" },
      from: { id: "dev5", port: "rd0data" },
      name: "data",
    },
    {
      to: { id: "dev5", port: "wr0addr" },
      from: { id: "dev3", port: "out" },
      name: "wraddr",
    },
    {
      to: { id: "dev5", port: "wr0data" },
      from: { id: "dev4", port: "out" },
      name: "wrdata",
    },
  ],
  subcircuits: {},
};

function App() {
  const [theme, setTheme] = useState('light');
  const [circuitConfig, setCircuitConfig] = useState(defaultCircuitConfig);

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

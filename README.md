# Verilog Circuit Visualizer

A web application that visualizes and simulates Verilog/SystemVerilog circuits using React and digitaljs.

## Features

- Upload and visualize Verilog/SystemVerilog files
- Interactive circuit simulation
- Dark/Light theme support
- Responsive design
- Real-time circuit state visualization

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── LogicGates.js
│   │   └── SimpleRAM.js
│   ├── styled-components/
│   │   ├── AppStyles.js
│   │   └── LogicGatesStyles.js
│   └── App.js
└── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/udayswaroop/VerilogCircuitVisualizer.git
cd VerilogCircuitVisualizer
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Start the development server:
```bash
npm start
```

4. Start the backend server (in a separate terminal):
```bash
cd server
npm install
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Click the "Upload" button to select a Verilog/SystemVerilog file
2. The circuit will be automatically visualized
3. Use the simulation controls to:
   - Start/Stop simulation
   - Toggle dark/light theme
   - View circuit state

## Dependencies

- React
- styled-components
- reactflow
- digitaljs
- axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
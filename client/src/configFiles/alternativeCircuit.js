// Alternative circuit configuration with a larger memory and additional components
const alternativeCircuitConfig = {
    devices: {
      // Clock with faster propagation
      dev0: {
        type: "Clock",
        label: "Clock",
        net: "clk",
        order: 0,
        bits: 1,
        propagation: 50,  // Faster clock than the previous example
      },
      // Address input
      dev1: {
        type: "NumEntry",
        label: "Read Address",
        net: "rd_addr",
        order: 1,
        bits: 6,  // Larger address space (6 bits = 64 addresses)
      },
      // Data output display
      dev2: {
        type: "NumDisplay",
        label: "Read Data",
        net: "rd_data",
        order: 2,
        bits: 8,  // 8-bit data width
      },
      // Write address input
      dev3: {
        type: "NumEntry",
        label: "Write Address",
        net: "wr_addr",
        order: 3,
        bits: 6,  // Larger address space (6 bits = 64 addresses)
      },
      // Write data input
      dev4: {
        type: "NumEntry",
        label: "Write Data",
        net: "wr_data",
        order: 4,
        bits: 8,  // 8-bit data width
      },
      // Write enable toggle
      dev5: {
        type: "Button",
        label: "Write Enable",
        net: "wr_en",
        order: 5,
        bits: 1,
      },
      // Memory module
      dev6: {
        label: "RAM 64x8",
        type: "Memory",
        bits: 8,       // 8-bit data width
        abits: 6,      // 6-bit address (64 addresses)
        words: 64,     // 64 words total
        offset: 0,
        rdports: [{}],
        wrports: [{ 
          clock_polarity: true,
          enable_polarity: true
        }],
        // Initial memory data (first 16 words shown, the rest will be zeroes)
        memdata: [
          "00000000", // 0: Value 0
          "00000001", // 1: Value 1
          "00000010", // 2: Value 2
          "00000100", // 3: Value 4
          "00001000", // 4: Value 8
          "00010000", // 5: Value 16
          "00100000", // 6: Value 32
          "01000000", // 7: Value 64
          "10000000", // 8: Value 128
          "11111111", // 9: Value 255 (all bits set)
          "10101010", // 10: Alternating pattern
          "01010101", // 11: Alternating pattern (inverted)
          "11110000", // 12: High nibble set
          "00001111", // 13: Low nibble set
          "11001100", // 14: Pattern
          "00110011", // 15: Pattern
        ],
      },
      // Status LED for write operations
      dev7: {
        type: "LED",
        label: "Write Status",
        net: "wr_status",
        order: 7,
        bits: 1,
      }
    },
    connectors: [
      // Clock to memory write port
      {
        to: { id: "dev6", port: "wr0clk" },
        from: { id: "dev0", port: "out" },
        name: "clk",
      },
      // Read address to memory read port
      {
        to: { id: "dev6", port: "rd0addr" },
        from: { id: "dev1", port: "out" },
        name: "rd_addr",
      },
      // Memory read output to display
      {
        to: { id: "dev2", port: "in" },
        from: { id: "dev6", port: "rd0data" },
        name: "rd_data",
      },
      // Write address to memory write port
      {
        to: { id: "dev6", port: "wr0addr" },
        from: { id: "dev3", port: "out" },
        name: "wr_addr",
      },
      // Write data to memory write port
      {
        to: { id: "dev6", port: "wr0data" },
        from: { id: "dev4", port: "out" },
        name: "wr_data",
      },
      // Write enable button to memory write enable
      {
        to: { id: "dev6", port: "wr0en" },
        from: { id: "dev5", port: "out" },
        name: "wr_en",
      },
      // Write enable to status LED
      {
        to: { id: "dev7", port: "in" },
        from: { id: "dev5", port: "out" },
        name: "wr_status",
      }
    ],
    subcircuits: {},
  };
  
  export default alternativeCircuitConfig;
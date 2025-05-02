module simple_ram(
    input clk,              // Clock input
    input [4:0] addr,      // 5-bit read address
    output [3:0] data,     // 4-bit read data
    input [4:0] wraddr,    // 5-bit write address
    input [3:0] wrdata     // 4-bit write data
);

    // 16x4 memory array
    reg [3:0] mem [0:15];

    // Read operation
    assign data = mem[addr];

    // Write operation
    always @(posedge clk) begin
        mem[wraddr] <= wrdata;
    end

    // Initialize memory with some values
    initial begin
        mem[0] = 4'b0000;
        mem[1] = 4'b0001;
        mem[2] = 4'b0010;
        mem[3] = 4'b0011;
        mem[4] = 4'b0100;
        mem[5] = 4'b0101;
        mem[6] = 4'b0110;
        mem[7] = 4'b0111;
        mem[8] = 4'b1000;
        mem[9] = 4'b1001;
        mem[10] = 4'b1010;
        mem[11] = 4'b1011;
        mem[12] = 4'b1100;
        mem[13] = 4'b1101;
        mem[14] = 4'b1110;
        mem[15] = 4'b1111;
    end

endmodule 
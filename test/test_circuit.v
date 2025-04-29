module test_circuit(
    input [3:0] data_in,    // 4-bit input
    input clk,              // 1-bit clock
    output [7:0] data_out,  // 8-bit output
    output reg valid        // 1-bit valid signal
);

    // Internal signals
    reg [7:0] counter;
    wire enable;

    // Simple assignments
    assign enable = clk & valid;
    assign data_out = counter;

    // Sequential logic
    always @(posedge clk) begin
        if (enable) begin
            counter <= counter + data_in;
            valid <= 1'b1;
        end
    end

endmodule 
module fulladder(
    input a,
    input b,
    input c,
    output o
);
    wire sum1, carry1, carry2;
    
    // First half adder
    assign sum1 = a ^ b;
    assign carry1 = a & b;
    
    // Second half adder
    assign o = sum1 ^ c;
    assign carry2 = sum1 & c;
    
    // Final carry
    assign cout = carry1 | carry2;
    
endmodule 
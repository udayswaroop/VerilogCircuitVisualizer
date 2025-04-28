import React from 'react';
import { Handle } from 'reactflow';
import { 
  NodeContainer, 
  GateSymbol, 
  Label, 
  Tooltip, 
  StateIndicator 
} from '../styled-components/LogicGatesStyles';

const createInputHandles = (count) => {
  const handles = [];
  const spacing = 100 / (count + 1);
  
  for (let i = 0; i < count; i++) {
    handles.push(
      <Handle
        key={`input-${i}`}
        type="target"
        position="left"
        id={`in${i + 1}`}
        style={{ top: `${spacing * (i + 1)}%` }}
      />
    );
  }
  
  return handles;
};

export const AndGate = ({ data }) => (
  <NodeContainer theme={data.theme} active={data.state}>
    <Tooltip>AND Gate: {data.label}</Tooltip>
    <StateIndicator active={data.state} />
    {createInputHandles(2)}
    <Label>{data.label}</Label>
    <GateSymbol theme={data.theme}>&amp;</GateSymbol>
    <Handle type="source" position="right" style={{ top: '50%' }} />
  </NodeContainer>
);

export const OrGate = ({ data }) => (
  <NodeContainer theme={data.theme} active={data.state}>
    <Tooltip>OR Gate: {data.label}</Tooltip>
    <StateIndicator active={data.state} />
    {createInputHandles(2)}
    <Label>{data.label}</Label>
    <GateSymbol theme={data.theme}>≥1</GateSymbol>
    <Handle type="source" position="right" style={{ top: '50%' }} />
  </NodeContainer>
);

export const XorGate = ({ data }) => (
  <NodeContainer theme={data.theme} active={data.state}>
    <Tooltip>XOR Gate: {data.label}</Tooltip>
    <StateIndicator active={data.state} />
    {createInputHandles(2)}
    <Label>{data.label}</Label>
    <GateSymbol theme={data.theme}>⊕</GateSymbol>
    <Handle type="source" position="right" style={{ top: '50%' }} />
  </NodeContainer>
);

export const InputNode = ({ data }) => (
  <NodeContainer 
    theme={data.theme}
    active={data.state}
    style={{ 
      background: data.theme === 'dark' ? '#2c5282' : '#e6f3ff',
      borderColor: data.theme === 'dark' ? '#2b6cb0' : '#3182ce',
      cursor: 'pointer'
    }}
    onClick={data.onClick}
  >
    <Tooltip>Input: {data.label} ({data.state ? 'ON' : 'OFF'})</Tooltip>
    <StateIndicator active={data.state} />
    <Label>{data.label}</Label>
    <GateSymbol theme={data.theme}>IN</GateSymbol>
    <Handle type="source" position="right" style={{ top: '50%' }} />
  </NodeContainer>
);

export const OutputNode = ({ data }) => (
  <NodeContainer 
    theme={data.theme}
    active={data.state}
    style={{ 
      background: data.theme === 'dark' ? '#742a2a' : '#fff0f0',
      borderColor: data.theme === 'dark' ? '#9b2c2c' : '#e53e3e'
    }}
  >
    <Tooltip>Output: {data.label} ({data.state ? 'ON' : 'OFF'})</Tooltip>
    <StateIndicator active={data.state} />
    <Handle type="target" position="left" style={{ top: '50%' }} />
    <Label>{data.label}</Label>
    <GateSymbol theme={data.theme}>OUT</GateSymbol>
  </NodeContainer>
);

export const WireNode = ({ data }) => (
  <NodeContainer 
    theme={data.theme}
    active={data.state}
    style={{ 
      background: data.theme === 'dark' ? '#2d3748' : '#f0f0f0',
      minWidth: '80px'
    }}
  >
    <Tooltip>Wire: {data.label} ({data.state ? 'ON' : 'OFF'})</Tooltip>
    <StateIndicator active={data.state} />
    <Handle type="target" position="left" style={{ top: '50%' }} />
    <Label>{data.label}</Label>
    <Handle type="source" position="right" style={{ top: '50%' }} />
  </NodeContainer>
); 
import styled from 'styled-components';

export const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 8px;
  background: ${props => props.theme === 'dark' ? '#2d3748' : 'white'};
  border: 2px solid ${props => props.theme === 'dark' ? '#4a5568' : '#1a192b'};
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }

  ${props => props.active && `
    background: ${props.theme === 'dark' ? '#48bb78' : '#9ae6b4'};
    border-color: ${props.theme === 'dark' ? '#38a169' : '#48bb78'};
  `}
`;

export const GateSymbol = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#1a192b'};
`;

export const Label = styled.div`
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#777'};
  margin-bottom: 5px;
`;

export const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;

  ${NodeContainer}:hover & {
    opacity: 1;
  }
`;

export const StateIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#48bb78' : '#fc8181'};
  position: absolute;
  top: 5px;
  right: 5px;
  transition: background-color 0.3s ease;
`; 
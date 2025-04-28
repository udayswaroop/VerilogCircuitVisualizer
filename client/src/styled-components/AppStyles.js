import styled from 'styled-components';

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme === 'dark' ? '#1a202c' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#1a192b'};
`;

export const Header = styled.header`
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? '#2d3748' : '#282c34'};
  color: white;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  margin: 0;
  flex: 1;
  text-align: center;
`;

export const UploadSection = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: ${props => props.theme === 'dark' ? '#2d3748' : '#f5f5f5'};
`;

export const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#1a192b'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme === 'dark' ? '#718096' : '#cbd5e0'};
  }
`;

export const CircuitContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow: auto;
  background-color: ${props => props.theme === 'dark' ? '#1a202c' : '#ffffff'};
  width: 100%;
`; 


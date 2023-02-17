import styled from 'styled-components';

interface IButtonProps {
  enabled?: boolean;
  backgroundTransparent?: boolean;
  backgroundColor?:string
  color?:string;
  borderVisible?: boolean;
  width?:string;
  height?:string;
}

export const Button = styled.button<IButtonProps>`
  background: ${(props) =>
    props.backgroundTransparent ? 'transparent' : props.backgroundColor};
  color: ${(props) =>
    props.color ? props.color: '#FFFFFF'};
  opacity: ${(props) => (props.disabled ? '50%' : '100%')};
  border-radius: 5px;
  border-width: 2px;
  border-style: ${(props) => (props.borderVisible ? 'solid' : 'none')};
  border-color: #FFFFFF;
  cursor: ${(props) => (props.disabled ? 'initial' : 'pointer')};
  height: ${(props) => (props.height ? props.height : '34px')};
  min-width: ${(props) => (props.width ? props.width : '270px')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 26px;
  transition: 0.1s all;

  :active {
    opacity: 0.5;
  }
`;
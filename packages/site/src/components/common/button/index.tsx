import styled from 'styled-components';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'small';
  typeButton?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'default'
    | 'round'
    | 'cancel'
    | 'receive';
  loading?: boolean;
}

const Button: React.FC<Props> = ({
  size = 'default',
  typeButton = 'default',
  children,
  loading,
  disabled,
  ...props
}) => {
  return (
    <ButtonWrapper
      size={size}
      typeButton={typeButton}
      {...props}
      disabled={disabled || loading}
    >
      {children}
    </ButtonWrapper>
  );
};

const buttonStyle = (type:any, theme:any) => {
  switch (type) {
    case 'primary':
      return `
	  color: ${theme.palette.default.contrastText};
	  background:  ${theme.palette.default.main};
	  border-color: ${theme.palette.default.light};
		`;
    case 'secondary':
      return `
			color: ${theme.color.secondary};
			background:  ${theme.bg.color.main};
			border-color: ${theme.color.white};
		`;
    case 'danger':
      return `
		color: ${theme.color.danger};
		background:  ${theme.bg.color.main};
		border-color: ${theme.color.white};
	`;
    case 'round':
      return `
      color: ${theme.palette.default.contrastText};
      background:${theme.palette.default.main};
      border-color: ${theme.palette.default.main};
      border-radius:50%;
      font-weight: 400;
      width:80px;
      height:80px;
	`;
    case 'cancel':
      return `
        color: ${theme.color.black};
        background:${theme.bg.color.white};
        border-color: ${theme.color.greyBorder};
        border-radius:20px;
        font-weight: 400; 
      `;
    case 'receive':
      return `
      color: ${theme.color.primary};
      background:  ${theme.bg.color.white};
      border-color: ${theme.color.primary};
      border: 2px solid ${theme.color.primary};
      `;
    default:
      return `
      color: ${theme.palette.default.contrastText};
      background:${theme.palette.default.main};
      border-color: ${theme.palette.default.main};
      border-width:2px;
	`;
  }
};

const fillBackgroundButtonTypes = ['primary'];

const borderButtonTypes = ['receive', 'cancel', 'default'];

const ButtonWrapper = styled.button<Props>`
  font-family: 'Lexend', sans-serif;
  font-weight: 500;
  ${props => (props.size === 'small' ? 'padding: 0 30px' : 'width: 100%')};
  padding: ${props => (props.size === 'small' ? '8px' : '12px')};
  font-size: ${props => (props.size === 'small' ? '12px' : '14px')};
  line-height: ${props => (props.size === 'small' ? '14px' : '20px')};
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid;
  outline: none;
  box-sizing: border-box;
  height: 44px;
  ${p => buttonStyle(p.typeButton, p.theme)}
  &:focus-visible {
    ${props => {
      if (fillBackgroundButtonTypes.includes(props.typeButton as any)) {
        return `
          opacity: 0.8;
        `;
      } else if (borderButtonTypes.includes(props.typeButton as any)) {
        return `
        border-width: 3px;
      `;
      }
    }};
  }

  &:disabled {
    opacity: 0.5;
    background: ${p => p.theme.palette.grey.grey4};
  }
`;

export default Button;

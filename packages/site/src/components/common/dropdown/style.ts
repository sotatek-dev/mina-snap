import styled from 'styled-components';
import Dropdown from 'react-dropdown';
import selectArrow from 'assets/images/select-arrow.svg';
import icon from 'assets/images/arrow-up.svg';

interface IDropDown {
  error?: boolean;
  disabled?: boolean;
}

export const Wrapper = styled.div<IDropDown>`
  display: flex;
  flex-direction: column;
  font-family: 'Inter Regular';
  .is-open .Dropdown-control {
    color: ${(props) => props.theme.palette.grey.black};
    border-color: ${(props) => props.theme.palette.grey.grey2};
  }
`;

export const DropDown = styled.select<IDropDown>``;

export const DropdownStyled = styled(Dropdown) <IDropDown>`
  font-family: 'Inter Regular';
  
  .Dropdown-control {
    border-radius: ${(props) => props.theme.corner.medium};
    box-sizing: border-box;
    border: 0.7px solid ${(props) => props.theme.palette.grey.grey2};
    font-size: ${(props) => props.theme.typography.p1.fontSize};
    font-family: ${(props) => props.theme.typography.p1.fontFamily};
    font-style: normal;
    font-weight: ${(props) => props.theme.typography.p1.fontWeight};
    line-height: ${(props) => props.theme.typography.p1.lineHeight};
    color: ${(props) => props.theme.palette.grey.black};
    border-style: ${(props) => (props.disabled ? 'dashed' : 'solid')};
    :focus {
      outline: none;
    }
    padding-left: ${(props) => props.theme.spacing.small};
    background-color: ${(props) => props.theme.palette.grey.grey3};
    ::placeholder,
    ::-webkit-input-placeholder {
      color: ${(props) => props.theme.palette.grey.grey1};
    }
    -webkit-appearance: none;
    appearance: none;
    background-image: url(${selectArrow});
    background-repeat: no-repeat;
    background-position: calc(100% - 20px) center;
    background-size: 12px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.is-open .Dropdown-control {
    background-image: url(${icon});
  }

  .Dropdown-menu {
    margin-top: ${(props) => props.theme.spacing.tiny2};
    border-radius: ${(props) => props.theme.corner.medium};
    box-shadow: 0px 14px 24px -6px rgba(106, 115, 125, 0.2);
    width: 170px;
    border: 0.7px solid #BBC0C5;
  }

  .Dropdown-arrow-wrapper {
    display: none;
  }

  .Dropdown-option {
    font-size: ${(props) => props.theme.typography.p1.fontSize};
    color: ${(props) => props.theme.palette.grey.black};
    font-family: ${(props) => props.theme.typography.p1.fontFamily};
    font-style: normal;
    font-weight: ${(props) => props.theme.typography.p1.fontWeight};
    line-height: ${(props) => props.theme.typography.p1.lineHeight};
    padding: 4px 0;
    text-align: center;
    
    :hover {
      background-color: ${(props) => props.theme.palette.grey.grey4};
    }
  }
  .Dropdown-option.is-selected {
    background-color: white;
    color: #594AF1;
   
   
  }
`;


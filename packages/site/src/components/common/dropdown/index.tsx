import { DropdownStyled, Wrapper } from './style';
import 'react-dropdown/style.css';
import { Group, Option, ReactDropdownProps } from 'react-dropdown';


interface Props extends ReactDropdownProps {
  error?: boolean;
  options: (string | Group | Option)[];
  label?: string;
  value?: string | Option;
}

const DropDown = ({ disabled, error, options, label, value, ...otherProps }: Props) => {
  return (
    <Wrapper>
      <DropdownStyled
        error={error}
        disabled={disabled}
        options={options}
        value={value}
        {...otherProps}
      />
    </Wrapper>
  );
};

export default DropDown
import { PopperPlacementType } from '@mui/material';
import { ReactNode, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { CSSProperties } from 'styled-components';
import { POPOVER_DURATION } from 'utils/constants';
import styled from 'styled-components';

type CloseTriggers = 'timeout' | 'click' | 'hover';

interface Props {
  children: ReactNode;
  content: ReactNode;
  contentStyle?: CSSProperties;
  closeTrigger?: CloseTriggers;
  offSet?: [number, number];
  placement?: PopperPlacementType;
}

export const Wrapper = styled.div`
  font-family: 'Inter Regular';
  width: fit-content;
  bac
`;

export const PopperContainer = styled.div`
  border-radius: ${(props) => props.theme.corner.small};
  background-color: ${(props) => props.theme.palette.grey.white};
  text-align: center;
  box-shadow: 0px 0px 60px 0px rgba(106, 115, 125, 0.2);
  z-index: 10000;
`;

export const ToolTipContent = styled.div`
  font-size: ${(props) => props.theme.typography.c1.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
`;

export const PopperTooltipView = ({
  children,
  content,
  contentStyle,
  closeTrigger = 'timeout',
  offSet,
  placement,
}: Props) => {
  const [popperVisible, setPopperVisible] = useState(false);

  const handlePopperVisibleChange = () => {
    if (!popperVisible && closeTrigger === 'timeout') {
      setTimeout(() => {
        setPopperVisible(false);
      }, POPOVER_DURATION);
    } else if (closeTrigger === 'click') {
      setPopperVisible(!popperVisible);
    }
  };

  const handleOnClick = () => {
    if (closeTrigger === 'hover') setPopperVisible(false);
    else setPopperVisible(true);
  };

  const handleOnMouseEnter = () => {
    if (closeTrigger === 'hover') setPopperVisible(true);
  };

  const handleOnMouseLeave = () => {
    if (closeTrigger === 'hover') setPopperVisible(false);
  };

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({
    trigger: 'click',
    offset: offSet || [0, 23],
    visible: popperVisible,
    onVisibleChange: handlePopperVisibleChange,
    closeOnOutsideClick: closeTrigger === 'click',
    placement: placement,
  });

  return (
    <>
      <Wrapper
        ref={setTriggerRef}
        onClick={handleOnClick}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        {children}
      </Wrapper>

      {visible && (
        <PopperContainer ref={setTooltipRef} {...getTooltipProps({})}>
          <ToolTipContent style={contentStyle}>{content}</ToolTipContent>
        </PopperContainer>
      )}
    </>
  );
};

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
  arrowVisible?: boolean;
  offSet?: [number, number];
  placement?: PopperPlacementType;
}

interface IDiv {
arrowVisible?: boolean;
}
  
  export const Wrapper = styled.div`
    width: fit-content;
  `;
  
  export const PopperContainer = styled.div<IDiv>`
    border-radius: ${(props) => props.theme.corner.small};
    background-color: ${(props) => props.theme.palette.grey.white};
    text-align: center;
    box-shadow: 0px 0px 60px 0px rgba(106, 115, 125, 0.2);
  
    .arrow {
      position: absolute;
      width: 20px;
      height: 20px;
  
      &:after {
        content: ' ';
        position: absolute;
        top: -27px; // we account for the PopperContainer padding
        left: 0px;
        transform: rotate(45deg);
        width: 20px;
        height: 20px;
        background-color: white;
      }
    }
  
    &[data-popper-placement^='top'] > .arrow {
      bottom: -37px;
    }
  
    &[data-popper-placement^='right'] > .arrow {
      &:after {
        left: -27px;
        top: calc(50% - 10px);
      }
    }
  
    &[data-popper-placement^='left'] > .arrow {
      right: 0px;
      &:after {
        top: calc(50% - 10px);
      }
    }
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
  arrowVisible = true,
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

  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({
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
        <PopperContainer ref={setTooltipRef} {...getTooltipProps({})} arrowVisible={arrowVisible}>
          {arrowVisible && <div {...getArrowProps({ className: 'arrow' })} />}
          <ToolTipContent style={contentStyle}>{content}</ToolTipContent>
        </PopperContainer>
      )}
    </>
  );
};

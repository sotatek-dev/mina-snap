import { PopperPlacementType } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { CSSProperties } from 'styled-components';
import { POPOVER_DURATION } from 'utils/constants';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { setIsShowKebabMenu, setIsShowListAccount } from 'slices/modalSlice';

type CloseTriggers = 'timeout' | 'click' | 'hover';

interface Props {
  children: ReactNode;
  content: ReactNode;
  contentStyle?: CSSProperties;
  closeTrigger?: CloseTriggers;
  offSet?: [number, number];
  placement?: PopperPlacementType;
}

export const PopperTooltipView = ({
  children,
  content,
  contentStyle,
  closeTrigger = 'timeout',
  offSet,
  placement,
}: Props) => {
  const dispatch = useDispatch();

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
  useEffect(() => {
    if (!popperVisible) {
      dispatch(setIsShowListAccount(false));
      dispatch(setIsShowKebabMenu(false));

    }
  }, [popperVisible]);

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
          <ToolTipContent
            style={contentStyle}
            onClick={() => {
              setPopperVisible(false);
            }}
          >
            {content}
          </ToolTipContent>
        </PopperContainer>
      )}
    </>
  );
};

export const Wrapper = styled.div`
  font-family: 'Inter Regular';
  width: fit-content;
`;

export const PopperContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  text-align: center;
  z-index: 10000;
`;

export const ToolTipContent = styled.div`
  font-size: ${(props) => props.theme.typography.c1.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
`;

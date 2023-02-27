import { FormControl, FormHelperText, TextField } from "@mui/material";
import ButtonCommon from "components/common/button";
import Modal from "components/common/modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GAS_FEE } from "utils/constants";
import IAdvanced from "assets/icons/icon-advance.svg";
import Button from "components/common/button";
import ModalConfirm from "./ModalConfirm";

interface ModalProps {
    open:boolean;
    clickOutSide: boolean;
    setOpenModal: () => void;
}

interface Props {
    active?: boolean;
    toggle?: boolean;
    disable?: boolean;
}

const RequiredBox = styled.div`
    border-bottom: 1px solid #D9D9D9;
    padding-bottom: 17px;
`;

const WTitle = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Tittle = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
    margin-top: 12px;
    margin-bottom: 4px;
`

const Balance = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #00000066;
    margin-top: 20px;
`

const MaxAmount = styled.div`
    position: absolute;
    left: calc(100% - 50px);
    top: calc(30% - 38px);
    color: #5972F5;
    z-index: 999;
    :hover {
        cursor: pointer;
    }
`

const Input = styled(TextField)`
    position: relative;
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
    }
    '&.Mui-focused': {
        borderColor: #594AF1,
      },
`

const WOption = styled.div`
    display: flex;
    justify-content: space-between;
    align-items:center;
`;

const Option = styled(ButtonCommon)<Props>`
display: flex;
align-items:center;
justify-content: center;
width: 85px;
max-height: 30px;
font-style: normal;
font-weight: 500;
font-size: 12px;
line-height: 12px;
color: ${props => props.active ? '#594AF1' : '#000000'};
background: #F9FAFC;
border: 1px solid ${props => props.active ? '#594AF1' : '#D9D9D9'};
border-radius: 4px;
`

const AdvancedBox = styled.div`
    min-height: 153px;
`;

const Toggle = styled.div`
    display: flex;
    align-items: center;
    padding-top: 4px;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 12px;
    color: #594AF1;
    :hover {
        cursor: pointer;
    }  
`;

const AdvancedIcon = styled.img<Props>`
    transform: ${props => props.toggle ? 'rotate(0)' : 'rotate(3.142rad)'};
    margin-left: 4px;
`;

const AdvancedContent = styled.div`
    max-height: 110px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
`;

const ButtonNext = styled(Button)<Props>`
    color: #FFFFFF;
    background: ${props => props.disable ? '#D9D9D9' : '#594AF1'} ;
    border: none;
`

const ModalTransfer = ({open,clickOutSide, setOpenModal}: ModalProps) => {
    const balance = 200;
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [gasFee, setGasFee] = useState(GAS_FEE.default);
    const [nonce, setNonce] = useState("");
    const [txInfo, setTxInfo] = useState({});
    const [isShowCotent, setIsShowContent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleAmount = (value:any) => {
        if(value > balance) {
            setAmount(balance.toString());
        }
        else {
            setAmount(value);
        }
    }

    const handleClick = () => {
        setShowModal(disabled!=true);
        const tx = {
            address: address,
            amount: amount,
            memo: memo,
            fee: gasFee,
            nonce: nonce
        }
        setTxInfo(tx);
    }
    const handleClickOutSide = () => {
        setShowModal(false)
    }

    useEffect (()=> {
        if(address && amount) {
            setDisabled(false)
        }
        else {
            setDisabled(true)
        }
    },[amount, address])

    return(
        <Modal 
            open={open}
            title='Send'
            clickOutSide={clickOutSide}
            setOpenModal={setOpenModal}
        >
            <FormControl
                fullWidth
                required
            >
                <RequiredBox>
                    <Tittle>To</Tittle>
                    <Input
                        value={address}
                        onChange={event => setAddress(event.target.value)}
                        variant="outlined"
                        placeholder="Address"
                        fullWidth
                        size="small"
                        inputProps={{
                            style: {
                            height: '34px',
                            padding: '0 14px',
                            },
                        }}
                    />
                    <WTitle>
                        <Tittle>Amount</Tittle>
                        <Balance>Balance: {balance}</Balance>
                        <MaxAmount onClick = {()=>setAmount(balance.toString())}>Max</MaxAmount>
                    </WTitle>
                    <Input
                        value={amount}
                        type="number"
                        variant="outlined"
                        placeholder="0"
                        onChange={event => handleAmount(event.target.value)}
                        fullWidth
                        size="small"
                        inputProps={{
                            style: {
                            height: '34px',
                            padding: '0 14px',
                            },
                        }}
                    />
                    <Tittle>Memo(Optional)</Tittle>
                    <Input
                        variant="outlined"
                        fullWidth
                        size="small"
                        onChange={event => setMemo(event.target.value)}
                        inputProps={{
                            style: {
                            height: '34px',
                            padding: '0 14px',
                            },
                        }}
                    />
                    <WTitle>
                        <Tittle>Fee</Tittle>
                        <Balance>{gasFee}</Balance>
                    </WTitle>
                    <WOption>
                        <Option active={gasFee==GAS_FEE.slow} onClick={() => setGasFee(GAS_FEE.slow)}>Slow</Option>
                        <Option active={gasFee==GAS_FEE.default} onClick={() => setGasFee(GAS_FEE.default)}>Default</Option>
                        <Option active={gasFee==GAS_FEE.fast} onClick={() => setGasFee(GAS_FEE.fast)}>Fast</Option>
                    </WOption>
                </RequiredBox>
                <AdvancedBox>
                    <Toggle onClick={() => setIsShowContent(!isShowCotent)}>
                        Advanced
                        <AdvancedIcon toggle={isShowCotent} src={IAdvanced}></AdvancedIcon>
                    </Toggle>
                    {isShowCotent && <AdvancedContent>
                        <Tittle>Transaction Fee</Tittle>
                        <Input
                            type="number"
                            variant="outlined"
                            placeholder={gasFee.toString()}
                            fullWidth
                            size="small"
                            onChange={event => setGasFee(Number(event.target.value))}
                            inputProps={{
                                style: {
                                height: '34px',
                                padding: '0 14px',
                                },
                            }}
                        />
                        {gasFee > 10 && <FormHelperText>
                        Fees are much higher than average
                        </FormHelperText>}
                        <Tittle>Nonce</Tittle>
                        <Input
                            variant="outlined"
                            placeholder="Nonce 1"
                            type="number"
                            fullWidth
                            size="small"
                            onChange={event => setNonce(event.target.value)}
                            inputProps={{
                                style: {
                                height: '34px',
                                padding: '0 14px',
                                },
                            }}
                        />
                    </AdvancedContent>}
                </AdvancedBox>
                <ButtonNext disable={disabled} onClick={handleClick} type="submit" >Next</ButtonNext>
                 <ModalConfirm 
                    open={showModal}
                    clickOutSide={true}
                    setOpenModal={handleClickOutSide}
                    txInfoProp={txInfo}
                />
            </FormControl>
        </Modal>
    )
}

export default ModalTransfer;
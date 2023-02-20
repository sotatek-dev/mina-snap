import  Button  from 'components/common/button'
import  DropDown  from 'components/common/dropdown'
import {ENetworkName} from 'utils/constants'

const CustomPage = () => {
  const options = [
    'Mainnet', 'Devnet', 'Berkeley'
  ];
  return (
    <>
      <div>CustomPage</div>
      <Button >Click me</Button>
      <DropDown options={options}></DropDown>
    </>

  )
}

export default CustomPage
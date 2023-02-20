import  Button  from 'components/common/button'
import  DropDown  from 'components/common/dropdown'
import { OPTIONS_NETWORK } from 'utils/constants'

const CustomPage = () => {
  
  return (
    <>
      <div>CustomPage</div>
      <Button >Click me</Button>
      <DropDown options={OPTIONS_NETWORK}></DropDown>
    </>

  )
}

export default CustomPage
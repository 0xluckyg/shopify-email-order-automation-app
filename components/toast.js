import {Toast} from '@shopify/polaris'
import store from '../redux/store'
import { showToastAction } from '../redux/actions'

//Black confirmation or error mark that shows and goes. Connected to redux so that it can be used from anywhere
function ToastMarkup(text) {
    return (    
        <Toast
            onDismiss={() => store.dispatch(showToastAction(false))}
            content={text}
        />
    )
}
 
export default ToastMarkup
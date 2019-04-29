import {Toast} from '@shopify/polaris'

//Black confirmation or error mark that shows and goes. Connected to redux so that it can be used from anywhere
function ToastMarkup(text, showToastAction) {
    return (    
        <Toast
            onDismiss={() => showToastAction(false)}
            content={text}
        />
    )
}
 
export default ToastMarkup
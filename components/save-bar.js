import { ContextualSaveBar } from '@shopify/polaris'
import store from '../redux/store'
import { isDirtyAction, showToastAction } from '../redux/actions'

//Save bar on top when user starts editing something. Calls actions on redux so that this bar can be called from anywhere.
function SaveBar(onSave) {
    return (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: () => {
                    onSave()
                    store.dispatch(isDirtyAction(false, () => {}));
                    //Shows a black toast on the bottom of the page
                    store.dispatch(showToastAction(true, 'Saved!'))
                },
            }}
            discardAction={{
                onAction: () => {
                    store.dispatch(isDirtyAction(false, ()=>{}));                    
                },
            }}
        />
    )
}

export default SaveBar;
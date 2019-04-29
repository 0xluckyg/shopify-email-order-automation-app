import { ContextualSaveBar } from '@shopify/polaris'

//Save bar on top when user starts editing something. Calls actions on redux so that this bar can be called from anywhere.
function SaveBar(onSave, isDirtyAction, showToastAction) {
    return (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: () => {
                    onSave()
                    isDirtyAction(false, () => {})
                    //Shows a black toast on the bottom of the page
                    showToastAction(true, 'Saved!')                    
                },
            }}
            discardAction={{
                onAction: () => isDirtyAction(false, () => {})
            }}
        />
    )
}

export default SaveBar;
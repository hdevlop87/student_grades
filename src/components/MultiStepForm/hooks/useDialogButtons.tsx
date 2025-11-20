import { useEffect, useState } from 'react';
import { useDialogStore } from '@/stores/MultiDialogStore';
import { useTranslation } from '@/hooks/useLanguage';

export const useDialogButtons = ({
    currentStep,
    isFirstStep,
    isLastStep,
    currentStepId,
    handlePrevious,
    reset 
}) => {

    const [ownerDialogId, setOwnerDialogId] = useState(null);

    const { t } = useTranslation();

    const {
        updatePrimaryButton,
        updateSecondaryButton,
        updateShowButtons,
        popDialog,
        getCurrentDialog,
    } = useDialogStore();

    useEffect(() => {
        const currentDialog = getCurrentDialog();
        if (currentDialog) {
            setOwnerDialogId(currentDialog.id);
        }
    }, [getCurrentDialog]);

    const handleCancel = () => {
        reset();
        popDialog(null);
    };

    useEffect(() => {
        if (!ownerDialogId) return;

        updatePrimaryButton({
            text: isLastStep ? t('common.confirm') : t('common.next'),
            variant: 'default',
            form: currentStepId,
            loading: false,
            disabled: false
        }, ownerDialogId);

        updateSecondaryButton({
            text: isFirstStep ? t('common.cancel') : t('common.previous'),
            variant: 'secondary',
            icon: isFirstStep ? 'x' : 'chevronLeft',
            onClick: isFirstStep ? handleCancel : handlePrevious,
            loading: false,
            disabled: false
        }, ownerDialogId);

        updateShowButtons(true, ownerDialogId);

    }, [currentStep, isFirstStep, isLastStep, currentStepId, ownerDialogId]);

    return { ownerDialogId };
}
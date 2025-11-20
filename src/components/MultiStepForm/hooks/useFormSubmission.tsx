// hooks/useMultiStepFormSubmission.ts

import { z } from 'zod';
import { useMultiStepFormStore } from '@/stores/MultiStepFormStore';

interface UseMultiStepFormSubmissionProps {
    currentStepId: string;
    isLastStep: boolean;
    handleNext: any;
    fullSchema: z.ZodObject<any>;
    onSubmit?: (data: any) => void | Promise<void>;
    transformData: (formData: any) => any;
    reset:any
}

export const useFormSubmission = ({
    currentStepId,
    isLastStep,
    handleNext,
    fullSchema,
    onSubmit,
    transformData,
    reset
}: UseMultiStepFormSubmissionProps) => {
    const updateFormData = useMultiStepFormStore.use.updateFormData();
    const formData = useMultiStepFormStore.use.formData();

    const isAlreadyWrapped = (stepData: any) => {
        return (
            typeof stepData === 'object' &&
            stepData !== null &&
            !Array.isArray(stepData) &&
            Object.keys(stepData).length === 1 &&
            Object.keys(stepData)[0] === currentStepId
        );
    };


    const handleStepSubmit = async (stepData: any) => {
        const dataToStore = isAlreadyWrapped(stepData) ? stepData[currentStepId] : stepData;
        const wrappedStepData = { [currentStepId]: dataToStore };
        const updatedFormData = { ...formData, ...wrappedStepData };
        updateFormData(updatedFormData);

        if (!isLastStep) {
            handleNext();
        } else {
            const transformedData = transformData(updatedFormData);
            const validatedData = fullSchema.parse(transformedData);
            await onSubmit?.(validatedData);
            reset();
        }
    };

    return { handleStepSubmit };
};
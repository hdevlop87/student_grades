import { useMultiStepFormStore } from '@/stores/MultiStepFormStore';
import React, { useEffect } from 'react';

export const useStepNavigation = (children) => {
    const currentStep = useMultiStepFormStore.use.currentStep();
    const goNext = useMultiStepFormStore.use.goNext();
    const goPrevious = useMultiStepFormStore.use.goPrevious();
    const reset = useMultiStepFormStore.use.reset();
    const setTotalSteps = useMultiStepFormStore.use.setTotalSteps();
    const formData = useMultiStepFormStore.use.formData();

    const stepChildren = React.Children.toArray(children);
    const totalSteps = stepChildren.length;

    const isLastStep = currentStep === totalSteps;
    const isFirstStep = currentStep === 1;

    const currentStepComponent: any = stepChildren[currentStep - 1];
    const currentStepId = currentStepComponent?.props?.id;
    const currentStepSchema = currentStepComponent?.props?.schema;

    const currentStepDefaultValues = (() => {
        const stepData = currentStepId && formData[currentStepId]
            ? formData[currentStepId]
            : currentStepComponent?.props.defaultValues || {};

        if (Array.isArray(stepData)) {
            return { [currentStepId]: stepData };
        }

        return stepData;
    })();

    const steps = stepChildren.map((child: any, index) => ({
        number: index + 1,
        title: child?.props.title || `Step ${index + 1}`
    }));

    const handleNext = () => {
        if (currentStep < totalSteps) {
            goNext();
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            goPrevious();
        }
    };

    useEffect(() => {
        setTotalSteps(totalSteps);
    }, [totalSteps, setTotalSteps]);

    return {
        currentStep,
        totalSteps,
        isLastStep,
        isFirstStep,
        handleNext,
        handlePrevious,
        reset,
        currentStepComponent,
        currentStepId,
        currentStepSchema,
        currentStepDefaultValues,
        steps
    };
};
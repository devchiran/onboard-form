import React from 'react';
import OnboardForm from '../../components/onboardForm/OnboardForm.component';
import { TOTAL_STEPS } from '../../config/constants';

const OnboardingLayout: React.FC<{}> = () => {
  return (
    <div className="flex flex-col gap-20 justify-center align-center min-h-screen">
      <h1 className="flex justify-center">{`Step ${1} of ${TOTAL_STEPS}`}</h1>
      <OnboardForm />
    </div>
  );
};

export default OnboardingLayout;

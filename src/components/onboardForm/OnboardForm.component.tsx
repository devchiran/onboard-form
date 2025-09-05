import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '../formInput/FormInput.component';
import {
  onboardFormSchema,
  type OnboardFormData,
} from '../../utils/validation';
import { submitProfile } from '../../services/form-api';
import { useCorporationNumber } from '../../hooks/useCorporationNumber';
import Button from '../button/button.component';

const OnboardForm: React.FC<{}> = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { loading, checkCorporationNumber } = useCorporationNumber();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setError,
    clearErrors,
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardFormSchema),
    mode: 'onBlur',
  });

  const handleCorporationBlur = async () => {
    clearErrors('corporationNumber');
    const value = getValues('corporationNumber');
    const checkResult = await checkCorporationNumber(value);

    if (!checkResult.valid) {
      setError('corporationNumber', {
        type: 'manual',
        message: checkResult.message,
      });
    }
    return;
  };

  const onSubmit = async (data: OnboardFormData) => {
    clearErrors('root');
    const res = await submitProfile(data);
    if (res.success) {
      setFormSubmitted(true);
      reset();
    } else {
      setError('root', {
        type: 'manual',
        message: res.message || 'Submission failed. Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 w-full max-w-xl border-1 border-gray-300">
        <h1 className="text-3xl text-center mb-8">Onboarding Form</h1>
        {!formSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                id="firstName"
                required
                register={register}
                error={errors.firstName?.message as string}
              />
              <FormInput
                label="Last Name"
                id="lastName"
                required
                register={register}
                error={errors.lastName?.message as string}
              />
            </div>
            <FormInput
              label="Phone Number"
              id="phone"
              type="tel"
              required
              register={register}
              error={errors.phone?.message as string}
            />
            <FormInput
              label="Corporation Number"
              id="corporationNumber"
              required
              register={register}
              error={errors.corporationNumber?.message as string}
              onBlur={handleCorporationBlur}
              loading={loading}
            />
            <Button
              type="submit"
              text="Submit"
              postChild={<span className="ml-2">&rarr;</span>}
              className="mt-12"
            />
            {errors.root && (
              <span className="text-red-500 text-sm mt-4 block text-center">
                {errors.root.message}
              </span>
            )}
          </form>
        ) : (
          <div className="mt-6">
            <p className="text-center font-medium text-lg mb-10">
              Successfully submitted!!
            </p>
            <Button
              type="button"
              text="Back"
              onClick={() => setFormSubmitted(false)}
              preChild={<span className="ml-2">&larr;</span>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardForm;

import { string, z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { CustomerWithAddressDto } from '@pet-lovers/core/dtos'

import { useCallback } from 'react'
import {
  nameSchema,
  phoneSchema,
  addressSchema,
} from '@pet-lovers/validation/schemas'

const EMAIL_REGEX =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const customerSchema = z.object({
  name: nameSchema,
  socialName: nameSchema,
  email: string().refine((value) => value === '' ? true : EMAIL_REGEX.test(value), 'e-mail inválido'),
  address: addressSchema,
  phones: z.array(phoneSchema).min(1, 'deve haver pelo menos 1 telefone'),
})

type CustomerFormFields = z.infer<typeof customerSchema>

export function useCustomerForm(
  onSubmit: (customerWithAddressDto: CustomerWithAddressDto) => void,
  customerWithAddressDto?: CustomerWithAddressDto,
) {
  const { control, formState, register, handleSubmit } = useForm<CustomerFormFields>({
    defaultValues: {
      name: customerWithAddressDto?.name,
      socialName: customerWithAddressDto?.socialName,
      phones: customerWithAddressDto?.phones,
      email: customerWithAddressDto?.email,
      address: customerWithAddressDto?.address,
    },
    resolver: zodResolver(customerSchema),
  })

  const {
    fields: phoneFields,
    append: appendPhoneField,
    remove: removePhoneField,
  } = useFieldArray({ control, name: 'phones' })

  const addPhoneField = useCallback(() => {
    appendPhoneField({ number: '', codeArea: '12' })
  }, [appendPhoneField])

  function handleAppendPhoneFieldButtonClick() {
    addPhoneField()
  }

  function handlePopPhoneFieldButtonClick(phoneFieldIndex: number) {
    removePhoneField(phoneFieldIndex)
  }

  function handleFormSubmit(fields: CustomerFormFields) {
    const CustomerWithAddressDto: CustomerWithAddressDto = {
      name: fields.name,
      socialName: fields.socialName,
      email: fields.email,
      address: fields.address,
      phones: fields.phones,
    }

    onSubmit(CustomerWithAddressDto)
  }

  return {
    phoneFields,
    formControl: control,
    formErrors: formState.errors,
    registerField: register,
    handleSubmit: handleSubmit(handleFormSubmit),
    handleAppendPhoneFieldButtonClick,
    handlePopPhoneFieldButtonClick,
  }
}

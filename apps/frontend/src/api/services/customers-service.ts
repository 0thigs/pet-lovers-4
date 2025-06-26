import type { IApiClient, ICustomersService } from '@pet-lovers/core/interfaces'
import type { CustomerWithAddress } from '@pet-lovers/core/entities'
import { ApiResponse } from '@pet-lovers/core/responses'

import type { JavaServerCustomerDto } from '../types'
import { JavaServerCustomerMapper } from '../mappers'

export const CustomersService = (apiClient: IApiClient): ICustomersService => {
  const javaServerCustomerMapper = JavaServerCustomerMapper()

  return {
    async listCustomers() {
      const response = await apiClient.get<JavaServerCustomerDto[]>('/cliente/clientes')

      if (response.isFailure) {
        return new ApiResponse({ errorMessage: 'Erro ao buscar clientes' })
      }

      return new ApiResponse({
        body: response.body.map(javaServerCustomerMapper.toDto),
      })
    },

    async registerCustomer(customer: CustomerWithAddress) {
      return await apiClient.post(
        '/cliente/cadastrar',
        javaServerCustomerMapper.toJavaServer(customer),
      )
    },

    async updateCustomer(customer: CustomerWithAddress) {
      return await apiClient.put('/cliente/atualizar', {
        id: customer.id,
        ...javaServerCustomerMapper.toJavaServer(customer),
      })
    },

    async deleteCustomers(customerIds: string[]) {
      return await apiClient.delete('/cliente/excluir', { id: customerIds[0] })
    },
  }
}

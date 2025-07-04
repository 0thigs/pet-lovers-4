import { Button } from '@nextui-org/react'

import { PageTitle } from '@/components/commons/page-title'
import { Dialog } from '@/components/commons/dialog'
import { CustomersTable } from '@/components/commons/customers-table'
import { Icon } from '@/components/commons/icon'
import { CustomerForm } from '@/components/commons/customers-table/customer-form'
import { useCustomersPage } from './use-customers-page'

export const CustomersPage = () => {
  const {
    customers,
    isFetching,
    selectedCustomersIds,
    handleCustomerOrderItems,
    handleCustomersSelectionChange,
    handleDeleteButtonClick,
    handleRegisterCustomer,
    handleUpdateCustomer,
  } = useCustomersPage()

  return (
    <div className='flex flex-col gap-3'>
      <PageTitle>Clientes</PageTitle>

      <div className='flex items-center gap-2'>
        <Dialog
          title='Adicionar cliente'
          trigger={
            <Button
              endContent={<Icon name='add' size={20} />}
              radius='sm'
              className='bg-zinc-800 text-zinc-50 w-max'
            >
              Cadastrar cliente
            </Button>
          }
        >
          {(closeDialog) => (
            <CustomerForm
              onCancel={closeDialog}
              onSubmit={async (customerDto) => {
                closeDialog()
                await handleRegisterCustomer(customerDto)
              }}
            />
          )}
        </Dialog>
        {selectedCustomersIds.length > 0 && (
          <Button radius='sm' color='danger' onClick={() => handleDeleteButtonClick()}>
            Deletar cliente(s)
          </Button>
        )}
      </div>

      <CustomersTable
        hasActions={true}
        customers={customers}
        isLoading={isFetching}
        page={0}
        pagesCount={0}
        selectedCustomersIds={selectedCustomersIds}
        onUpdateCustomer={handleUpdateCustomer}
        onCustomersSelectionChange={(customersIds) =>
          handleCustomersSelectionChange(customersIds)
        }
        onCustomerOrderItems={() => handleCustomerOrderItems()}
      />
    </div>
  )
}

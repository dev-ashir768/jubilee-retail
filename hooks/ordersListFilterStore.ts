import {create} from "zustand"

interface OrdersListFilterStoreProps {
  filterValue: string,
  setFilterValue: (filterValue: string)=> void
}
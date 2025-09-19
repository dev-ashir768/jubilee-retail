import ProductCategoryList from '@/components/ui/product-category/product-category-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Category List | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <ProductCategoryList />
    </>
  )
}

export default page

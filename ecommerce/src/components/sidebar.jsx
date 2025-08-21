import { useGetRangeQuery } from '../app/productfilter';
const Sidebar = ({
  setCategory,
  saleprice,
  setPrice,
  setIsOpen,
  isOpen,
  setProductFilter,
  productcat,
  procat,
  handleFiltersChange
}) => {
  


  const {data,isLoading} = useGetRangeQuery()



  return (
    <>
      <button className='sidebar-toggle' onClick={() => setIsOpen(true)}>
        Filters
      </button>

      <div
        className={`sidebar-fixed ${isOpen ? 'open' : ''}`}
      >
        <div className='sidebar-header'>
          <h3>Filter Options</h3>
          <button className='sidebar-close' onClick={() => setIsOpen(false)}>×</button>
        </div>

        <ul className='sidebar-content'>
          <li className='filter-section'>
            <label>Product Name</label>
            <input
              type='text'
              className='filter-input'
              placeholder='Search products...'
              onChange={(e) => setProductFilter(e.target.value)}
            />
          </li>

          <li className='filter-section'>
            <label>Price</label>
            <select
              value={saleprice}
              className='filter-select'
              onChange={(e) => setPrice(e.target.value)}
            >
              <option  value=''>All</option>
            {data?.map((ranges,index)=>(
              
              <option key={index} value={ranges.range}>{ranges.range}</option>
            ))}
            
          </select>
          </li>

          <li className='filter-section'>
            <label>Category</label>
            <select
              value={productcat}
              className='filter-select'
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=''>All Categories</option>
              {procat?.map((cat, idx) => (
                <option key={idx}>{cat.productcat}</option>
              ))}
            </select>
          </li>

          <button className='apply-filter-btn' onClick={handleFiltersChange}>
            Apply Filters
          </button>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

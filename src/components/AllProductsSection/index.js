import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    // isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    categoryID: '',
    searchInput: '',
    ratingID: '',
    apiStatus: 'INITIAL',
    noProduct: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      //   isLoading: true,
      apiStatus: 'INPROGRESS',
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, categoryID, searchInput, ratingID} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryID}&title_search=${searchInput}&rating=${ratingID}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        // isLoading: false,
        apiStatus: 'SUCCESS',
        noProduct: false,
      })
      //   if (updatedData.length === 0) {
      //     this.setState({
      //       //   productsList: updatedData,
      //       // isLoading: false,

      //       apiStatus: 'noProduct',
      //       noProduct: true,
      //       productsList: updatedData,
      //     })
      //   } else {
      //     this.setState({
      //       productsList: updatedData,
      //       // isLoading: false,
      //       apiStatus: 'SUCCESS',
      //       noProduct: false,
      //     })
      //   }
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onClear = () => {
    this.setState(
      {categoryID: '', searchInput: '', ratingID: ''},
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble proccessing your request</p>
      <p>Please try again</p>
    </div>
  )

  onFilter = id => {
    // console.log(id)
    if (id.includes('searchInput')) {
      this.setState({searchInput: id[0]}, this.getProducts)
    } else if (id.includes('category')) {
      this.setState({categoryID: id[0]}, this.getProducts)
    } else if (id.includes('rating')) {
      this.setState({ratingID: id[0]}, this.getProducts)
    }
  }

  renderFilterView = () => (
    <div className="all-products-section">
      {/* TODO: Update the below element */}
      <FiltersGroup
        ratingsList={ratingsList}
        categoryList={categoryOptions}
        onFilter={this.onFilter}
        onClear={this.onClear}
      />

      {/* {isLoading ? this.renderLoader() : this.renderProductsList()} */}
    </div>
  )

  renderNoProductView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products.Try other filters.</p>
    </div>
  )

  render() {
    const {apiStatus, productsList, noProduct} = this.state
    // console.log(apiStatus, noProduct)
    console.log(productsList)
    console.log(productsList.length === [].length)

    switch (apiStatus) {
      case 'INPROGRESS':
        return (
          <div className="rendering-container">
            {this.renderFilterView()}
            {this.renderLoader()}
          </div>
        )
      case 'SUCCESS':
        return (
          <div className="rendering-container">
            {this.renderFilterView()}

            {productsList.length === [].length
              ? this.renderNoProductView()
              : this.renderProductsList()}
          </div>
        )
      case 'FAILURE':
        return (
          <div className="rendering-container">
            {this.renderFilterView()}
            {this.renderFailureView()}
          </div>
        )
      case 'noProduct':
        return (
          <div className="rendering-container">
            {this.renderFilterView()}
            {this.renderNoProductView()}
          </div>
        )
      default:
        return null
    }
  }
}

export default AllProductsSection

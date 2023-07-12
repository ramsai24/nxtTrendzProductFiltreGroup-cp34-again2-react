import {withRouter} from 'react-router-dom'
import {CgSearch} from 'react-icons/cg'
import './index.css'

const FiltersGroup = props => {
  const {categoryList, ratingsList, onFilter, onClear} = props
  //   console.log(categoryList, ratingsList)
  let inputEl
  const keyDown = event => {
    // console.log(event.key)
    if (event.key === 'Enter') {
      onFilter([event.target.value, 'searchInput'])
    }
    inputEl = ''
  }

  const clear = () => {
    onClear()
  }

  return (
    <div className="filters-group-container">
      <div>
        <input
          type="search"
          value={inputEl}
          placeholder="Search"
          onKeyDown={keyDown}
        />
        <CgSearch />
      </div>
      <h1>Category</h1>
      <ul>
        {categoryList.map(each => {
          const {categoryId} = each
          const filtering = () => {
            onFilter([categoryId, 'category'])
          }
          return (
            <li key={each.categoryId}>
              <button type="button" onClick={filtering}>
                <p>{each.name}</p>
              </button>
            </li>
          )
        })}
      </ul>
      <h1>Rating</h1>
      <ul>
        {ratingsList.map(each => {
          const {ratingId} = each
          const filtering = () => {
            onFilter([ratingId, 'rating'])
          }
          return (
            <li key={each.ratingId}>
              <button type="button" id="label" onClick={filtering}>
                <img
                  className="img"
                  src={each.imageUrl}
                  alt={`rating ${each.ratingId}`}
                />
                <label htmlFor="label"> &up</label>
              </button>
            </li>
          )
        })}
      </ul>
      <button type="button" onClick={clear}>
        Clear Filters
      </button>
    </div>
  )
}

export default withRouter(FiltersGroup)

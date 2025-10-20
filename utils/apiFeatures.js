class APIFeatures {
  constructor (query ,queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter () {
    const queryParams = { ...this.queryString };
    // 1. Remove fields not used for filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryParams[field]);

    // 2. Build filters
    const filters = {};
    for (const [key, value] of Object.entries(queryParams)) {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!filters[field])  {
          filters[field] = {};
        }
        filters[field][`$${operator}`] = isNaN(value) ? value : Number(value);
      } else {
        filters[key] = isNaN(value) ? value : Number(value);
      }
    }

    // 3. Build query
    this.query = this.query.find(filters)

    return this
  };

  sort () {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this
  }

  limitFields () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this
  }
  
  paginate () {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); 

    return this
  }
}

export default APIFeatures;
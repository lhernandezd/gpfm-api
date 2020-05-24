const paginate = ({ page, pageSize }) => {
  const offset = page ? page * pageSize : page;
  const limit = pageSize;
  return {
    offset,
    limit,
  };
};

module.exports = paginate;

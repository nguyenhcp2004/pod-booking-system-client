export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(Number(value.toFixed(2))) + ' VND'
}

export const formatCurrencyAmenityPage = (value: number | undefined) => {
  if (value === undefined || Number.isNaN(value)) {
    return '0'
  }
  return new Intl.NumberFormat('vi-VN').format(Number(value.toFixed(2)))
}

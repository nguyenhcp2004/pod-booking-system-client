export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(Number(value.toFixed(2))) + ' VND'
}

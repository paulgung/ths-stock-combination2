import axios from 'axios';

const baseUrl = 'https://testm.10jqka.com.cn/eq/open/api/gmg_stock_combination_backend'

// 获取组合信息
export async function getCombinationData(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/combination', {
    method: 'GET',
    params: params,
  });
}

// 获取组合信息
export async function getAllCombinationData(params?: { [key: string]: any }) {
  return axios(baseUrl + '/combination/v1/allCombination', {
    method: 'GET',
    params: params,
  });
}


// 获取子组合信息
export async function getSubcombinationData(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/subCombination', {
    method: 'GET',
    params: params,
  });
}

// 获取子组合信息
export async function getAllSubcombinationData(params?: { [key: string]: any }) {
  return axios(baseUrl + '/combination/v1/allSubCombination', {
    method: 'GET',
    params: params,
  });
}

// 获取股票信息
export async function getStockData(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/stocks', {
    method: 'GET',
    params: params,
  });
}

// 获取股票信息
export async function getAllStockData(params?: { [key: string]: any }) {
  return axios(baseUrl + '/combination/v1/stocks', {
    method: 'GET',
    params: params,
  });
}


// 新增组合信息
export async function addStockCombination(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/combination', {
    method: 'POST',
    data: params,
  });
}

// 新增子组合信息
export async function addSubStockCombination(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/subCombination', {
    method: 'POST',
    data: params,
  });
}

// 新增股票信息
export async function addStocks(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/stocks', {
    method: 'POST',
    data: params,
  });
}

// 修改组合信息
export async function updateStockCombination(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/combination', {
    method: 'PUT',
    params: params,
  });
}

// 修改子组合信息
export async function updateSubStockCombination(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/subCombination', {
    method: 'PUT',
    params: params,
  });
}

// 修改股票信息
export async function updateStocks(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/stocks', {
    method: 'PUT',
    params: params,
  });
}

// 删除组合信息
export async function deleteStockCombination(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/combination', {
    method: 'DELETE',
    params: params,
  });
}

// 删除子组合信息
export async function deleteSubStockCombination(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/subCombination', {
    method: 'DELETE',
    params: params,
  });
}

// 删除股票信息
export async function deleteStocks(params?: { [key: string]: any }) {
  return axios(baseUrl + '/admin/combination/v1/stocks', {
    method: 'DELETE',
    params: params,
  });
}

// 获取行情信息
export async function getStockQuotation(params?: { [key: string]: any }) {
  return axios(baseUrl + '/stock/v1/query_stock_quotation', {
    method: 'POST',
    data: params,
  });
}
import {
  getAllCombinationData,
  getAllStockData,
  getAllSubcombinationData,
  getStockQuotation,
} from '@/services/ths';
import { PageContainer, ProList } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import React, { ReactText, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type IInterface = {
  id: number;
};

// 欢迎页面
const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>([]);
  const [combinationDataSource, setCombinationDataSource] = useState<any[]>([]);
  const [subCombinationDataSource, setSubCombinationDataSource] = useState<any[]>([]);
  const [newDataSource, setNewDataSource] = useState<any[]>([]);
  const [combinationId, setCombinationId] = useState(0); //选中的组合ID
  const navigate = useNavigate();
  const [polling, setPolling] = useState<number | undefined>(2000); // 3秒一次轮询

  // 辅助方法
  const getStockColor = (item: any) => {
    if (item[0] === '+') {
      return { color: 'red' };
    } else if (item[0] === '-') {
      return { color: 'blue' };
    } else {
      return {};
    }
  };

  // 点击子组合更新股票列表
  const updateStockListFromSub = (subCombinationId: number) => {
    setCombinationId(subCombinationId);
    actionRef.current?.reload();
  };

  // 点击组合更新股票列表(全量)
  const updateStockList = (combinationId: number) => {
    setCombinationId(combinationId);
    actionRef.current?.reload();
  };

  // 点击股票跳转分时k线图
  const jumpKline = (stockCode: number, marketCode: number) => {
    window.open(`/kline/${stockCode}&${marketCode}`, '_blank');
  };

  useEffect(() => {
    // 全量获取组合数据
    getAllCombinationData({}).then(
      // 返回数据
      (res: any) => {
        const _data = res.data?.data.map((item: any) => {
          // proList 会读取title字段
          return { combinationName: item.combinationName, id: item.id };
        });
        setCombinationDataSource(_data);
      },
      // 失败处理
      (): any => {
        message.error('网络请求失败！');
        return {
          data: [],
          success: false,
          total: 0,
        };
      },
    );
    // 全量获取子组合数据
    getAllSubcombinationData({}).then(
      // 返回数据
      (res: any) => {
        const _dataWithSubconbination = res.data?.data.map((item: any) => {
          // proList 会读取title字段
          return {
            combinationId: item.combinationId,
            id: item.id,
            combinationName: item.combinationName,
          };
        });
        setSubCombinationDataSource(_dataWithSubconbination);
      },
      // 失败处理
      (): any => {
        message.error('网络请求失败！');
        return {
          data: [],
          success: false,
          total: 0,
        };
      },
    );
  }, []);

  useEffect(() => {
    const _newDataSource = combinationDataSource.map((item) => {
      const subList = subCombinationDataSource.filter((item2) => {
        return item.id === item2.combinationId;
      });
      return { ...item, subList };
    });

    setNewDataSource(_newDataSource);
  }, [combinationDataSource, subCombinationDataSource]);

  // 列信息
  const columns: ProColumns<IInterface>[] = [
    {
      title: '股票名称',
      ellipsis: true,
      dataIndex: 'stockName',
      hideInSearch: true,
      render: (item, record: any) => {
        return (
          <a
            onClick={() => jumpKline(record?.stockCode, record?.marketId)}
            target="_blank"
            rel="noreferrer"
          >
            {item}
          </a>
        );
      },
    },
    {
      title: '股票编号',
      ellipsis: true,
      dataIndex: 'stockCode',
      hideInSearch: true,
    },
    {
      title: '市场编号',
      ellipsis: true,
      dataIndex: 'marketId',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '股票价格',
      dataIndex: 'stockPrice',
      hideInSearch: true,
      sorter: true
    },
    {
      title: '涨跌幅',
      dataIndex: 'stockGains',
      hideInSearch: true,
      sorter: true,
      render: (item: any) => {
        return <div style={getStockColor(item)}>{item}</div>;
      },
    },
  ];


  const tableRequest = async ({ pageSize = 10, current }: {
    pageSize?: number | undefined;
    current?: number | undefined;
    keyword?: string | undefined;
  }, sort: Record<string, SortOrder>) => {

    return getAllStockData({
      pageSize: pageSize,
      pageNo: current,
      combinationId: combinationId ? combinationId : null,
    }).then(
      async (res: any) => {
        const stock_id_list = res.data?.data.map((item: any) => {
          return {
            market_id: item.marketId,
            stock_code: item.stockCode,
          };
        });
        let sort_mode = 1; //排序模式（0-股票价格，1-涨跌幅）
        let sort_rule = -1; //排序规则（1-升序，-1-降序）
        const page_num = 1;
        const page_size = 10;

        if (Object.keys(sort).length > 0) {
          sort_mode = Object.keys(sort)[0] === 'stockPrice' ? 0 : 1;
          sort_rule = sort[Object.keys(sort)[0]] === 'ascend' ? 1 : -1;
        }

        const quotations: any = await getStockQuotation({
          stock_id_list,
          sort_mode,
          sort_rule,
          page_num,
          page_size,
        });
        // quotations为最新行情列表（排序后），res为原本的所有股票列表
        const _data = quotations.data.data.list.map((item: any) => {
          const subList = res.data.data.filter((item2: any) => {
            return item.stock_code === item2.stockCode;
          });
          
          return {
            ...subList[0],
            stockName: item.stock_name,
            stockCode: item.stock_code,
            stockPrice: item.newest_price,
            stockGains: `${Number(item.newest_uplift) > 0 ? '+' : ''}${Number(
              item.newest_uplift,
            ).toFixed(2)}%`,
          }
        })
        // const _data = res.data?.data.map((item: any) => {
        //   const subList = quotations.data.data.list.filter((item2: any) => {
        //     return item.stockCode === item2.stock_code;
        //   });
        //   return {
        //     ...item,
        //     stockName: subList[0].stock_name,
        //     stockCode: subList[0].stock_code,
        //     stockPrice: subList[0].newest_price,
        //     stockGains: `${Number(subList[0].newest_uplift) > 0 ? '+' : ''}${Number(
        //       subList[0].newest_uplift,
        //     ).toFixed(2)}%`,
        //   };
        // });

        return {
          data: _data,
          success: res.data?.success,
          total: res.data?.total,
        };
      },
      (): any => {
        message.error('网络请求失败！');
        return {
          data: [],
          success: false,
          total: 0,
        };
      },
    );
  };
  return (
    <PageContainer
      header={{
        title: null,
        breadcrumb: {},
      }}
    >
      {/*系统介绍*/}
      <div
        style={{
          display: 'flex',
          marginTop: '24px',
          height: '700px',
          background: '#fff',
          width: '100%',
        }}
      >
        {/* 左侧股票组合 */}
        <div style={{ width: '50%', height: '700px' }}>
          <ProList<{ title: string }>
            rowKey="title"
            headerTitle=""
            expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
            dataSource={newDataSource}
            metas={{
              title: {
                render: (_, row: any) => {
                  return <div onClick={() => updateStockList(row.id)}>{row.combinationName}</div>;
                },
              },
              description: {
                render: (_, row: any) => {
                  return (
                    <div>
                      {row.subList.map((item: any) => {
                        return (
                          <div
                            key={item.id}
                            style={{
                              color: 'black',
                              fontWeight: 400,
                              cursor: 'pointer',
                              marginTop: '10px'
                            }}
                            onClick={() => updateStockListFromSub(item.id)}
                          >
                            {item.combinationName}
                          </div>
                        );
                      })}
                    </div>
                  );
                },
              },
            }}
          />
        </div>
        {/* 右侧股票信息 */}
        <div style={{ width: '50%', background: '#fff' }}>
          <ProTable
            headerTitle="股票信息"
            columns={columns}
            actionRef={actionRef}
            cardBordered
            search={false}
            polling={polling || undefined}
            request={tableRequest}
            editable={{
              type: 'multiple',
            }}
            rowKey="id"
            options={{
              setting: {
                listsHeight: 400,
              },
            }}
            pagination={{
              pageSize: 10,
            }}
            dateFormatter="string"
          />
        </div>
        {/* 悬浮按钮 */}
        <div style={{ position: 'fixed', bottom: '40px', left: '70px' }}>
          <Button onClick={() => navigate(`/ths/combination`)}>进入后台</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Welcome;
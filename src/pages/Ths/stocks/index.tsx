import { addStocks, getStockData, getStockList } from '@/services/ths';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

type IInterface = {
  id: number;
};

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

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { subId: subCombinationId } = useParams(); // 获取父组合id
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const formRef = useRef(null); //表单引用
  const [stockList, setStockList] = useState([]);

  const columns: ProColumns<IInterface>[] = [
    {
      title: '组合ID',
      hideInSearch: false,
      dataIndex: 'combinationId',
    },
    // {
    //   title: '子组合ID',
    //   hideInSearch: false,
    //   dataIndex: 'subCombinationId',
    // },
    {
      title: '股票ID',
      hideInSearch: true,
      dataIndex: 'id',
    },
    {
      title: '股票名称',
      ellipsis: true,
      dataIndex: 'stockName',
      hideInSearch: true,
      render: (item, record: any) => {
        return (
          <a href={record?.stockUrl} target="_blank" rel="noreferrer">
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
      title: '股票价格',
      dataIndex: 'stockPrice',
      hideInSearch: true,
    },
    {
      title: '涨跌幅',
      dataIndex: 'stockGains',
      hideInSearch: true,
      render: (item: any) => {
        return <div style={getStockColor(item)}>{item}</div>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<IInterface>
        headerTitle="股票信息"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async ({ rows = 10, current, combinationId }) => {
          return getStockData({
            pageSize: rows,
            pageNo: current,
            combinationId,
          }).then(
            (res: any) => {
              return {
                data: res.data?.data,
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
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            新增
          </Button>,
        ]}
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

      {/* 弹框 */}
      <ModalForm
        labelCol={{ span: 5 }}
        formRef={formRef}
        title="新增股票信息"
        layout={'horizontal'}
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const _value = {
            ...value,
            combinationId: parseInt(value.combinationId),
          };
          const success = await addStocks(_value);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          label="组合ID"
          width="md"
          name="combinationId"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          label="市场ID"
          width="md"
          name="marketId"
        />
        <ProFormSelect
          name="stockCode"
          label="股票代码"
          width="md"
          showSearch
          debounceTime={300}
          request={async ({ keyWords }) => {
            const res = await getStockList({ keywords: keyWords, page_num: 1, page_size: 5 });
            const list = res.data.data.list.map((item: any) => {
              return { value: item.stock_code, label: item.stock_code };
            });
            setStockList(res.data.data.list);
            return list;
          }}
          onChange={(value) => {
            const res: any = stockList.find((item: any) => {
              console.log(item);
              // 找到股票代码对应的那条记录，然后取market_id启到联动效果。
              return item.stock_code === value;
            });
            formRef?.current.setFieldsValue({ marketId: res.market_id }); // 更新 ProFormText 的值
          }}
          rules={[{ required: true }]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default Index;

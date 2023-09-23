import {
  addSubStockCombination,
  deleteSubStockCombination,
  getSubcombinationData,
  updateSubStockCombination,
} from '@/services/ths';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type IInterface = {
  id: number;
};

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { id: combinationId } = useParams(); // 获取父组合id
  const navigate = useNavigate();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState({}); //设置要编辑的组合
  const [deleteRecord, setDeleteRecord] = useState<any>({}); // 设置要删除的组合
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 携带子组合id跳转组合列表
  const jumpStocks = (id: number): void => {
    navigate(`/ths/stocks/${id}`);
  };
  const columns: ProColumns<IInterface>[] = [
    {
      title: '组合ID',
      hideInSearch: false,
      dataIndex: 'combinationId',
    },
    {
      title: '子组合ID',
      ellipsis: true,
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '子组合名称',
      ellipsis: true,
      dataIndex: 'combinationName',
      hideInSearch: true,
      render: (item, record) => {
        return (
          <div style={{ color: 'red', cursor: 'pointer' }} onClick={() => jumpStocks(record.id)}>
            {item}
          </div>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setCurrentRow(record);
            handleModalOpen(true);
            setIsEditing(true);
          }}
        >
          编辑
        </a>,
        <a
          key="editState"
          onClick={() => {
            handleDeleteModalOpen(true);
            setDeleteRecord(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<IInterface>
        headerTitle="子组合信息"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async ({ rows = 10, current, combinationId: _combinationId }) => {
          return getSubcombinationData({
            pageSize: rows,
            pageNo: current,
            combinationId: _combinationId ? _combinationId : combinationId,
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
        title={isEditing ? '编辑子组合' : '新增子组合'}
        layout={'horizontal'}
        width="500px"
        initialValues={currentRow}
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const _value = {
            ...value,
            combinationId: parseInt(value.combinationId),
          };
          const success = (await isEditing)
            ? updateSubStockCombination(_value)
            : addSubStockCombination(_value);
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
          disabled={isEditing}
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          label="子组合名称"
          width="md"
          name="combinationName"
        />
      </ModalForm>

      {/* 删除弹框 */}
      <ModalForm
        labelCol={{ span: 4 }}
        title="删除组合"
        layout={'horizontal'}
        width="500px"
        open={deleteModalOpen}
        onOpenChange={handleDeleteModalOpen}
        onFinish={async () => {
          const success = await deleteSubStockCombination({ id: deleteRecord.id });
          if (success) {
            handleDeleteModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <div>你确定要删除该子组合吗？</div>
      </ModalForm>
    </PageContainer>
  );
};
export default Index;
